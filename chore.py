# -*- coding: utf-8 -*-
import sys
import os
import time

from jinja2 import Environment, FileSystemLoader
import yaml
from markdown import Markdown


class FileExistsError(Exception):
    pass


class RequiredError(Exception):
    pass


ARTICLE_TEMPLATE = '''title:
slug: {slug}
utime: {utime}
date: {date}
tags:
  -
publish: false
edit: true
body: |-
'''

REQUIRED = ['title', 'slug', 'utime', 'date', 'publish', 'edit', 'body']

MD_EXTS = ['markdown.extensions.' + x for x in [
    'fenced_code', 'tables', 'smart_strong', 'sane_lists'
]]

md = Markdown(extensions=MD_EXTS)
env = Environment(loader=FileSystemLoader('./templates', encoding='utf8'))


def create(args):
    assert args
    slug = args[0]

    utime = int(time.time())
    path = os.path.join('./post', time.strftime(
      '%Y/%m/%d', time.localtime(utime)))
    os.makedirs(path, exist_ok=True)

    article_path = os.path.join(path, slug + '.yml')
    if os.path.exists(article_path):
        raise FileExistsError('`{}` exists'.format(article_path))

    with open(article_path, 'w') as f:
        date = time.strftime('%Y/%m/%d %H:%M:%S', time.localtime(utime))
        f.write(ARTICLE_TEMPLATE.format(slug=slug, utime=utime, date=date))
    print('vim {}'.format(article_path))


def convert_all():
    for root, dirs, files in os.walk('./post'):
        if not files:
            continue
        for f in files:
            convert_one(os.path.join(
                root.replace('./post/', ''), f.replace('.yml', '')))


def convert_one(path):
    article_path = os.path.join('./post', path + '.yml')
    try:
        with open(article_path) as f:
            data = yaml.load(f)
    except FileNotFoundError:
        date_path = '/'.join(article_path.split('/')[:-1])
        print('oops.\n{} has:  \n{}'.format(
            ''.join(date_path),
            '\n'.join(map(lambda x: '\t' + x, os.listdir(date_path)))
        ))
        return
    required = []
    for k, v in data.items():
        if v is None and k in REQUIRED:
            required.append(k)
    if required:
        raise RequiredError('required: {}'.format(', '.join(required)))

    if data['edit']:
        return

    data['body'] = md.convert(data['body'])
    data['tags'] = [d for d in data['tags'] if d is not None]
    splitted = path.split('/')
    article_dir = os.path.join('./article', '/'.join(splitted[:-1]))
    os.makedirs(article_dir, exist_ok=True)

    with open(os.path.join(article_dir, splitted[-1] + '.html'), 'w') as f:
        template = env.get_template('article.html')
        f.write(template.render(data))


def tagging():
    tags = {}
    for root, dirs, files in os.walk('./post'):
        if not files:
            continue
        for article in files:
            article_path = os.path.join(root, article)
            with open(article_path) as f:
                data = yaml.load(f)
            if not data['publish']:
                continue
            if data['tags'] and all(data['tags']):
                for tag in data['tags']:
                    t = tags.setdefault(tag, [])
                    t.append({
                        'path': os.path.splitext(
                            article_path.replace('./post', './article'))[0],
                        'title': data['title'],
                        'utime': data['utime']
                    })

    for name, articles in tags.items():
        with open(os.path.join('./tag', name + '.html'), 'w') as f:
            template = env.get_template('tag.html')
            articles.sort(key=lambda x: -x['utime'])
            f.write(template.render({'name': name, 'articles': articles}))


def build(args):
    print('converting yaml to html.')
    convert_all()

    print('tagging.')
    tagging()

    print('building.')
    articles = []
    for root, dirs, files in os.walk('./article'):
        if not files:
            continue
        entries = []
        for article in files:
            with open(os.path.join(root.replace('article', 'post'),
                                   article.replace('html', 'yml'))) as f:
                data = yaml.load(f)
            entries.append({
                'href': os.path.join(root, os.path.splitext(article)[0]),
                'title': data['title']
            })
        articles.insert(-1, {
            'created_date': root.replace('./article/', ''),
            'entries': entries
        })

    with open('./index.html', 'w') as f:
        template = env.get_template('index.html')
        f.write(template.render({'articles': articles}))


if __name__ == '__main__':
    assert sys.argv
    name = sys.argv[1]
    args = None
    if len(sys.argv) > 2:
        args = sys.argv[2:]

    CMDS = {
        'create': create,
        'build': build
    }

    func = CMDS[name](args)
