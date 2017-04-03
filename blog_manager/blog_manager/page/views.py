from functools import wraps
from contextlib import contextmanager

from django.shortcuts import render


def view(view_func):
    @wraps(view_func)
    def wrapper(request, **kwargs):
        return render(request, 'base.html', {
            'app_name': view_func.__name__,
            'title': view_func(),
        })
    return wrapper


@view
def index():
    return '記事一覧'


@view
def create():
    return '新規作成'


@view
def article():
    return '編集'
