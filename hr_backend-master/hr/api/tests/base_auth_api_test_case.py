from django.urls import reverse
from rest_framework.test import APIClient, APITestCase


class BaseAuthAPITestCaseView(APITestCase):
    fixtures = ["fixtures.json"]
    login_url_name = "login"
    sign_in_data = {"username": "user", "password": "password"}

    def setUp(self):
        response = self.client.post(
            reverse(self.login_url_name), self.sign_in_data, format="json"
        )

        auth_token = response.data["token"]
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token " + auth_token)
