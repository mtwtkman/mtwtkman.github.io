from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.articles, name='articles'),
    url(r'^(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/(?P<slug>[a-z\-]+)', views.article, name='article'),
]