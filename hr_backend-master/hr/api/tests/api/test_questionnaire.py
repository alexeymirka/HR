from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestQuestionnaire(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "questionnaire-list"

    def test_get(self):
        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 3)

    def test_successful_add(self):
        data = {
            'selection': 1,
            'question': '1+1',
            'answer': '2',
            'rating': 10,
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

    def test_unsuccessful_add(self):
        data = {
            'selection': 2,
            'question': '1+1',
            'answer': '2',
            'rating': 10,
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.content
        )