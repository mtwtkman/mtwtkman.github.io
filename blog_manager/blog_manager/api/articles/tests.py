import json
from datetime import datetime

from django.http.response import Http404
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

    def test_404(self):
        with self.assertRaises(Http404):
            self._callFUT(2)


class ArticlePutTest(TestCase):
    def setUp(self):
        t1 = factories.TagFactory(name='t1')
        factories.ArticleFactory(pk=1, tags=(t1,))
        factories.TagFactory(name='t2')

    def _callFUT(self, pk, data):
        request = RequestFactory().put('', json.dumps(data))
        from . import views
        return views.article(request, pk)

    def assert200(self, resp):
        self.assertEqual(resp.status_code, 200)

    def assertObj(self, pk, expect, tags):
        obj = models.Article.objects.get(pk=pk)
        for k, v in expect.items():
            if k == 'tags':
                self.assertEqual(obj.tags.all().count(), len(tags))
                self.assertEqual(
                    [x for x in obj.tags.all().values_list('pk', flat=True)],
                    tags
                )
                continue
            self.assertEqual(getattr(obj, k), v)

    def test_ok_remove_tag(self):
        pk = 1
        data = {
            'id': pk,
            'title': 'updated title',
            'body': 'this is updated body',
            'slug': 'update-slug',
            'published': True,
            'tags': None,
        }
        resp = self._callFUT(pk, data)
        self.assert200(resp)
        self.assertObj(pk, data, [])

    def test_ok_add_tag(self):
        pk = 1
        data = {
            'id': pk,
            'title': 'updated title',
            'body': 'this is updated body',
            'slug': 'update-slug',
            'published': True,
            'tags': 't1,t2',
        }
        resp = self._callFUT(pk, data)
        self.assert200(resp)
        self.assertObj(pk, data, ['t1', 't2'])


class ArticleDeleteTest(TestCase):
    def setUp(self):
        t1 = factories.TagFactory(pk='t1')
        factories.TagFactory(pk='t2')
        factories.ArticleFactory(pk=1, tags=(t1,))

    def lazy_count(self):
        return models.Article.objects.all().count()

    def _callFUT(self, pk):
        request = RequestFactory().delete('')
        from . import views
        return views.article(request, pk)

    def test_ok(self):
        article_total = self.lazy_count()
        resp = self._callFUT(1)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(self.lazy_count(), article_total - 1)
