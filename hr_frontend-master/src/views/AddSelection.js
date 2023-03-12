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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_POSITION, API_URL_CANDIDATE, API_URL_SELECTION } from "../api/ApiUrls";
import { useHistory, Redirect } from "react-router-dom";

export default function AddSelection() {
  const [candidate, setCandidate] = useState(null);
  const [position, setPosition] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    let candidatesData = await axios
      .get(API_URL_CANDIDATE, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
    setCandidates(candidatesData.data);
    setCandidate(candidatesData.data[0].id)
    let positionsData = await axios
      .get(API_URL_POSITION, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
    setPositions(positionsData.data);
    setPosition(positionsData.data[0].id)
      
  };

  function validateForm() {
    console.log(candidate, position)
    return (candidate!==null&&position!==null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let data = { candidate: candidate, position: position };
    axios
      .post(API_URL_SELECTION, data, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }, data)
      .then((response) => {
        history.push("/hr/selection");
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
              <h5 className="title text-center">Начать отбор кандидата</h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-md-1 ml-2 mr-4">

                  <FormGroup>
                      <label>Позиция</label>
                      <Input type="select"
                      onChange={(e) => setPosition(e.target.value)}
                      >
                        {positions ? (
                          positions.map((position) => 
                          <option value={position.id}>{position.name}</option>)
                        ) : (
                          <></>
                        )}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <label>Кандидат</label>
                      <Input type="select"
                      onChange={(e) => setCandidate(e.target.value)}
                      >
                        {candidates ? (
                          candidates.map((candidate) => 
                          <option value={candidate.id}>{candidate.name}</option>)
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
