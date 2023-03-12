from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestHRProductivity(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "hr_productivity-list"

    def test_get(self):
        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 1)

    def test_questionnaire(self):
        data = {
            'selection': 1,
            'question': '1+1',
            'answer': '2',
            'rating': 10,
        }
        response = self.client.post(reverse("questionnaire-list"), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 2)

    def test_testing(self):
        data = {
            'selection': 2,
            'theory': 6,
            'practice': 3,
        }
        response = self.client.post(reverse('testing-list'), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 2)

    def test_internship(self):
        data = {
            'selection': 3,
            'theory': 6,
            'practice': 3,
        }
        response = self.client.post(reverse('internship-list'), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 2)

    def test_attestation(self):
        data = {
            'selection': 4,
            'responsibility': 10,
            'leadership': 9,
            'diligence': 6,
            'punctuality': 6
        }
        response = self.client.post(reverse('attestation-list'), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 2)
