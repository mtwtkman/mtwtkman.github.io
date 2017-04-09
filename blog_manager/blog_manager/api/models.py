from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=15)

    class Meta:
        db_table = 'tags'


class Article(models.Model):
    title = models.CharField(max_length=50)
    body = models.TextField()
    slug = models.CharField(max_length=80)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag)

    class Meta:
        db_table = 'articles'
