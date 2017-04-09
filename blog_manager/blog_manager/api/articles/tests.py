import os
import json
import tempfile
from unittest import mock
from datetime import datetime

from django.test import TestCase, RequestFactory, override_settings

from .forms import DATETIME_FORMAT


temp_dir = tempfile.TemporaryDirectory(dir=os.path.dirname(__file__))


def table_format(*L):
    return [dict(zip(L[0], x)) for x in L[1:]]


class IndexDataTest(TestCase):
    maxDiff = None

    def setUp(self):
        self.mock_data = table_format(
            ('year', 'month', 'day', 'slug', 'title'),
            (2017, 3, 31, 'a-b-c', 'ABC'),
            (2017, 3, 1,  'd-e-f', 'DEF'),
            (2017, 2, 28, 'g-h-i', 'GHI'),
            (2016, 1, 31, 'j-k-l', 'JKL'),
        )

    def _callFUT(self):
        with mock.patch('api.utils.data_from') as M:
            from .views import index_data
            M.return_value = self.mock_data
            return index_data()

    def test_ok(self):
        result = self._callFUT()
        expect = [
            {
                'year': 2017,
                'months': [
                    {
                        'month': 3,
                        'days': [
                            {'year': 2017, 'month': 3, 'day': 31,
                             'slug': 'a-b-c', 'title': 'ABC'},
                            {'year': 2017, 'month': 3, 'day':  1,
                             'slug': 'd-e-f', 'title': 'DEF'},
                        ],
                    },
                    {
                        'month': 2,
                        'days': [{'year': 2017, 'month': 2, 'day': 28,
                                  'slug': 'g-h-i', 'title': 'GHI'}],
                    },
                ],
            },
            {
                'year': 2016,
                'months': [{
                    'month': 1,
                    'days': [{'year': 2016, 'month': 1, 'day': 31,
                              'slug': 'j-k-l', 'title': 'JKL'}],
                }],
            },
        ]
        self.assertEqual(result, expect)


class ArticleFormTest(TestCase):
    def setUp(self):
        self.initial_data = {
            'title': 'title',
            'body': 'body',
            'tags': None,
            'publish': False,
            'slug': 'slug-a',
            'date': '2017/4/1 12:30:00',
        }

    def _callFUT(self, data):
        from . import forms
        return forms.ArticleForm(data)

    def test_ok(self):
        form = self._callFUT(self.initial_data)
        self.assertTrue(form.is_valid())

    def test_ok_tags(self):
        self.initial_data.update({'tags': 'inu,neko'})
        form = self._callFUT(self.initial_data)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['tags'], ['inu', 'neko'])

    def test_ok_tags_which_includes_whitespace_both_sideend(self):
        self.initial_data.update({'tags': '   inu  ,  neko  '})
        form = self._callFUT(self.initial_data)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['tags'], ['inu', 'neko'])


class TestMixin:
    def assertFileContent(self, expect, **kwargs):
        with open (
            '{d}/{year}/{month}/{day}/{slug}.json'.format(d=temp_dir.name, **kwargs)
        ) as f:
            self.assertEqual(f.read(), json.dumps(expect))


@override_settings(DATA_DIR=temp_dir.name)
class ArticlePutTest(TestMixin, TestCase):
    def _callFUT(self, data, **kwargs):
        from .views import article
        request = RequestFactory().put('', json.dumps(data))
        os.makedirs(
            '{d}/{year}/{month}/{day}'.format(d=temp_dir.name, **kwargs)
        )
        return article(request, **kwargs)

    def test_ok(self):
        data = {
            'title': 'TITLE',
            'body': 'this is body',
            'tags': None,
            'publish': True,
            'slug': 's-l-u-g',
            'date': '2017/04/04 12:30:30',
        }
        kwargs = {
            'year': '2017',
            'month': '04',
            'day': '04',
            'slug': 's-l-u-g',
        }
        result = self._callFUT(data, **kwargs)
        self.assertEqual(result, data)
        self.assertFileContent(data, **kwargs)


@override_settings(DATA_DIR=temp_dir.name)
class ArticleCreateTest(TestMixin, TestCase):
    def setUp(self):
        self.date = datetime(2017, 4, 5, 12, 30, 0)
    def _callFUT(self, data):
        request = RequestFactory().post(
            '', data=json.dumps(data), content_type='application/json'
        )
        with mock.patch('api.articles.forms.datetime') as M:
            M.now.return_value = self.date
            from .views import articles
            return articles(request)

    def test_ok(self):
        data = {
            'title': 'hoge',
            'body': 'this is body',
            'tags': None,
            'publish': True,
            'slug': 'h-o-g-e',
        }
        kwargs = {
            'year': '2017',
            'month': '04',
            'day': '05',
            'slug': 'h-o-g-e',
        }
        result = self._callFUT(data)
        self.assertEqual(result['date'], self.date.strftime(DATETIME_FORMAT))
        data.update({'date': '2017/04/05 12:30:00'})
        self.assertFileContent(data, **kwargs)
