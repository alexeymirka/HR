from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestCandidatesFilter(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "candidates"

    def test_get_filtered(self):
        data = {
            'skills': [2,]
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data['candidates']), 2)
