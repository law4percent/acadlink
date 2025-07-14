from django.urls import path
from .views import InstructorRegisterView, InstructorOnlyView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', InstructorRegisterView.as_view(), name='instructor-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', InstructorOnlyView.as_view(), name='instructor-protected'),
]

