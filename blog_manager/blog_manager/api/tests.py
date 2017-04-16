import json

from django.test import TestCase
from django.forms import model_to_dict

from . import models
from . import factories


class TrustedJsonResponseTest(TestCase):
    def setUp(self):
        t1 = factories.TagFactory(name='t1')
        t2 = factories.TagFactory(name='t2')

        factories.ArticleFactory(pk=1)
        factories.ArticleFactory(pk=2, tags=(t1, t2))

    def _callFUT(self, data):
        from . import utils
        return utils.TrustedJsonResponse(model_to_dict(data))

    def test_ok_without_tag(self):
        resp = self._callFUT(models.Article.objects.get(pk=1))
        self.assertEqual(json.loads(resp.content)['tags'], [])

    def test_ok_with_tags(self):
        resp = self._callFUT(models.Article.objects.get(pk=2))
        self.assertEqual(json.loads(resp.content)['tags'], ['t1', 't2'])
