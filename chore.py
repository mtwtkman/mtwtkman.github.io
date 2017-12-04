# -*- coding: utf-8 -*-
import re
import os
import sys
import json
import time
import shutil
import sqlite3
import itertools
import subprocess
import contextlib
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
        subprocess.call([os.path.join(NODE_BIN, 'webpack'), '--watch', '--config', 'webpack/dev.js'])
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


DB = './editor/blog.db'

def sql():
    if os.path.exists(DB):
        os.remove(DB)

    conn = sqlite3.connect(DB)
    with contextlib.closing(conn.cursor()) as cursor:
        print('create tables')
        with open('blog.ddl') as f:
            cursor.executescript(f.read())
        print('done')

        with open('articles/tagging.json') as f:
            tags = {
                t: i for i, t in
                enumerate({t for t in json.loads(f.read()).keys()}, 1)
            }
            print('insert tags')
            cursor.executemany('insert into tags(name, id) values (?, ?)', list(tags.items()))
            print('done')

        max_tag_id = len(tags.values())

        print('insert articles and taggings')
        for i, (_, x, _) in enumerate(traverse(exclude_draft=False), 1):
            d = datetime.strptime(x['date'], '%Y/%m/%d %H:%M:%S')
            article = (i, x['title'], x['slug'], x['publish'], str(d.year), '{:02}'.format(d.day), '{:02}'.format(d.month))
            print(article)
            cursor.execute(
                'insert into articles(id, title, slug, published, year, day, month) values (?, ?, ?, ?, ?, ?, ?)',
                article
            )
            if not all(x['tags']):
                continue
            not_registered = set(x['tags']) - set(tags.keys())
            if not_registered:
                not_registered_tags = {t: max_tag_id + i for i, t in enumerate(not_registered, 1)}
                cursor.executemany(
                    'insert into tags(name, id) values (?, ?)',
                    [(t, i) for t, i in not_registered_tags.items()]
                )
                max_tag_id += len(not_registered_tags)
                tags.update(not_registered_tags)
            tagging = [(article[0], tags[t]) for t in x['tags']]
            cursor.executemany('insert into taggings(article_id, tag_id) values (?, ?)', tagging)
        print('done')
        conn.commit()


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
        ' sql  : import json data to sql.',
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
    elif cmd == 'sql':
        sql()
    else:
        man()
