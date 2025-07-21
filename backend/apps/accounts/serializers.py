# accounts/serializers.py
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Instructor, Student, UserRole

class UsernameOrEmailTokenObtainPairSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        if not identifier or not password:
            raise serializers.ValidationError("Both identifier and password are required.")

        User = get_user_model()
        user = (
            User.objects.filter(email__iexact=identifier).first()
            or User.objects.filter(username__iexact=identifier).first()
        )

        if not user:
            raise AuthenticationFailed("Invalid email/username or password.")

        authenticated_user = authenticate(username=user.email, password=password)

        if not authenticated_user:
            raise AuthenticationFailed("Invalid email/username or password.")

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(authenticated_user)

        # Get full name
        full_name = f"{authenticated_user.first_name} {authenticated_user.last_name}"

        # Optionally add title if instructor
        try:
            if authenticated_user.role == UserRole.INSTRUCTOR:
                instructor = Instructor.objects.get(user=authenticated_user)
                full_name = f"{instructor.title} {full_name}"
        except Instructor.DoesNotExist:
            pass

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": authenticated_user.id,
                "username": authenticated_user.username,
                "email": authenticated_user.email,
                "role": authenticated_user.role,
                "first_name": authenticated_user.first_name,
                "last_name": authenticated_user.last_name,
                "name": full_name  # 👈 This is what your frontend expects
            }
        }




class UserRole:
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'


class GenderChoices:
    MALE = 'Male'
    FEMALE = 'Female'
    CHOICES = [(MALE, 'Male'), (FEMALE, 'Female')]


class InstructorRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    employee_id = serializers.CharField(required=True)
    title = serializers.ChoiceField(choices=[
            ("Prof.", "Professor"),
            ("Assoc. Prof.", "Associate Professor"),
            ("Asst. Prof.", "Assistant Professor"),
            ("Inst.", "Instructor"),
            ("Dr.", "Doctor"),
            ("Engr.", "Engineer"),
            ("Ar.", "Architect"),
            ("Atty.", "Attorney"),
            ("Mr.", "Mr."),
            ("Ms.", "Ms."),
            ("Mrs.", "Mrs."),
        ], required=True)
    gender = serializers.ChoiceField(choices=GenderChoices.CHOICES, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'password', 'first_name', 'last_name',
            'employee_id', 'title', 'gender'
        )

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        employee_id = validated_data.pop('employee_id')
        title = validated_data.pop('title')
        gender = validated_data.pop('gender')

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=UserRole.INSTRUCTOR
        )

        Instructor.objects.create(user=user, employee_id=employee_id, title=title, gender=gender)
        return user

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "username": instance.username,
            "email": instance.email,
            "role": instance.role
        }


class StudentRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    student_id = serializers.CharField(required=True)
    year_level = serializers.IntegerField(required=True)
    section = serializers.CharField(required=True)
    gender = serializers.ChoiceField(choices=GenderChoices.CHOICES, required=True)
    department = serializers.CharField(required=True)
    course = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            "username", "email", "password", "first_name", "last_name",
            "student_id", "year_level", "section", "gender", "department", "course"
        ]

    def validate_year_level(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError("Year level must be between 1 and 5.")
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        student_fields = {
            "student_id": validated_data.pop("student_id"),
            "year_level": validated_data.pop("year_level"),
            "section": validated_data.pop("section"),
            "gender": validated_data.pop("gender"),
            "department": validated_data.pop("department"),
            "course": validated_data.pop("course"),
        }

        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=UserRole.STUDENT,
        )

        Student.objects.create(user=user, **student_fields)
        return user

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "username": instance.username,
            "email": instance.email,
            "role": instance.role
        }
