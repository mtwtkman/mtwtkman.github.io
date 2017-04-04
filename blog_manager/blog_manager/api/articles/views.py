import os
import json
from itertools import groupby

from django.conf import settings
from django.views.decorators.http import require_http_methods

from .. import utils
from . import forms


def index_data():
    y_key = lambda x: x['year']
    m_key = lambda x: x['month']
    return [{
        'year': year,
        'months': [
            {'month': month, 'days': [x for x in __data]}
            for month, __data in groupby(_data, key=m_key)
        ]
    } for year, _data in groupby(utils.data_from('index.json'), key=y_key)]


@require_http_methods(['GET'])
def articles(request):
    if request.method == 'GET':
        return utils.TrustedJsonResponse(index_data())


@require_http_methods(['GET', 'PUT'])
def article(request, year, month, day, slug):
    filename = '{}/{}/{}/{}.json'.format(year, month, day, slug)
    if request.method == 'GET':
        data = utils.data_from(filename)
        return utils.TrustedJsonResponse(data)

    if request.method == 'PUT':
        form = forms.ArticleUpdateForm(json.loads(request.body))
        if not form.is_valid():
            return utils.JsonResponseBadRequest({'message': form.errors})
        with open(os.path.join(settings.DATA_DIR, filename), 'w') as f:
            f.write(form.dumped_json())
        return form.cleaned_data
