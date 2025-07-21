from rest_framework import serializers
from .models import Classroom, Subject, RecentClassroom, RecentSubject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'year_level', 'section']
        read_only_fields = ['id', 'classroom']


class ClassroomSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()
    # Override start_year and end_year to handle null values
    start_year = serializers.SerializerMethodField()
    end_year = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'start_year', 'end_year', 'subjects']

    def get_subjects(self, obj):
        return [
            f"{subject.name} ({subject.year_level}{subject.section})"
            for subject in obj.subjects.all()
        ]
    
    def get_start_year(self, obj):
        return obj.start_year if obj.start_year is not None else "Unknown"
    
    def get_end_year(self, obj):
        return obj.end_year if obj.end_year is not None else "Unknown"


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
    classroom = serializers.PrimaryKeyRelatedField(
        queryset=Classroom.objects.all(), write_only=True
    )
    subject = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), write_only=True
    )

    classroom_display = ClassroomSerializer(source='classroom', read_only=True)
    subject_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RecentSubject
        fields = [
            'id',
            'classroom',        # used for writing
            'subject',          # used for writing
            'classroom_display',  # shown when reading
            'subject_display',    # shown when reading
            'accessed_at'
        ]

    def get_subject_display(self, obj):
        """Return formatted subject string with year and section"""
        subject = obj.subject
        return f"{subject.name} ({subject.year_level}{subject.section})"