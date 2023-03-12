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
import { API_URL_ATTESTATION } from "../api/ApiUrls";

export default function Attestation({ id }) {
  const [responsibility, setResponsibility] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [diligence, setDiligence] = useState(5);
  const [leadership, setLeadership] = useState(5);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm() {
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let data = {
      responsibility: responsibility,
      punctuality: punctuality,
      diligence: diligence,
      leadership: leadership,
      selection: id,
    };
    axios
      .post(API_URL_ATTESTATION, data, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        window.location.reload(false);
      })
      .catch((error) => {
        setShowError(true)
        setErrorMessage("Кандидат уже аттестован");
      });
  }

  return (
    <Card>
      <CardHeader>
        <h5 className="title text-center">Аттестация</h5>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col className="pr-md-1 ml-2 mr-4">
              <FormGroup>
                <label>Ответственность</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="pr-md-1 ml-2 mr-4">
              <FormGroup>
                <label>Пунктуальность</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={punctuality}
                  onChange={(e) => setPunctuality(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="pr-md-1 ml-2 mr-4">
              <FormGroup>
                <label>Исполнительность</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={diligence}
                  onChange={(e) => setDiligence(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="pr-md-1 ml-2 mr-4">
              <FormGroup>
                <label>Лидерские качества</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={leadership}
                  onChange={(e) => setLeadership(e.target.value)}
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
