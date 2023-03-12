from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *


class HRProductivityView(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
):


    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filterset_fields = ["hr__id"]
    queryset = HRProductivity.objects.all()
    serializer_class = HRProductivitySerializer


class AttestationView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):


    queryset = Attestation.objects.all()
    serializer_class = AttestationSerializer


class InternshipView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):


    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer


class TestingView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):


    queryset = Testing.objects.all()
    serializer_class = TestingSerializer


class QuestionnaireView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):


    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer


class SelectionView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
):
    """Перевод кандидата на следующий уровень отбора
    Выставление оценки компетенции кандидата
    Выставление рейтинга кандидату
    Просмотр результатов анализа кандидатов"""

    queryset = Selection.objects.all()
    serializer_class = SelectionSerializer


class SkillView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):


    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class CandidatesFilterView(APIView):


    def post(self, request, format=None):
        serializer = CandidateFilterSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):


    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    @atomic
    def destroy(self, request, *args, **kwargs):
        user = request.user
        HRProductivity.objects.create(
            hr=user, action=HRProductivity.ACTION_CHOICES[6][0]
        )
        return super(CandidateView, self).destroy(request, *args, **kwargs)


class PositionView(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):
    """Добавление/удаление/редактирование данных о позиции
    Просмотр доступных должностей для кандидатов
    Просмотр доступных требований для кандидатов"""

    queryset = Position.objects.all()
    serializer_class = PositionSerializer

    @atomic
    def destroy(self, request, *args, **kwargs):
        user = request.user
        HRProductivity.objects.create(
            hr=user, action=HRProductivity.ACTION_CHOICES[8][0]
        )
        return super(PositionView, self).destroy(request, *args, **kwargs)


class SignUpView(viewsets.GenericViewSet, mixins.CreateModelMixin):


    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"Success": "User created successfully"},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class LoginView(ObtainAuthToken):


    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserSerializer(instance=user).data}
        )


class UserView(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
):

    queryset = User.objects.all()
    serializer_class = UserSerializer
