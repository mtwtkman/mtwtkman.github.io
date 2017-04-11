import os
import json
import tempfile
from pathlib import Path
from unittest import mock
from datetime import datetime

from django.test import TestCase, RequestFactory, override_settings

from .forms import DATETIME_FORMAT


temp_dir = tempfile.TemporaryDirectory(dir=os.path.dirname(__file__))


def table_format(*L):
    return [dict(zip(L[0], x)) for x in L[1:]]


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
    def _makeDirectory(self, **kwargs):
        os.makedirs(
            '{d}/{year}/{month}/{day}'.format(d=temp_dir.name, **kwargs)
        )

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
        self._makeDirectory(**kwargs)
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
        self.assertEqual(json.loads(result.content), data)
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
        self.assertEqual(
            json.loads(result.content)['date'],
            self.date.strftime(DATETIME_FORMAT)
        )
        data.update({'date': '2017/04/05 12:30:00'})
        self.assertFileContent(data, **kwargs)


@override_settings(DATA_DIR=temp_dir.name)
class ArticleDeleteTest(TestMixin, TestCase):
    def _callFUT(self, **kwargs):
        request = RequestFactory().delete('')
        from .views import article
        return article(request, **kwargs)

    def _makeFile(self, **kwargs):
        self._makeDirectory(**kwargs)
        Path('{d}/{year}/{month}/{day}/{slug}.json'.format(
            d=temp_dir.name, **kwargs
        )).touch()

    def test_ok_remove_year(self):
        kwargs = {
            'year': '2018',
            'month': '05',
            'day': '06',
            'slug': 'a-b-c-d',
        }
        self._makeFile(**kwargs)
        self._callFUT(**kwargs)
        self.assertFalse(
            os.path.exists('{d}/{year}'.format(d=temp_dir.name, year=kwargs['year']))
        )

    def test_ok_remove_month(self):
        kwargs = {
            'year': '2019',
            'month': '01',
            'day': '01',
            'slug': 'a-b-c-d',
        }
        self._makeFile(**kwargs)
        self._makeFile(**{
            'year': '2019',
            'month': '02',
            'day': '01',
            'slug': 'z-b-c-d',
        })
        self._callFUT(**kwargs)
        self.assertTrue(
            os.path.exists('{d}/{year}'.format(d=temp_dir.name, **kwargs))
        )
        self.assertFalse(
            os.path.exists('{d}/{year}/{month}'.format(d=temp_dir.name, **kwargs))
        )

    def test_ok_remove_day(self):
        kwargs = {
            'year': '2020',
            'month': '01',
            'day': '01',
            'slug': 'a-b-c-d',
        }
        self._makeFile(**kwargs)
        self._makeFile(**{
            'year': '2020',
            'month': '01',
            'day': '02',
            'slug': 'z-b-c-d',
        })
        self._callFUT(**kwargs)
        self.assertTrue(
            os.path.exists('{d}/{year}'.format(d=temp_dir.name, **kwargs))
        )
        self.assertTrue(
            os.path.exists('{d}/{year}/{month}'.format(d=temp_dir.name, **kwargs))
        )
        self.assertFalse(
            os.path.exists('{d}/{year}/{month}/{day}'.format(d=temp_dir.name, **kwargs))
        )
