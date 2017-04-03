import json

from django import forms


class CommaSeparatedField(forms.CharField):
    blank = True
    required = False

    def clean(self, value):
        return [x.strip() for x in value.split(',')] if value else None


class ArticleUpdateForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField()
    tags = CommaSeparatedField()
    publish = forms.BooleanField(required=False)
    slug = forms.CharField()
    date = forms.DateTimeField(input_formats=['%Y/%m/%d %H:%M:%S'])

    def clean_date(self):
        return self.cleaned_data['date'].strftime('%Y/%m/%d %H:%M:%S')

    def dumped_json(self):
        return json.dumps(self.cleaned_data)
