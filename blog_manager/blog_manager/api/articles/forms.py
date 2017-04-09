import os
import json
from datetime import datetime

from django import forms
from django.conf import settings

from .. import utils


DATETIME_FORMAT = '%Y/%m/%d %H:%M:%S'

class CommaSeparatedField(forms.CharField):
    blank = True
    required = False

    def clean(self, value):
        return [x.strip() for x in value.split(',')] if value else None


class ArticleForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField()
    tags = CommaSeparatedField()
    publish = forms.BooleanField(required=False)
    slug = forms.CharField()
    date = forms.DateTimeField(
        input_formats=[DATETIME_FORMAT], required=False
    )

    def clean_date(self):
        data = self.cleaned_data['date'] or datetime.now()
        return data.strftime(DATETIME_FORMAT)

    @property
    def filename(self):
        date = self.cleaned_data['date'].split(' ')[0].split('/')
        return utils.filename(*date, self.cleaned_data['slug'])

    def write(self):
        utils.write(
            os.path.join(settings.DATA_DIR, self.filename), json.dumps(self.cleaned_data)
        )
