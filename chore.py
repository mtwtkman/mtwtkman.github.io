# -*- coding: utf-8 -*-
import os
import sys
import time
import shutil
import functools

import yaml


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

REQUIRED = ['title', 'slug', 'utime', 'date', 'publish', 'body']


def build():
    reindex()
    tagging()

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

    reindex()


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
    reindex()


def reindex():
    paths = []
    for root, dirs, files in os.walk('./articles'):
        for _file in files:
            if not _file.endswith('.yml'):
                continue
            with open(os.path.join(root, _file)) as f:
                data = yaml.safe_load(f.read())
            if not data['publish']:
                continue
            paths.append(os.path.join(root.replace('./articles/', ''), _file))
    paths.sort(reverse=True)

    with open('./articles/index.txt', 'w') as f:
        f.write('\n'.join(paths))


def tagging():
    result = {}
    for root, dirs, files in os.walk('./articles'):
        for _file in files:
            if not _file.endswith('.yml'):
                continue
            with open(os.path.join(root, _file)) as f:
                data = yaml.safe_load(f.read())
            if not data['publish']:
                continue
            for tag in data['tags']:
                t = result.setdefault(tag, [])
                t.append({
                    'path': os.path.join(root.replace('./articles/', ''), _file.replace('.yml', '')),
                    'title': data['title']
                })

    with open('tagging.yml', 'w') as f:
        f.write(yaml.dump(result))

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
        reindex()
    elif cmd == 'tag':
        tagging()
    elif cmd == 'build':
        build()
    else:
        print('invalid command')
