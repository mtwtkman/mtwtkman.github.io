import factory

from . import models


class TagFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'tag_{}'.format(n))

    class Meta:
        model = models.Tag


class ArticleFactory(factory.django.DjangoModelFactory):
    pk = factory.Sequence(lambda n: n)
    title = factory.LazyAttribute(lambda o: 'title_{}'.format(o.pk))
    body = factory.LazyAttribute(lambda o: 'body_{}'.format(o.pk))
    slug = factory.LazyAttribute(lambda o: 'slug-{}'.format(o.pk))
    created_at = factory.Faker('date_time')
    updated_at = factory.Faker('date_time')

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)

    class Meta:
        model = models.Article
