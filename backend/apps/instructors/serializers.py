from rest_framework import serializers
from .models import Classroom, Subject, RecentClassroom, RecentSubject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'year_level', 'section']
        read_only_fields = ['id', 'classroom']

class ClassroomSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'start_year', 'end_year', 'subjects']

    def get_subjects(self, obj):
        return [
            f"{subject.name} ({subject.year_level}{subject.section})"
            for subject in obj.subjects.all()
        ]

class RecentClassroomReadSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer()

    class Meta:
        model = RecentClassroom
        fields = ['id', 'classroom', 'accessed_at']


class RecentClassroomWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentClassroom
        fields = ['classroom']  # accepts classroom ID only

class RecentSubjectSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = RecentSubject
        fields = ['id', 'classroom', 'subject', 'accessed_at']