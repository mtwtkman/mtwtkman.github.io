# -*- coding: utf-8 -*-
import re
import os
import sys
import json
import shutil
import itertools
import subprocess
from datetime import datetime

import yaml
import PyRSS2Gen
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class FileExistsError(Exception):
    pass


ARTICLE_TEMPLATE = '''title:
slug: {slug}
date: {date}
tags:
  -
publish: false
body: |-
'''

REQUIRED = ('title', 'slug', 'date', 'publish', 'body')
NODE_BIN = 'node_modules/.bin'
IGNORE = ('index.json', 'tagging.json')

def build():
    to_json()
    index()
    tagging()
    css()
    rss()
    webpack()


def new(slug):
    now = datetime.now()
    path = os.path.join('./articles', now.strftime('%Y/%m/%d'))
    os.makedirs(path, exist_ok=True)

    yaml_path = os.path.join(path, slug + '.yml')
    if os.path.exists(yaml_path):
        raise FileExistsError('`{}` exists'.format(yaml_path))

    with open(yaml_path, 'w') as f:
        date = now.strftime('%Y/%m/%d %H:%M:%S')
        f.write(ARTICLE_TEMPLATE.format(slug=slug, date=date))

    index()


def delete(path):
    path = './articles/' + path + '.yml'
    try:
        os.remove(path)
    except OSError:
        print('file not found')
    try:
        os.removedirs('/'.join(path.split('/')[:-1]))
    except OSError:
        pass
    index()


def traverse(ext='json', exclude_draft=True):
    assert ext in ['json', 'yml']
    for root, dirs, files in os.walk('./articles'):
        for _file in files:
            if _file in IGNORE:
                continue
            if not _file.endswith('.{}'.format(ext)):
                continue
            with open(os.path.join(root, _file)) as f:
                data = {
                    'json': json.loads,
                    'yml': yaml.safe_load,
                }.get(ext)(f.read())
            if exclude_draft and not data['publish']:
                continue
            yield root, data, _file


def to_json():
    for root, data, _file in traverse('yml', False):
        target = re.sub(r'\.yml$', '.json', _file)
        print('now convert {} to {}'.format(_file, target))
        with open(os.path.join(root, target), 'w') as f:
            f.write(json.dumps(data))
        print('done')

def index():
    result = []
    for root, data, _file in traverse():
        year, month, day = root.replace('./articles/', '').split('/')
        result.append({
            'title': data['title'],
            'slug': data['slug'],
            'year': year,
            'month': month,
            'day': day,
        })

    result.sort(key=lambda x: (x['year'], x['month'], x['day']), reverse=True)
    print('now update index')
    with open('./articles/index.json', 'w') as f:
        f.write(json.dumps(result))
    print('done')


def tagging():
    result = {}
    for root, data, _file in traverse():
        for tag in data['tags']:
            t = result.setdefault(tag, [])
            t.insert(0, {
                'path': os.path.join(root.replace('./articles/', ''),
                                     _file.replace('.json', '')),
                'title': data['title']
            })

    print('now update tagging')
    with open('./articles/tagging.json', 'w') as f:
        f.write(json.dumps(result))
    print('done')


def css():
    os.mkdir('tmp')
    i = itertools.count(1)
    for root, dirs, files in os.walk('./assets/styl'):
        for _file in files:
            subprocess.call([
                os.path.join(NODE_BIN, 'stylus'),
                os.path.join(root, _file),
                '-o',
                './tmp/{}.css'.format(next(i))
            ])
    cmd = ' '.join([
        os.path.join(NODE_BIN, 'cleancss'),
        './tmp/*.css',
        '-o',
        'bundle.css'
    ])
    subprocess.call([cmd], shell=True)
    shutil.rmtree('./tmp')


def webpack():
    subprocess.call([os.path.join(NODE_BIN, 'webpack'), '--config', 'webpack/prod.js'])


class StylEventHandler(FileSystemEventHandler):
    def on_modified(self, event):
        print('build styl.')
        css()


def watch():
    # stylus watch
    observer = Observer()
    handler = StylEventHandler()
    observer.schedule(handler, './assets/styl', recursive=True)
    observer.start()
    try:
        # webpack watch
        subprocess.call([os.path.join(NODE_BIN, 'webpack'), '--watch'])
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


def rss():
    feed = PyRSS2Gen.RSS2(
        title='mtwtkman.github.io',
        link='http://mtwtkman.github.io',
        description='mtwtkman\'s site.',
        lastBuildDate=datetime.utcnow()
    )
    with open('articles/index.json') as f:
        articles = json.loads(f.read())

    for x in articles:
        with open('articles/{}/{}/{}/{}.json'.format(
            x['year'], x['month'], x['day'], x['slug'],
        )) as f:
            y = json.loads(f.read())
        dt = datetime.strptime(y['date'], '%Y/%m/%d %H:%M:%S').timetuple()
        feed.items.append(PyRSS2Gen.RSSItem(
            title=y['title'],
            link='http://mtwtkman.github.io/#/blog/article/{}/{}'.format(
                y['date'].split(' ')[0],
                y['slug']
            ),
            author='mtwtkman',
            pubDate=datetime(dt.tm_year,
                             dt.tm_mon,
                             dt.tm_mday,
                             dt.tm_hour,
                             dt.tm_min,
                             dt.tm_sec),
        ))

    print('now update rss')
    with open('rss.xml', 'w') as f:
        f.write(feed.to_xml('utf-8'))
    print('done')


def man():
    print('\n'.join([
        'Commands are:',
        ' --- To create/delete article ---',
        ' new <slug>                 : create new article.',
        ' del <YYYY>/<MM>/<DD>/<slug>: delete article.',
        '',
        ' --- To build ---',
        ' idx  : create index list.',
        ' tag  : create tag list.',
        ' build: build all articles.',
        ' css  : compile stylesheets.',
        ' watch: start watch tasks.',
        ' rss  : generate rss feed.',
        ' json : convert yaml to json.',
    ]))


if __name__ == '__main__':
    assert len(sys.argv) != 1
    cmd = sys.argv[1]
    if cmd in ('new', 'del'):
        assert len(sys.argv) == 3
        {
            'new': new,
            'del': delete
        }[cmd](sys.argv[2])
    elif cmd == 'idx':
        index()
    elif cmd == 'tag':
        tagging()
    elif cmd == 'build':
        build()
    elif cmd == 'css':
        css()
    elif cmd == 'watch':
        watch()
    elif cmd == 'rss':
        rss()
    elif cmd == 'json':
        to_json()
    else:
        man()
