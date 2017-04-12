from django.test import TestCase

from . import factories

from . import models


class ArticleManagerTest(TestCase):
    def setUp(self):
        for i in range(3):
            factories.TagFactory()

    def test_ok_published(self):
        results = models.Articles.objects.published()
