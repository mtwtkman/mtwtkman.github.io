# -*- coding: utf-8 -*-
import os
import json
from itertools import groupby

from django.conf import settings
from django.db import transaction
from django.forms import model_to_dict
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods

from . import forms
from .. import utils
from .. import models


def article_list(objs):
    return [{
        'id': o.pk, 'title': o.title, 'slug': o.slug,
        **dict(zip(
            ['year', 'month', 'day'],
            o.created_at.strftime('%Y/%m/%d').split('/')
        ))
    } for o in objs]


@require_http_methods(['GET', 'POST'])
def articles(request):
    if request.method == 'GET':
        return utils.TrustedJsonResponse([{
            'year': year,
            'months': [{
                'month': month,
                'days': [{
                    'id': d['id'], 'title': d['title'], 'day': d['day']
                } for d in _data]
            } for month, _data in groupby(data, key=lambda x: x['month'])]
        } for year, data in groupby(
            article_list(models.Article.objects.published()),
            key=lambda x: x['year']
        )])
    elif request.method == 'POST':
        form = forms.ArticleCreateForm(
            json.loads(request.body.decode('utf-8'))
        )
        if not form.is_valid():
            return utils.JsonResponseBadRequest({'message': form.errors})
        with transaction.atomic():
            form.save()
            return utils.TrustedJsonResponse(form.obj)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def article(request, pk):
    if request.method == 'GET':
        target = get_object_or_404(models.Article, pk=pk)
        return utils.TrustedJsonResponse(model_to_dict(target))
    elif request.method == 'PUT':
        form = forms.ArticleUpdateForm(
            json.loads(request.body.decode('utf-8'))
        )
        if not form.is_valid():
            return utils.JsonResponseBadRequest({'message': form.errors})
        form.save()
        return utils.TrustedJsonResponse(form.obj)
    elif request.method == 'DELETE':
        try:
            models.Article.objects.get(pk=pk).delete()
        except models.Article.DoesNotExist:
            return utills.JsonResponseBadRequest({'message': 'Not found'})
        else:
            return utils.TrustedJsonResponse({'status': 'ok'})
