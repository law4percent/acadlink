from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import InstructorClassroomViewSet, SubjectViewSet, RecentClassroomListCreateView, RecentSubjectListCreate

router = DefaultRouter()
router.register(r'classrooms', InstructorClassroomViewSet, basename='instructor-classrooms')

# Nest subjects under classrooms
classroom_router = NestedDefaultRouter(router, r'classrooms', lookup='classroom')
classroom_router.register(r'subjects', SubjectViewSet, basename='classroom-subjects')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(classroom_router.urls)),
    path('recent/classrooms/', RecentClassroomListCreateView.as_view(), name='recent-classrooms'),
    path('recent/subjects/', RecentSubjectListCreate.as_view(), name='recent-subjects'),
]
