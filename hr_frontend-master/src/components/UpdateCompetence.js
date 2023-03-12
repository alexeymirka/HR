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
  import { API_URL_SELECTION } from "../api/ApiUrls";
  
  export default function UpdateCompetence({id, prev_competence}) {
    const [competence, setCompetence] = useState(prev_competence);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    function validateForm() {
      return competence!==null;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      let data = { competence: competence};
      console.log(data)
      axios
        .patch(`${API_URL_SELECTION}${id}/`, data, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
        .then((response) => {
          console.log(response.data)
        window.location.reload(false);
        })
        .catch((error) => {
          console.log(error.response);
          setShowError(true);
          if (error.response) {
            setErrorMessage(error.response.data.non_field_errors[0]);
  
          }
          console.log(errorMessage);
        });
    }
  
    return (
            <Card>
              <CardHeader>
                <h5 className="title text-center">Оценка компетентности</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        {/* <label>Теория</label> */}
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={competence}
                          onChange={(e) => setCompetence(e.target.value)}
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
  