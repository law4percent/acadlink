from django.db import models
from django.conf import settings

class Classroom(models.Model):
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='classrooms'
    )
    name = models.CharField(max_length=100)
    start_year = models.IntegerField()
    end_year = models.IntegerField()

    def __str__(self):
        return self.name
    

class Subject(models.Model):
    classroom = models.ForeignKey(
        'instructors.Classroom',
        on_delete=models.CASCADE,
        related_name='subjects'
    )
    name = models.CharField(max_length=100)
    year_level = models.IntegerField()
    section = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.year_level}{self.section})"
    

class RecentClassroom(models.Model):
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey("instructors.Classroom", on_delete=models.CASCADE)
    accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("instructor", "classroom")
        ordering = ["-accessed_at"]


class RecentSubject(models.Model):
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey("instructors.Classroom", on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("instructor", "classroom", "subject")
        ordering = ["-accessed_at"]
