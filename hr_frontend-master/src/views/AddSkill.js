import {
  Alert,
  Button,
  Card,
  CardHeader,
  Label,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_SKILL } from "../api/ApiUrls";
import { useHistory, Redirect } from "react-router-dom";

export default function AddSkill() {
  const [name, setName] = useState("");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
  }, []);


  function validateForm() {
    return name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let data = { name: name};
    axios
      .post(API_URL_SKILL, data, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }, data)
      .then((response) => {
        history.push("/hr/add_position");
      })
      .catch((error) => {
        console.log(error.response.data);
        setShowError(true);
        if (error.response) {
          console.log(error.response);
          for (let key in error.response.data) {
            setErrorMessage(error.response.data[key][0]);
          }
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
              <h5 className="title text-center">Добавить навык</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-md-1 ml-2 mr-4">
                    <FormGroup>
                      <label>Название</label>
                      <Input
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
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
                  Добавить
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
      {localStorage.getItem("logged_in") != "true" ? (
        <Redirect to="/hr/login" />
      ) : (
        <></>
      )}
    </div>
  );
}
