import os
import json


def table_format(*L):
    return [dict(zip(L[0], x)) for x in L[1:]]


def tags():
    data = []
    for i, fields in enumerate(table_format(
        ('name',),
        ('python',), ('ruby',), ('rust',), ('javascript',)
    ), 1):
        data.append({
            'model': 'api.tag',
            'pk': i,
            'fields': fields,
        })
    with open(os.path.join(os.path.dirname(__file__), 'tags.json'), 'w') as f:
        f.write(json.dumps(data))


def articles():
    data = []
    for i, fields in enumerate(table_format(
        ('title', 'body', 'slug', 'published', 'created_at', 'updated_at', 'tags'),
        ('タグなし', 'タグなしだ', 'without-tag', True, '2017-04-09 12:30:00', '2017-04-09 12:30:00', []),
        ('タグあり', 'タグありだ', 'with-tag', True, '2017-04-10 12:30:00', '2017-04-10 12:30:00', [1, 2]),
        ('未公開', '未公開だよ', 'not-published', False, '2017-04-11 12:30:00', '2017-04-11 12:30:00', []),
    ), 1):
        data.append({
            'model': 'api.article',
            'pk': i,
            'fields': fields,
        })
    with open(os.path.join(os.path.dirname(__file__), 'articles.json'), 'w') as f:
        f.write(json.dumps(data))


tags()
articles()
