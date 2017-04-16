from datetime import datetime
from contextlib import contextmanager

from django import forms
from django.forms import model_to_dict

from .. import models


DATETIME_FORMAT = '%Y/%m/%d %H:%M:%S'


class CommaSeparatedField(forms.CharField):
    blank = True
    required = False

    def clean(self, value):
        if not value:
            return None
        result = []
        for o in [x.strip() for x in value.split(',')]:
            try:
                target = models.Tag.objects.get(pk=o)
            except models.Tag.DoesNotExist:
                target = models.Tag.objects.create(name=o)
            result.append(target)
        return result


class ArticleBaseForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField()
    tags = CommaSeparatedField()
    published = forms.BooleanField(required=False)
    slug = forms.CharField()

    def clean_date(self):
        data = self.cleaned_data['date'] or datetime.now()
        return data.strftime(DATETIME_FORMAT)

    @staticmethod
    def _save(method):
        def _inner(self, *args, **kwargs):
            tags = self.cleaned_data.pop('tags')
            obj = method(self, *args, **kwargs)
            if tags:
                for t in tags:
                    obj.tags.add(t)
            self.obj = model_to_dict(obj)
        return _inner


class ArticleCreateForm(ArticleBaseForm):
    @ArticleBaseForm._save
    def save(self):
        return models.Article.objects.create(**self.cleaned_data)


class ArticleUpdateForm(ArticleBaseForm):
    @ArticleBaseForm._save
    def save(self, obj):
        for k, v in self.cleaned_data:
            setattr(obj, k, v)
        obj.tags.clear()
        obj.save()
        return obj
