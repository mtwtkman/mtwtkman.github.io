import os
import json
import tempfile
from unittest import mock

from django.test import TestCase, RequestFactory, override_settings


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


class ArticleUpdateFormTest(TestCase):
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
        return forms.ArticleUpdateForm(data)

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

    def test_dumped_json(self):
        form = self._callFUT(self.initial_data)
        self.assertTrue(form.is_valid())
        self.initial_data.update({'date': '2017/04/01 12:30:00'})
        self.assertEqual(form.dumped_json(), json.dumps(self.initial_data))


@override_settings(DATA_DIR=temp_dir.name)
class ArticlePutTest(TestCase):
    def _callFUT(self, data, **kwargs):
        from .views import article
        request = RequestFactory().put('', json.dumps(data))
        os.makedirs((
            f'{temp_dir.name}/{kwargs["year"]}/'
            f'{kwargs["month"]}/{kwargs["day"]}')
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
            'slug': 'hoge-fuga',
        }
        result = self._callFUT(data, **kwargs)
        self.assertEqual(result, data)
        with open((
            f'{temp_dir.name}/{kwargs["year"]}/'
            f'{kwargs["month"]}/{kwargs["day"]}/{kwargs["slug"]}.json')
        ) as f:
            self.assertEqual(f.read(), json.dumps(data))
