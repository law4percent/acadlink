from django.urls import path
from .views import (
    InstructorRegisterView,
    StudentRegisterView,
    EmailTokenObtainPairView,
    InstructorOnlyView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/instructor/', InstructorRegisterView.as_view(), name='instructor-register'),
    path('register/student/', StudentRegisterView.as_view(), name='student-register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', InstructorOnlyView.as_view(), name='instructor-protected'),
]
