import os
import json
from datetime import datetime as dt


def table_format(*L):
    return [dict(zip(L[0], x)) for x in L[1:]]


def json_serial(obj):
    if isinstance(obj, dt):
        return obj.isoformat()


data = []
# articles
for i, fields in enumerate(table_format(
    ('title', 'body', 'slug', 'published', 'created_at', 'updated_at', 'tags'),
    ('タグなし', 'タグなしだ', 'without-tag', True, dt(2017, 4, 9), dt(2017, 4, 9), []),
    ('タグあり', 'タグありだ', 'with-tag', True, dt(2017, 4, 10), dt(2017, 4, 10), [1, 2]),
    ('未公開', '未公開だよ', 'not-published', False, dt(2017, 4, 11), dt(2017, 4, 11), [3]),
), 1):
    data.append({
        'model': 'api.article',
        'pk': i,
        'fields': fields,
    })

# tags
for i, fields in enumerate(table_format(
    ('name',),
    ('python',),
    ('ruby',),
    ('rust',),
    ('javascript',),
), 1):
    data.append({
        'model': 'api.tag',
        'pk': i,
        'fields': fields,
    })
with open(os.path.join(os.path.dirname(__file__), 'fixture.json'), 'w') as f:
    f.write(json.dumps(data, default=json_serial))
