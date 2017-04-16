from django.http import JsonResponse
from django.db.models import QuerySet
from django.core.serializers.json import DjangoJSONEncoder

from . import models


class JsonResponseBadRequest(JsonResponse):
    status_code = 400


class TagSafeJSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return [t.pk for t in o]
        return super().default(o)

class TrustedJsonResponse(JsonResponse):
    def __init__(self, data):
        super().__init__(
            data, safe=False, encoder=TagSafeJSONEncoder
        )
