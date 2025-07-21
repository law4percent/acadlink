from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Instructor, Student


class UserRole:
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'


# ✅ Inline for Instructor profile
class InstructorInline(admin.StackedInline):
    model = Instructor
    can_delete = False
    verbose_name_plural = 'Instructor Profile'
    fk_name = 'user'


# ✅ Inline for Student profile
class StudentInline(admin.StackedInline):
    model = Student
    can_delete = False
    verbose_name_plural = 'Student Profile'
    fk_name = 'user'


# ✅ Custom User Admin
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    readonly_fields = ('last_login', 'date_joined')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Role Info', {'fields': ('role',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        if obj.role == UserRole.INSTRUCTOR:
            return [InstructorInline(self.model, self.admin_site)]
        elif obj.role == UserRole.STUDENT:
            return [StudentInline(self.model, self.admin_site)]
        return []


# ✅ Register the custom user model
admin.site.register(CustomUser, CustomUserAdmin)

# Optional: Register instructor/student profiles separately
admin.site.register(Instructor)
admin.site.register(Student)
