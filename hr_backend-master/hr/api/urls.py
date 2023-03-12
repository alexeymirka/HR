from django.urls import path
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()

router.register("selection", SelectionView, basename="selection")
router.register("questionnaire", QuestionnaireView, basename="questionnaire")
router.register("testing", TestingView, basename="testing")
router.register("internship", InternshipView, basename="internship")
router.register("attestation", AttestationView, basename="attestation")
router.register("users", UserView, basename="users")

router.register("skill", SkillView, basename="skill")
router.register("candidate", CandidateView, basename="candidate")
router.register("position", PositionView, basename="position")
router.register("signup", SignUpView, basename="signup")
router.register("hr_productivity", HRProductivityView, basename="hr_productivity")

urlpatterns = router.urls
urlpatterns += [
    path("login/", LoginView.as_view(), name="login"),
    path("candidates/", CandidatesFilterView.as_view(), name="candidates"),
]
