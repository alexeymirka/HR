from django.urls import reverse
from rest_framework import status
from ..base_auth_api_test_case import BaseAuthAPITestCaseView


class TestSelection(BaseAuthAPITestCaseView):
    fixtures = ["api/fixtures/users.json", "api/fixtures/fixtures.json"]
    url_name = "selection-list"
    detail_url_name = "selection-detail"

    def test_get_list(self):
        response = self.client.get(reverse(self.url_name), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(len(response.data), 4)

    def test_retrieve(self):
        response = self.client.get(reverse(self.detail_url_name, kwargs={'pk': 1}), format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )
        self.assertEqual(response.data['id'], 1)

    def test_add(self):
        data = {
            'candidate': 1,
            "position": 2
        }
        response = self.client.post(reverse(self.url_name), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.content
        )

    def test_stage_update(self):
        data = {
            'stage': 'Тестирование'
        }
        response = self.client.patch(reverse(self.detail_url_name, kwargs={'pk': 1}), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )

    def test_competence_update(self):
        data = {
            'competence': 10
        }
        response = self.client.patch(reverse(self.detail_url_name, kwargs={'pk': 1}), data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, response.content
        )

