from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.articles, name='articles'),
    url(r'^/(?P<pk>\d+)', views.article, name='article'),
]
