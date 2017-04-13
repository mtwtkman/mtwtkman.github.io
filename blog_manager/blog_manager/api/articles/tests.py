import json
from datetime import datetime

from django.test import TestCase, RequestFactory

from .. import factories


table_format = lambda *L: [dict(zip(L[0], x)) for x in L[1:]]


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
            ('id', 'title', 'path'),
            (2, 'title_2', '2017/04/04/slug-2'),
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data, expect)

    def test_ok_drafts(self):
        resp = self._callFUT(draft=True)
        data = json.loads(resp.content)
        expect = table_format(
            ('id', 'title', 'path'),
            (1, 'title_1', '2017/04/03/slug-1'),
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data, expect)
