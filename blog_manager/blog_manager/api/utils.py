from django.http import JsonResponse


class JsonResponseBadRequest(JsonResponse):
    status_code = 400


class TrustedJsonResponse(JsonResponse):
    def __init__(self, data):
        super().__init__(data, safe=False)
