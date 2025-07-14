from django.db import models
# from django.contrib.auth.models import User

# class Instructor(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor_profile')
#     department = models.CharField(max_length=100)
#     # bio = models.TextField(blank=True, null=True)
#     profile_picture = models.ImageField(upload_to='instructors/', null=True, blank=True)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.user.get_full_name()

#     class Meta:
#         db_table = "intructor"