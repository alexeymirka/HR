import operator
from functools import reduce

from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Q, Count
from django.db.transaction import atomic
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import *


class SelectionSerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField()

    class Meta:
        model = Selection
        fields = (
            "id",
            "candidate",
            "results",
            "position",
            "competence",
            "stage",
            "status",
        )

    def get_results(self, obj):
        rating = {
            "questionnaire": None,
            "testing": None,
            "internship": None,
            "attestation": None,
            "average": None
        }  # Выставление рейтинга кандидату
        results = {
            "questionnaire": None,
            "testing": None,
            "internship": None,
            "attestation": None,
        }
        try:
            questionnaire = obj.questionnaire_results
            answer_marks = [answer.rating for answer in questionnaire.all()]
            results["questionnaire"] = QuestionnaireSerializer(
                questionnaire, many=True
            ).data
            if answer_marks:
                rating["questionnaire"] = round(
                    sum(answer_marks) / len(answer_marks), 2
                )
        except ObjectDoesNotExist:
            pass
        try:
            testing = obj.testing_results
            results["testing"] = TestingSerializer(testing).data
            rating["testing"] = TestingSerializer(testing).data["average"]
        except ObjectDoesNotExist:
            pass
        try:
            internship = obj.internship_results
            results["internship"] = InternshipSerializer(internship).data
            rating["internship"] = InternshipSerializer(internship).data["average"]

        except ObjectDoesNotExist:
            pass
        try:
            attestation = obj.attestation_results
            results["attestation"] = AttestationSerializer(attestation).data
            rating["attestation"] = AttestationSerializer(attestation).data["average"]

        except ObjectDoesNotExist:
            pass

        rating_marks = [value for value in rating.values() if value]
        rating["average"] = (
            round(sum(rating_marks) / len(rating_marks), 2) if rating_marks else None
        )
        results["rating"] = rating

        return results

    def to_representation(self, obj):
        self.fields["candidate"] = serializers.CharField(source="candidate.name")
        self.fields["position"] = serializers.CharField(source="position.name")

        return super().to_representation(obj)

    def validate_stage(self, value):
        for i in range(len(Selection.STAGE_CHOICES)):
            if value == Selection.STAGE_CHOICES[i][0]:
                if self.instance.stage == Selection.STAGE_CHOICES[i - 1][0]:
                    return value
                else:
                    raise serializers.ValidationError(
                        "Неверное значение страдии отбора"
                    )
        raise serializers.ValidationError("Неверное значение страдии отбора")

    @atomic
    def create(self, validated_data):
        candidate = self.validated_data["candidate"]
        position = self.validated_data["position"]
        selection = Selection.objects.create(**validated_data)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=candidate,
            position=position,
            hr=user,
            action=HRProductivity.ACTION_CHOICES[4][0],
        )
        return selection

    @atomic
    def update(self, instance, validated_data):
        user = self.context["request"].user
        competence = self.validated_data.get("competence")
        if competence:
            HRProductivity.objects.create(
                candidate=instance.candidate,
                position=instance.position,
                hr=user,
                action=HRProductivity.ACTION_CHOICES[9][0],
            )
        stage = self.validated_data.get("stage")
        if stage:
            HRProductivity.objects.create(
                candidate=instance.candidate,
                position=instance.position,
                hr=user,
                action=HRProductivity.ACTION_CHOICES[4][0],
            )

        instance = super(SelectionSerializer, self).update(instance, validated_data)
        return instance


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ("id", "selection", "question", "answer", "rating")

    def validate(self, data):
        if data["selection"].stage != Selection.STAGE_CHOICES[0][0]:
            raise serializers.ValidationError("Неверное значение страдии отбора")
        return data

    @atomic
    def create(self, validated_data):
        selection = self.validated_data["selection"]
        questionnaire = Questionnaire.objects.create(**validated_data)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=selection.candidate,
            position=selection.position,
            hr=user,
            action=HRProductivity.ACTION_CHOICES[0][0],
        )
        return questionnaire


class TestingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testing
        fields = ("id", "selection", "theory", "practice", "average")
        read_only_fields = [
            "id",
            "average",
        ]

    def validate(self, data):
        if data["selection"].stage != Selection.STAGE_CHOICES[1][0]:
            raise serializers.ValidationError("Неверное значение страдии отбора")
        return data

    @atomic
    def create(self, validated_data):
        selection = self.validated_data["selection"]
        testing = Testing.objects.create(**validated_data)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=selection.candidate,
            position=selection.position,
            hr=user,
            action=HRProductivity.ACTION_CHOICES[1][0],
        )
        return testing


class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = ("id", "selection", "theory", "practice", "average")
        read_only_fields = [
            "id",
            "average",
        ]

    def validate(self, data):
        if data["selection"].stage != Selection.STAGE_CHOICES[2][0]:
            raise serializers.ValidationError("Неверное значение страдии отбора")
        return data

    @atomic
    def create(self, validated_data):
        selection = self.validated_data["selection"]
        internship = Internship.objects.create(**validated_data)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=selection.candidate,
            position=selection.position,
            hr=user,
            action=HRProductivity.ACTION_CHOICES[2][0],
        )
        return internship


class AttestationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attestation
        fields = (
            "id",
            "selection",
            "responsibility",
            "punctuality",
            "diligence",
            "leadership",
            "average",
        )
        read_only_fields = [
            "id",
            "average",
        ]

    def validate(self, data):
        if data["selection"].stage != Selection.STAGE_CHOICES[3][0]:
            raise serializers.ValidationError("Неверное значение страдии отбора")
        return data

    @atomic
    def create(self, validated_data):
        selection = self.validated_data["selection"]
        attestation = Attestation.objects.create(**validated_data)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=selection.candidate,
            position=selection.position,
            hr=user,
            action=HRProductivity.ACTION_CHOICES[3][0],
        )
        return attestation


class HRProductivitySerializer(serializers.ModelSerializer):
    candidate = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = HRProductivity
        fields = ("id", "hr", "candidate", "position", "action", 'created_at')

    def get_candidate(self, obj):
        if obj.candidate:
            return obj.candidate.name
        return None

    def get_position(self, obj):
        if obj.position:
            return obj.position.name
        return None

    def to_representation(self, obj):
        self.fields["created_at"] = serializers.DateTimeField(format="%H:%M:%S %d-%m-%Y")
        self.fields["hr"] = serializers.CharField(source="hr.username")

        return super().to_representation(obj)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "name")


class CandidateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.IntegerField(min_value=0))

    def to_representation(self, obj):
        self.fields["skills"] = SkillSerializer(many=True)
        return super().to_representation(obj)

    class Meta:
        model = Candidate
        fields = ("id", "name", "skills")

    @atomic
    def create(self, validated_data):
        skills = validated_data.pop("skills")
        print(skills)
        candidate = Candidate.objects.create(**validated_data)
        candidate.skills.set(skills)
        user = self.context["request"].user
        HRProductivity.objects.create(
            candidate=candidate, hr=user, action=HRProductivity.ACTION_CHOICES[5][0]
        )
        return candidate


class CandidateFilterSerializer(serializers.Serializer):
    skills = serializers.ListField(child=serializers.IntegerField(min_value=0), allow_null=True)

    def get_candidates(self):
        skills = set(self.validated_data["skills"])
        if skills:

            possible_candidates = Candidate.objects.annotate(c=Count("skills")).filter(
                c__gte=len(skills)
            ).filter(skills__in=skills)
            candidates = []
            for candidate in possible_candidates:
                candidates_skills = set(candidate.skills.all().values_list('id', flat=True))
                if candidates_skills.issuperset(skills):
                    candidates.append(candidate)
        else:
            candidates = Candidate.objects.all()
        serializer = CandidateSerializer(candidates, many=True)
        return serializer.data

    def to_representation(self, obj):
        data = super().to_representation(obj)
        data["candidates"] = self.get_candidates()
        return data


class PositionSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.IntegerField(min_value=0))

    def to_representation(self, obj):
        self.fields["skills"] = SkillSerializer(many=True)
        return super().to_representation(obj)

    class Meta:
        model = Position
        fields = ("id", "name", "skills")

    @atomic
    def create(self, validated_data):
        skills = validated_data.pop("skills")
        position = Position.objects.create(**validated_data)
        position.skills.set(skills)
        user = self.context["request"].user
        HRProductivity.objects.create(
            hr=user, position=position, action=HRProductivity.ACTION_CHOICES[7][0]
        )
        return position


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_superuser")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(label=_("Username"), write_only=True)
    password = serializers.CharField(
        label=_("Password"),
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )
    token = serializers.CharField(label=_("Token"), read_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = authenticate(
                request=self.context.get("request"),
                username=username,
                password=password,
            )
            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _("Unable to log in with provided credentials.")
                raise serializers.ValidationError(msg, code="authorization")
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code="authorization")

        attrs["user"] = user
        return attrs


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
        )

        extra_kwargs = {
            "email": {
                "write_only": True,
            },
            "username": {"write_only": True},
            "password": {"write_only": True, "min_length": 8},
        }

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)
            return user
