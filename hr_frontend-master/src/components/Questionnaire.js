import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Table,
    Row,
    Col,
  } from "reactstrap";
  import React, { useState } from "react";
  import axios from "axios";
  import { API_URL_QUESTIONNAIRE } from "../api/ApiUrls";
  
  export default function Questionnaire({id, questionnaire_info}) {
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [rating, setRating] = useState(5);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    function validateForm() {
        // console.log(questionnaire_info, '!!!!!')
      return question!==null && answer!==null && rating!==null;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      let data = { question: question, answer: answer, rating: rating, selection: id };
      axios
        .post(API_URL_QUESTIONNAIRE, data, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
        .then((response) => {
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
                <h5 className="title text-center">Анкетирование</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        <label>Вопрос</label>
                        <Input
                          autoFocus
                          onChange={(e) => setQuestion(e.target.value)}
                          type="text"
                          value={question}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        <label>Ответ</label>
                        <Input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1 ml-2 mr-4">
                      <FormGroup>
                        <label>Оценка</label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
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
                {questionnaire_info.length > 0 ? (
                    <>
                    <label  className="mt-3 mb-3">Заданные вопросы</label>
                  <Table className="tablesorter">
                    <thead className="text-primary">
                      <tr>
                        <th>Вопрос</th>
                        <th>Ответ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionnaire_info.map((row) => (
                        <tr>
                          <td>{row.question}</td>
                          <td>{row.answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  </>
                ) : (
                    <label  className="mt-3 mb-3">Пока не задано ни одного вопроса</label>
                )}
              </CardBody>
            </Card>
    );
  }
  