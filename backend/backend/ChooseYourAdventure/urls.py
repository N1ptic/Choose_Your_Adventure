from django.urls import path, include
from App1 import views
from App1.views import HistoryView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('handle_choice', views.HandleChoiceView.as_view(), name='handle_choice'),
    path('generate-image', views.ImageGenerationView.as_view(), name='generate_image'),
    path('accounts/', include('App1.urls')),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('is_logged_in/', views.IsLoggedInView.as_view(), name='is_logged_in'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/history/', HistoryView.as_view(), name='history'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
