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
