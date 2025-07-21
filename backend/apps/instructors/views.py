# backend/apps/instructors/views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets, generics, permissions
from .models import Classroom, Subject, RecentClassroom, RecentSubject
from .serializers import ClassroomSerializer, SubjectSerializer, RecentClassroomReadSerializer, RecentClassroomWriteSerializer, RecentSubjectSerializer
from django.utils import timezone

class InstructorClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        print("DEBUG --- User:", user)
        print("DEBUG --- Is Authenticated:", user.is_authenticated)
        print("DEBUG --- Role:", getattr(user, 'role', None))

        if not user.is_authenticated:
            return Classroom.objects.none()
        
        if user.role == 'instructor':
            return Classroom.objects.filter(instructor=user)
        return Classroom.objects.none()
    
    def create(self, request, *args, **kwargs):
        print("DEBUG --- POST request by:", request.user)
        print("DEBUG --- Role:", getattr(request.user, 'role', None))
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classroom_id = self.kwargs["classroom_pk"]
        classroom = Classroom.objects.get(pk=classroom_id)

        if classroom.instructor != self.request.user:
            raise PermissionDenied("You do not own this classroom.")
        
        return Subject.objects.filter(classroom=classroom)

    def perform_create(self, serializer):
        classroom_id = self.kwargs["classroom_pk"]
        classroom = Classroom.objects.get(pk=classroom_id)

        if classroom.instructor != self.request.user:
            raise PermissionDenied("You do not have permission to add a subject to this classroom.")

        serializer.save(classroom=classroom)


class RecentClassroomListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecentClassroom.objects.filter(instructor=self.request.user).order_by('-accessed_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecentClassroomWriteSerializer
        return RecentClassroomReadSerializer

    def perform_create(self, serializer):
        instructor = self.request.user
        classroom = serializer.validated_data['classroom']

        recent, created = RecentClassroom.objects.update_or_create(
            instructor=instructor,
            classroom=classroom,
            defaults={'accessed_at': timezone.now()}
        )



class RecentSubjectListCreate(generics.ListCreateAPIView):
    serializer_class = RecentSubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecentSubject.objects.filter(instructor=self.request.user)[:3]

    def perform_create(self, serializer):
        obj, _ = RecentSubject.objects.update_or_create(
            instructor=self.request.user,
            classroom=serializer.validated_data['classroom'],
            subject=serializer.validated_data['subject'],
            defaults={}
        )
