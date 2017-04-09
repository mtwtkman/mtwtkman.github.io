import os
import json

from django.conf import settings
from django.http import JsonResponse


def data_from(filename):
    with open(os.path.join(settings.DATA_DIR, filename)) as fp:
        return json.loads(fp.read())


class JsonResponseBadRequest(JsonResponse):
    status_code = 400


class TrustedJsonResponse(JsonResponse):
    def __init__(self, data):
        super().__init__(data, safe=False)


def filename(*args):
    return '{}.json'.format(('/').join(args))


def write(filename, data):
    filepath = os.path.join(settings.DATA_DIR, filename)
    dirname = os.path.dirname(filepath)
    if not os.path.exists(dirname):
        os.makedirs(dirname)
    with open(filepath, 'w') as f:
        f.write(data)
