from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserRole
from .serializers import (
    InstructorRegisterSerializer,
    StudentRegisterSerializer,
    UsernameOrEmailTokenObtainPairSerializer,
)

import logging
logger = logging.getLogger(__name__)


class EmailTokenObtainPairView(TokenObtainPairView):
    """
    JWT login view that accepts either email or username.
    """
    serializer_class = UsernameOrEmailTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        print("Login request data:", request.data)  # ✅ DEBUG LINE
        return super().post(request, *args, **kwargs)


class BaseRegisterView(generics.CreateAPIView):
    """
    Base class for user registration views.
    """
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refreshed = self.get_serializer(user)
            return Response({
                "message": f"{user.role.capitalize()} account created successfully!",
                "user": refreshed.data
            }, status=status.HTTP_201_CREATED)

        logger.warning(f"{self.__class__.__name__} failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstructorRegisterView(BaseRegisterView):
    """
    Endpoint to register instructor users.
    """
    serializer_class = InstructorRegisterSerializer


class StudentRegisterView(BaseRegisterView):
    """
    Endpoint to register student users.
    """
    serializer_class = StudentRegisterSerializer


class InstructorOnlyView(APIView):
    """
    Protected view accessible only to instructors.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == UserRole.INSTRUCTOR:
            return Response({'message': f'Welcome Instructor {request.user.email}!'})
        return Response({'detail': 'You do not have permission to access this resource.'},
                        status=status.HTTP_403_FORBIDDEN)
