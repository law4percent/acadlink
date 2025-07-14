from rest_framework import generics
from .serializers import InstructorRegisterSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class InstructorRegisterView(generics.CreateAPIView):
    serializer_class = InstructorRegisterSerializer
    permission_classes = [AllowAny]

class InstructorOnlyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'instructor':
            return Response({'message': f'Welcome Instructor {request.user.username}!'})
        return Response({'error': 'Unauthorized'}, status=403)
