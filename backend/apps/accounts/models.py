from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone



GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
]


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required.")
        if not username:
            raise ValueError("The Username field is required.")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, username, password, **extra_fields)


class UserRole:
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'
    CHOICES = [
        (STUDENT, 'Student'),
        (INSTRUCTOR, 'Instructor'),
    ]


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=UserRole.CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name


class Instructor(models.Model):
    ACADEMIC_TITLES = [
        ('Prof.', 'Professor'),
        ('Assoc. Prof.', 'Associate Professor'),
        ('Asst. Prof.', 'Assistant Professor'),
        ('Inst.', 'Instructor'),
        ('Dr.', 'Doctor'),
        ('Engr.', 'Engineer'),
        ('Ar.', 'Architect'),
        ('Atty.', 'Attorney'),
        # Courtesy Titles for part-timers or non-degree holders
        ('Mr.', 'Mr.'),
        ('Ms.', 'Ms.'),
        ('Mrs.', 'Mrs.'),
    ]
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='instructor_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=20, choices=ACADEMIC_TITLES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    def clean(self):
        if self.user.role != 'instructor':
            raise ValidationError("Assigned user must have role='instructor'.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} {self.user.first_name} {self.user.last_name}"

    class Meta:
        ordering = ['user__last_name']


class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=50, unique=True)
    year_level = models.PositiveSmallIntegerField(choices=[(i, f"{i} Year") for i in range(1, 6)])
    section = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    department = models.CharField(max_length=100)
    course = models.CharField(max_length=100)

    def clean(self):
        if self.user.role != 'student':
            raise ValidationError("Assigned user must have role='student'.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student_id} - {self.user.first_name} {self.user.last_name}"

    class Meta:
        ordering = ['student_id']
