import json
from datetime import datetime

from django.test import TestCase, RequestFactory

from .. import factories


table_format = lambda *L: [dict(zip(L[0], x)) for x in L[1:]]


class ArticleIndexTest(TestCase):
    maxDiff = None

    def setUp(self):
        for data in table_format(
            ('pk', 'created_at'),
            (1, datetime(2016, 1, 1)),
            (2, datetime(2017, 4, 1)),
            (3, datetime(2017, 4, 2)),
            (4, datetime(2017, 5, 3)),
        ):
            factories.ArticleFactory(published=True, **data)

    def _callFUT(self):
        from . import views
        request = RequestFactory().get('')
        return views.index(request)

    def test_ok(self):
        resp = self._callFUT()
        expect = [{
            'year': '2017',
            'months': [{
                'month': '05',
                'days': [{
                    'id': 4,
                    'title': 'title_4',
                    'slug': 'slug-4',
                    'year': '2017',
                    'month': '05',
                    'day': '03',
                }]
            },
            {
                'month': '04',
                'days': [{
                    'id': 3,
                    'title': 'title_3',
                    'slug': 'slug-3',
                    'year': '2017',
                    'month': '04',
                    'day': '02',
                },
                {
                    'id': 2,
                    'title': 'title_2',
                    'slug': 'slug-2',
                    'year': '2017',
                    'month': '04',
                    'day': '01',
                }]
            }]
        },
        {
            'year': '2016',
            'months': [{
                'month': '01',
                'days': [{
                    'id': 1,
                    'title': 'title_1',
                    'slug': 'slug-1',
                    'year': '2016',
                    'month': '01',
                    'day': '01',
                }]
            }]
        }]
        self.assertEqual(json.loads(resp.content), expect)


class ArticlesGetTest(TestCase):
    def setUp(self):
        factories.ArticleFactory(pk=1, created_at=datetime(2017, 4, 3))
        factories.ArticleFactory(
            pk=2,
            published=True,
            created_at=datetime(2017, 4, 4)
        )

    def _callFUT(self, draft=False):
        from . import views
        q = {}
        if draft:
            q['draft'] = True
        request = RequestFactory().get('', q)
        return views.articles(request)

    def test_ok_published(self):
        resp = self._callFUT()
        data = json.loads(resp.content)
        expect = table_format(
            ('id', 'title', 'year', 'month', 'day', 'slug'),
            (2, 'title_2', '2017', '04', '04', 'slug-2'),
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data, expect)

    def test_ok_drafts(self):
        resp = self._callFUT(draft=True)
        data = json.loads(resp.content)
        expect = table_format(
            ('id', 'title', 'year', 'month', 'day', 'slug'),
            (1, 'title_1', '2017', '04', '03', 'slug-1'),
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data, expect)
