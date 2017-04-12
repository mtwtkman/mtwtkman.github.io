import factory

from . import models


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Tag

    pk = factory.Sequence(lambda n: n + 1)
    name = factory.LazyAttribute(lambda o: 'tag_{}'.format(o.pk))


class ArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Article

    pk = factory.Sequence(lambda n: n + 1)
    title = factory.LazyAttribute(lambda o: 'title_{}'.format(o.pk))
    body = factory.LazyAttribute(lambda o: 'body_{}'.format(o.pk))
    published = factory.LazyAttribute(lambda o: o.pk % 2)
    created_at = factory.Faker('date_time')
    updated_at = factory.Faker('date_time')

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)
