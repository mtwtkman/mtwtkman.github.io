from itertools import groupby
from django.db import models, connection


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
            for tag, articles in groupby(rows, lambda x: (x['tag_id'], x['name'])):
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
    name = models.CharField(max_length=15)

    objects = TagManager()

    class Meta:
        db_table = 'tags'

    def __str__(self):
        return '{}: {}'.format(self.pk, self.name)


class ArticleManager(models.Manager):
    sql = '''
        select
          title,
          slug,
          strftime('%%Y', created_at) as year,
          strftime('%%m', created_at) as month,
          strftime('%%d', created_at) as day
        from articles
        where published = %s
        order by created_at desc
    '''

    def _select(self, published):
        resultset = []
        with connection.cursor() as cursor:
            cursor.execute(self.sql, [published])
            fields = [x[0] for x in cursor.description]
            for row in [dict(zip(fields, r)) for r in cursor.fetchall()]:
                obj = self.model(title=row['title'], slug=row['slug'])
                obj.year = row['year']
                obj.month = row['month']
                obj.day = row['day']
                resultset.append(obj)
        return resultset

    def published(self):
        return self._select(1)

    def drafts(self):
        return self._select(0)


class Article(models.Model):
    title = models.CharField(max_length=50)
    body = models.TextField()
    slug = models.CharField(max_length=80)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag)

    objects = ArticleManager()

    class Meta:
        db_table = 'articles'

    def __str__(self):
        return '{}: {}'.format(self.pk, self.title)
