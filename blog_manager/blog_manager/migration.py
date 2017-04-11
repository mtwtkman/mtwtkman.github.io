import django
django.setup()

import os
import json
from datetime import datetime

from api.models import Article, Tag
start = os.path.join(
    os.path.abspath(os.path.dirname(__file__)), 'data'
)

def tags():
    with open(os.path.join(start, 'tagging.json')) as f:
        tags = json.loads(f.read()).keys()

    for tag in tags:
        yield Tag.objects.create(
            name=tag
        )

def articles():
    tag_objs = {o.name: o for o in tags()}
    def traverse(cwd):
        for root, dirs, files in os.walk(cwd):
            if dirs:
                for d in dirs:
                    yield from traverse(os.path.join(cwd, d))
            elif files:
                for f in files:
                    p = os.path.join(cwd, f)
                    if os.path.exists(p):
                        yield p


    def key(x):
        splited = x.split('/')
        return splited[-4], splited[-3], splited[-2]

    files = sorted(list(set(traverse(start))), key=key)
    for f in files:
        with open(f) as fp:
            data = json.loads(fp.read())
        d = datetime.strptime(data['date'], '%Y/%m/%d %H:%M:%S').isoformat()
        a = Article.objects.create(
            title=data['title'],
            body=data['body'],
            slug=data['slug'],
            published=data['publish'],
        )
        a.created_at = d
        a.updated_at = d
        a.save()
        for t in data['tags']:
            a.tags.add(tag_objs[t])
articles()
