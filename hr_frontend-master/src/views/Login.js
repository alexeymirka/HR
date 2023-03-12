import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import React, { useState } from "react";
import axios from "axios";
import { API_URL_LOGIN } from "../api/ApiUrls";
import { useHistory, Redirect } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let data = { username: username, password: password };
    axios
      .post(API_URL_LOGIN, data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("logged_in", true);
        localStorage.setItem("username", username);
        localStorage.setItem("is_superuser", response.data.user.is_superuser);
        history.push("/hr/candidates");
      })
      .catch((error) => {
        console.log(error.response.data );
        setShowError(true);
        if (error.response) {
          setErrorMessage(error.response.data.errors.error[0]);

        }
        console.log(errorMessage);
      });
  }

  return (
    <div className="content">
      <Row className="d-flex justify-content-center">
        <Col md="4" className="mt-5">
          <Card>
            <CardHeader>
              <h5 className="title text-center">Войти</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-md-1 ml-2 mr-4">
                    <FormGroup>
                      <label>Имя</label>
                      <Input
                        autoFocus
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        value={username}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1 ml-2 mr-4">
                    <FormGroup>
                      <label>Пароль</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              <Button
                className="btn-fill ml-2 mb-3"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={!validateForm()}
              >
                Вход
              </Button>
              <Alert
                color="warning"
                className="ml-2 mr-3"
                style={{ display: showError ? "block" : "none" }}
              >
                {errorMessage}
              </Alert>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {localStorage.getItem("logged_in") == "true" ? (
        <Redirect to="/hr/candidates" />
      ) : (
        <></>
      )}
    </div>
  );
}
