from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestPositions(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "position-list"

    def test_get(self):
        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 3)

    def test_add(self):
        data = {
            'name': 'HR',
            'skills': [1,2 ]
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )