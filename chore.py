# -*- coding: utf-8 -*-
import os
import sys
import time
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
utime: {utime}
date: {date}
tags:
  -
publish: false
body: |-
'''

REQUIRED = ('title', 'slug', 'utime', 'date', 'publish', 'body')
NODE_BIN = 'node_modules/.bin'
IGNORE_YAML = ('index.yml', 'tags.yml')

def build():
    index()
    tagging()
    css()
    rss()
    webpack()


def new(slug):
    utime = int(time.time())
    path = os.path.join('./articles', time.strftime(
      '%Y/%m/%d', time.localtime(utime)))
    os.makedirs(path, exist_ok=True)

    yaml_path = os.path.join(path, slug + '.yml')
    if os.path.exists(yaml_path):
        raise FileExistsError('`{}` exists'.format(yaml_path))

    with open(yaml_path, 'w') as f:
        date = time.strftime('%Y/%m/%d %H:%M:%S', time.localtime(utime))
        f.write(ARTICLE_TEMPLATE.format(slug=slug, utime=utime, date=date))

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


def index():
    result = []
    for root, dirs, files in os.walk('./articles'):
        for _file in files:
            if _file in IGNORE_YAML:
                continue
            if not _file.endswith('.yml'):
                continue
            with open(os.path.join(root, _file)) as f:
                data = yaml.safe_load(f.read())
            if not data['publish']:
                continue

            year, month, day = root.replace('./articles/', '').split('/')
            result.append({
                'title': data['title'],
                'slug': data['slug'],
                'year': year,
                'month': month,
                'day': day,
            })
    result.sort(key=lambda x: (x['year'], x['month'], x['day']), reverse=True)
    with open('./articles/index.yml', 'w') as f:
        f.write(yaml.dump(result))


def tagging():
    result = {}
    for root, dirs, files in os.walk('./articles'):
        for _file in files:
            if _file in IGNORE_YAML:
                continue
            if not _file.endswith('.yml'):
                continue
            with open(os.path.join(root, _file)) as f:
                data = yaml.safe_load(f.read())
            if not data['publish']:
                continue
            for tag in data['tags']:
                t = result.setdefault(tag, [])
                t.insert(0, {
                    'path': os.path.join(root.replace('./articles/', ''),
                                         _file.replace('.yml', '')),
                    'title': data['title']
                })

    with open('./articles/tagging.yml', 'w') as f:
        f.write(yaml.dump(result))


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
    subprocess.call([os.path.join(NODE_BIN, 'webpack')])


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
    with open('articles/index.txt') as f:
        articles = f.read().splitlines()

    for x in articles:
        with open('articles/' + x) as f:
            y = yaml.safe_load(f.read())
        pubdate = time.localtime(y['utime'])
        feed.items.append(PyRSS2Gen.RSSItem(
            title=y['title'],
            link='http://mtwtkman.github.io/#/blog/article/{}/{}'.format(
                y['date'].split(' ')[0],
                y['slug']
            ),
            author='mtwtkman',
            pubDate=datetime(pubdate.tm_year,
                             pubdate.tm_mon,
                             pubdate.tm_mday,
                             pubdate.tm_hour,
                             pubdate.tm_min,
                             pubdate.tm_sec),
        ))

    with open('rss.xml', 'w') as f:
        f.write(feed.to_xml('utf-8'))


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
        ' rss  : generate rss feed.'
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
    else:
        man()
