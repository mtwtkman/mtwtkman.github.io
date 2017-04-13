from itertools import groupby
from datetime import datetime

from django.db import models, connection
from django.core.validators import MinLengthValidator


class TagManager(models.Manager):
    def tagged(self):
        resultset = []
        with connection.cursor() as cursor:
            cursor.execute('''
                select
                  x.id as tag_id,
                  x.name,
                  y.id as article_id,
                  y.title,
                  strftime('%%Y/%%m/%%d/', y.created_at) || y.slug as path
                from tags x
                  inner join articles_tags at
                    on at.tag_id == x.id
                  inner join articles y
                    on y.id = at.article_id
                where
                  y.published = 1
                order by
                  x.id,
                  y.created_at desc
            ''')
            fields = [x[0] for x in cursor.description]
            rows = [dict(zip(fields, r)) for r in cursor.fetchall()]
            for tag, articles in groupby(
                rows, lambda x: (x['tag_id'], x['name'])
            ):
                tag_obj = self.model(pk=tag[0], name=tag[1])
                article_objs = []
                for article in articles:
                    article_obj = Article(
                        pk=article['article_id'], title=article['title']
                    )
                    article_obj.path = article['path']
                    article_objs.append(article_obj)
                resultset.append({tag_obj: article_objs})
        return resultset


class Tag(models.Model):
    name = models.CharField(max_length=15, validators=[MinLengthValidator(1)])

    objects = TagManager()

    class Meta:
        db_table = 'tags'

    def __str__(self):
        return '{}: {}'.format(self.pk, self.name)


class ArticleManager(models.Manager):
    def published(self):
        return self.filter(published=True).order_by('-created_at')

    def drafts(self):
        return self.filter(published=False).order_by('-created_at')


class Article(models.Model):
    title = models.CharField(max_length=50, validators=[MinLengthValidator(1)])
    body = models.TextField(validators=[MinLengthValidator(1)])
    slug = models.CharField(max_length=80, validators=[MinLengthValidator(1)])
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag)

    objects = ArticleManager()

    class Meta:
        db_table = 'articles'

    def __str__(self):
        return '{}: {}'.format(self.pk, self.title)
