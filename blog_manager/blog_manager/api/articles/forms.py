from datetime import datetime

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


class ArticleCreateForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField()
    tags = CommaSeparatedField()
    published = forms.BooleanField(required=False)
    slug = forms.CharField()

    model = models.Article

    def clean_date(self):
        data = self.cleaned_data['date'] or datetime.now()
        return data.strftime(DATETIME_FORMAT)

    def save(self):
        tags = self.cleaned_data.pop('tags')
        created = self.model.objects.create(**self.cleaned_data)
        if tags:
            for t in tags:
                created.tags.add(t)
        self.created = model_to_dict(created)
