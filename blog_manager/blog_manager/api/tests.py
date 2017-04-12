from django.test import TestCase

from . import factories

from . import models


class ArticleManagerTest(TestCase):
    def setUp(self):
        for i in range(2):
            factories.ArticleFactory()
            factories.ArticleFactory(publish=True)

    def test_ok_published(self):
        results = models.Article.objects.published()
        self.assertEqual(len(results), 2)
