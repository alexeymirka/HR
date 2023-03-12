from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class Skill(models.Model):
    name = models.CharField(_("Навык"), max_length=255, unique=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Candidate(models.Model):
    name = models.CharField(_("Имя"), max_length=255)
    skills = models.ManyToManyField(Skill)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Position(models.Model):
    name = models.CharField(_("Имя"), max_length=255)
    skills = models.ManyToManyField(Skill)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Selection(models.Model):
    class Meta:
        ordering = ['-id']
        unique_together = (
            "candidate",
            "position",
        )

    STAGE_CHOICES = (
        (
            "Анкетирование",
            "Анкетирование",
        ),
        (
            "Тестирование",
            "Тестирование",
        ),
        (
            "Стажировка",
            "Стажировка",
        ),
        (
            "Аттестация",
            "Аттестация",
        ),
    )
    STATUS_CHOICES = (
        (
            "IN PROGRESS",
            "В процессе",
        ),
        (
            "ACCEPTED",
            "Принят",
        ),
        (
            "DECLINED",
            "Отклонен",
        ),
    )
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    competence = models.PositiveSmallIntegerField(
        _("Компетентность"),
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    stage = models.CharField(
        max_length=255, choices=STAGE_CHOICES, default=STAGE_CHOICES[0][1]
    )
    status = models.CharField(
        max_length=255, choices=STATUS_CHOICES, default=STATUS_CHOICES[0][0]
    )

    def __str__(self):
        return f"{self.candidate.name}, {self.position.name}"


class Questionnaire(models.Model):
    selection = models.ForeignKey(
        Selection, on_delete=models.CASCADE, related_name="questionnaire_results"
    )
    question = models.TextField(_("Вопрос"))
    answer = models.TextField(
        _("Ответ"),
    )
    rating = models.PositiveSmallIntegerField(
        _("Оценка"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )

    def __str__(self):
        return f"{self.selection.candidate.name}, {self.selection.position.name}"


class Testing(models.Model):
    selection = models.OneToOneField(
        Selection, on_delete=models.CASCADE, related_name="testing_results"
    )
    theory = models.PositiveSmallIntegerField(
        _("Теория"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    practice = models.PositiveSmallIntegerField(
        _("Практика"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    average = models.FloatField(editable=False)

    def get_average(self):
        return round(self.theory * 0.5 + self.practice * 0.5, 2)

    def save(self, *args, **kwargs):
        self.average = self.get_average()
        super(Testing, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.selection.candidate.name}, {self.selection.position.name}"


class Internship(models.Model):
    selection = models.OneToOneField(
        Selection, on_delete=models.CASCADE, related_name="internship_results"
    )
    theory = models.PositiveSmallIntegerField(
        _("Теория"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    practice = models.PositiveSmallIntegerField(
        _("Практика"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    average = models.FloatField(editable=False)

    def __str__(self):
        return f"{self.selection.candidate.name}, {self.selection.position.name}"

    def get_average(self):
        return round(self.theory * 0.5 + self.practice * 0.5, 2)

    def save(self, *args, **kwargs):
        self.average = self.get_average()
        super(Internship, self).save(*args, **kwargs)


class Attestation(models.Model):
    selection = models.OneToOneField(
        Selection, on_delete=models.CASCADE, related_name="attestation_results"
    )
    responsibility = models.PositiveSmallIntegerField(
        _("Ответственность"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    punctuality = models.PositiveSmallIntegerField(
        _("Пунктуальность"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    diligence = models.PositiveSmallIntegerField(
        _("Исполнительность"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    leadership = models.PositiveSmallIntegerField(
        _("Лидерские качества"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    average = models.FloatField(editable=False)

    def get_average(self):
        return round(
            self.responsibility * 0.25
            + self.punctuality * 0.25
            + self.diligence * 0.25
            + self.leadership * 0.25,
            2,
        )

    def save(self, *args, **kwargs):
        self.average = self.get_average()
        super(Attestation, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.selection.candidate.name}, {self.selection.position.name}"


class HRProductivity(models.Model):
    ACTION_CHOICES = (
        (
            "Анкетирование кандидата",
            "Анкетирование кандидата",
        ),
        (
            "Проведение тестирования кандидата",
            "Проведение тестирования кандидата",
        ),
        (
            "Анализ результатов стажировки",
            "Анализ результатов стажировки",
        ),
        (
            "Проведение аттестации кандидата",
            "Проведение аттестации кандидата",
        ),
        (
            "Перевод кандидата на следующий уровень отбора",
            "Перевод кандидата на следующий уровень отбора",
        ),
        (
            "Добавление кандидата",
            "Добавление кандидата",
        ),
        (
            "Удаление кандидата",
            "Удаление кандидата",
        ),
        (
            "Добавление позиции",
            "Добавление позиции",
        ),
        (
            "Удаление позиции",
            "Удаление позиции",
        ),
        (
            "Выставление оценки компетенции кандидата",
            "Выставление оценки компетенции кандидата",
        ),
    )
    hr = models.ForeignKey(User, on_delete=models.CASCADE)
    candidate = models.ForeignKey(
        Candidate, on_delete=models.CASCADE, null=True, blank=True
    )
    position = models.ForeignKey(
        Position, on_delete=models.CASCADE, null=True, blank=True
    )

    action = models.CharField(max_length=255, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.hr.username}, {self.action}"
