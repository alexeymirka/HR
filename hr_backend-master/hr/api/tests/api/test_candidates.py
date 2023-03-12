from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestCandidates(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "candidate-list"
    detail_url_name = "candidate-detail"

    def test_get(self):
        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 4)

    def test_add(self):
        data = {
            'name': 'Igor',
            'skills': [1, 2]
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

    def test_update(self):
        data = {
            'skills': [1,2, 3 ]
        }
        response = self.client.patch(reverse(self.detail_url_name, kwargs={'pk': 1}), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )

    def test_delete(self):
        response = self.client.delete(reverse(self.detail_url_name, kwargs={'pk': 1}), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_204_NO_CONTENT, response.content
        )