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
import { API_URL_SKILL, API_URL_CANDIDATE } from "../api/ApiUrls";
import { useHistory, Redirect } from "react-router-dom";

export default function AddCandidate() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillsResult, setSkillsResult] = useState([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(API_URL_SKILL, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSkills(response.data);
      });
  };

  function validateForm() {
    return name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let data = { name: name, skills: skillsResult };
    axios
      .post(API_URL_CANDIDATE, data, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }, data)
      .then((response) => {
        history.push("/hr/candidates");
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
  function handleSkillSelect (e) {
    let value = Array.from(e.target.selectedOptions, option => option.value);
    console.log(value)
    setSkillsResult(value);
  }

  return (
    <div className="content">
      <Row className="d-flex justify-content-center">
        <Col md="4" className="mt-5">
          <Card>
            <CardHeader>
              <h5 className="title text-center">Добавить кандидата</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-md-1 ml-2 mr-4">
                    <FormGroup>
                      <label>Имя</label>
                      <Input
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Навыки (можно выбрать несколько)</label>
                      <Input multiple name="selectMulti" type="select"
                      onChange={(e) => handleSkillSelect(e)}
                      >
                        {skills ? (
                          skills.map((skill) => 
                          <option value={skill.id}>{skill.name}</option>)
                        ) : (
                          <></>
                        )}
                      </Input>
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
