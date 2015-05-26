from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
	url(r'^typingtests/', include('typingtest.urls', namespace='typingtest')),
	url(r'^admin/', include(admin.site.urls)),
]
