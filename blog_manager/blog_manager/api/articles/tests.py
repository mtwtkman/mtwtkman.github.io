import json
from datetime import datetime

from django.test import TestCase, RequestFactory

from .. import models
from .. import factories


table_format = lambda *L: [dict(zip(L[0], x)) for x in L[1:]]


class ArticlesGetTest(TestCase):
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
        return views.articles(request)

    def test_ok(self):
        resp = self._callFUT()
        expect = [{
            'year': '2017',
            'months': [{
                'month': '05',
                'days': [{
                    'id': 4,
                    'title': 'title_4',
                }]
            },
            {
                'month': '04',
                'days': [{
                    'id': 3,
                    'title': 'title_3',
                },
                {
                    'id': 2,
                    'title': 'title_2',
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
                }]
            }]
        }]
        self.assertEqual(json.loads(resp.content), expect)


class ArticleCreateFormTest(TestCase):
    def lazy_count(self):
        return models.Article.objects.all().count()

    def setUp(self):
        factories.TagFactory()

    def _makeOne(self, data):
        from . import forms
        return forms.ArticleCreateForm(data)

    def test_ok_without_tag(self):
        data = {
            'title': 'title',
            'body': 'body',
            'tags': None,
            'published': True,
            'slug': 's-l-u-g',
        }
        form = self._makeOne(data)
        self.assertTrue(form.is_valid())
        count = self.lazy_count()
        form.save()
        self.assertEqual(self.lazy_count(), count + 1)

    def test_ok_with_tag_which_already_exists(self):
        data = {
            'title': 'title',
            'body': 'body',
            'tags': 'tag_1',
            'published': True,
            'slug': 's-l-u-g',
        }
        form = self._makeOne(data)
        self.assertTrue(form.is_valid())
        count = self.lazy_count()
        form.save()
        self.assertEqual(self.lazy_count(), count + 1)


class ArticlesPostTest(TestCase):
    def _callFUT(self, data):
        request = RequestFactory().post(
            '', json.dumps(data), content_type='application/json'
        )
        from . import views
        return views.articles(request)

    def test_ok(self):
        data = {
            'title': 'hoge',
            'body': 'this is body',
            'tags': None,
            'published': True,
            'slug': 'ho-ge',
        }
        resp = self._callFUT(data)
        self.assertEqual(resp.status_code, 200)


class ArticleGetTest(TestCase):
    def setUp(self):
        factories.ArticleFactory(pk=1)

    def _callFUT(self, pk):
        request = RequestFactory().get('')
        from . import views
        return views.article(request, pk)

    def test_ok(self):
        pk = 1
        response = self._callFUT(pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['id'], pk)
