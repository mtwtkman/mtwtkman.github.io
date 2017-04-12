import factory

from . import models


class TagFactory(factory.django.DjangoModelFactory):
    pk = factory.Sequence(lambda n: n + 1)
    name = factory.LazyAttribute(lambda o: 'tag_{}'.format(o.pk))


    class Meta:
        model = models.Tag


class ArticleFactory(factory.django.DjangoModelFactory):
    pk = factory.Sequence(lambda n: n + 1)
    title = factory.LazyAttribute(lambda o: 'title_{}'.format(o.pk))
    body = factory.LazyAttribute(lambda o: 'body_{}'.format(o.pk))
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

    class Params:
        publish = factory.Trait(published=True)
