# -*- coding: utf-8 -*-
import os
import json
from datetime import datetime
from itertools import groupby

from django.conf import settings
from django.views.decorators.http import require_http_methods

from . import forms
from .. import utils


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


@require_http_methods(['GET', 'POST'])
def articles(request):
    if request.method == 'GET':
        return utils.TrustedJsonResponse(index_data())
    elif request.method == 'POST':
        form = forms.ArticleForm(json.loads(request.body.decode('utf-8')))
        if not form.is_valid():
            return utils.JsonResponseBadRequest({'message': form.errors})
        form.write()
        return utils.TrustedJsonResponse(form.cleaned_data)


def pardir(base):
    return os.path.abspath(os.path.join(base, os.pardir))


@require_http_methods(['GET', 'PUT', 'DELETE'])
def article(request, year, month, day, slug):
    filename = utils.filename(year, month, day, slug)
    if request.method == 'GET':
        data = utils.data_from(filename)
        return utils.TrustedJsonResponse(data)
    elif request.method == 'PUT':
        form = forms.ArticleForm(json.loads(request.body.decode('utf-8')))
        if not form.is_valid():
            return utils.JsonResponseBadRequest({'message': form.errors})
        form.write()
        return utils.TrustedJsonResponse(form.cleaned_data)
    elif request.method == 'DELETE':
        filepath = os.path.join(settings.DATA_DIR, filename)
        os.remove(filepath)
        day_dir = os.path.dirname(filepath)
        if not os.listdir(day_dir):
            os.rmdir(day_dir)
        month_dir = pardir(day_dir)
        _, days, _ = next(os.walk(month_dir))
        if not days:
            os.rmdir(month_dir)
        year_dir = pardir(month_dir)
        _, months, _ = next(os.walk(year_dir))
        if not months:
            os.rmdir(year_dir)
        return utils.JsonResponse({'result': 'ok'})
