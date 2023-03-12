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
  import { API_URL_TESTING } from "../api/ApiUrls";
  
  export default function Testing({id}) {
    const [theory, setTheory] = useState(5);
    const [practic, setPractic] = useState(5);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    function validateForm() {
      return true;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      let data = { theory: theory, practice: practic, selection:id};
      axios
        .post(API_URL_TESTING, data, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
        .then((response) => {
        window.location.reload(false);
        })
        .catch((error) => {
          setShowError(true)
            setErrorMessage('Кандидат уже тестирован');
        });
    }
  
    return (
            <Card>
              <CardHeader>
                <h5 className="title text-center">Тестирование</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        <label>Теория</label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={theory}
                          onChange={(e) => setTheory(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        <label>Практика</label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={practic}
                          onChange={(e) => setPractic(e.target.value)}
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
                  Отправить 
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
    );
  }
  