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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_SELECTION } from "../api/ApiUrls";
import { Redirect, useParams } from "react-router-dom";

export default function SelectionInfo() {
  const selectionId = useParams().id;
  const [selectionInfo, setSelectionInfo] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let selectionData = await axios.get(`${API_URL_SELECTION}${selectionId}/`, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    console.log(selectionData.data);
    setSelectionInfo(selectionData.data);
  };

  return (
    <div className="content">
      {selectionInfo && selectionInfo.results ? (
        <>
          <Row className="d-flex justify-content-around p-5">
            <Col md="4">
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Данные о кандидате</h5>
                </CardHeader>
                <CardBody>
                  <p>
                    Имя: <b>{selectionInfo.candidate}</b>
                  </p>
                  <p>
                    Позиция: <b>{selectionInfo.position}</b>
                  </p>
                  <p>
                    Этап: <b>{selectionInfo.stage}</b>
                  </p>
                  <p>
                    Компетентность:{" "}
                    <b>
                      {selectionInfo.competence
                        ? selectionInfo.competence
                        : "Нет данных"}
                    </b>
                  </p>
                  <p>
                    Статус:{" "}
                    <b>
                      {selectionInfo.status == "IN PROGRESS"
                        ? "В процессе"
                        : ""}
                      {selectionInfo.status == "ACCEPTED" ? "Принят" : ""}
                      {selectionInfo.status == "DECLINED" ? "Отклонен" : ""}
                    </b>
                  </p>
                </CardBody>
              </Card>
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Рейтинг</h5>
                </CardHeader>
                <CardBody>
                  <p>
                    Анкетирование:{" "}
                    <b>
                      {selectionInfo.results.rating.questionnaire
                        ? selectionInfo.results.rating.questionnaire
                        : "Нет данных"}
                    </b>
                  </p>
                  <p>
                    Тестирование:{" "}
                    <b>
                      {selectionInfo.results.rating.testing
                        ? selectionInfo.results.rating.testing
                        : "Нет данных"}
                    </b>
                  </p>
                  <p>
                    Стажировка:{" "}
                    <b>
                      {selectionInfo.results.rating.internship
                        ? selectionInfo.results.rating.internship
                        : "Нет данных"}
                    </b>
                  </p>
                  <p>
                    Аттестация:{" "}
                    <b>
                      {selectionInfo.results.rating.attestation
                        ? selectionInfo.results.rating.attestation
                        : "Нет данных"}
                    </b>
                  </p>
                  <p>
                    Средний балл:{" "}
                    <b>
                      {selectionInfo.results.rating.average
                        ? selectionInfo.results.rating.average
                        : "Нет данных"}
                    </b>
                  </p>
                </CardBody>
              </Card>
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Результаты анкетиования</h5>
                </CardHeader>
                <CardBody>
                  {selectionInfo.results.questionnaire.length > 0 ? (
                    <Table className="tablesorter">
                      <thead className="text-primary">
                        <tr>
                          <th>Вопрос</th>
                          <th>Ответ</th>
                          <th>Оценка</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectionInfo.results.questionnaire.map((row) => (
                          <tr>
                            <td>{row.question}</td>
                            <td>{row.answer}</td>
                            <td>{row.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Нет данных</p>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Результаты тестиования</h5>
                </CardHeader>
                <CardBody>
                  {selectionInfo.results.testing ? (
                    <>
                      <p>
                        Теория: <b>{selectionInfo.results.testing.theory}</b>
                      </p>
                      <p>
                        Практика:{" "}
                        <b>{selectionInfo.results.testing.practice}</b>
                      </p>
                      <p>
                        Средний балл:{" "}
                        <b>{selectionInfo.results.testing.average}</b>
                      </p>
                    </>
                  ) : (
                    <p>Нет данных</p>
                  )}
                </CardBody>
              </Card>
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Результаты стажировки</h5>
                </CardHeader>
                <CardBody>
                  {selectionInfo.results.internship ? (
                    <>
                      <p>
                        Теория: <b>{selectionInfo.results.internship.theory}</b>
                      </p>
                      <p>
                        Практика:{" "}
                        <b>{selectionInfo.results.internship.practice}</b>
                      </p>
                      <p>
                        Средний балл:{" "}
                        <b>{selectionInfo.results.internship.average}</b>
                      </p>
                    </>
                  ) : (
                    <p>Нет данных</p>
                  )}
                </CardBody>
              </Card>
              <Card className="mh-100 p-3">
                <CardHeader>
                  <h5 className="title text-center">Результаты аттестации</h5>
                </CardHeader>
                <CardBody>
                  {selectionInfo.results.attestation ? (
                    <>
                      <p>
                        Ответственность:{" "}
                        <b>
                          {selectionInfo.results.attestation.responsibility}
                        </b>
                      </p>
                      <p>
                        Пунктуальность:{" "}
                        <b>{selectionInfo.results.attestation.punctuality}</b>
                      </p>
                      <p>
                        Исполнительность:{" "}
                        <b>{selectionInfo.results.attestation.diligence}</b>
                      </p>
                      <p>
                        Лидерские качества:{" "}
                        <b>{selectionInfo.results.attestation.leadership}</b>
                      </p>
                      <p>
                        Средний балл:{" "}
                        <b>{selectionInfo.results.attestation.average}</b>
                      </p>
                    </>
                  ) : (
                    <p>Нет данных</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}

      {localStorage.getItem("is_superuser") != "true" ? (
        <Redirect to="/hr/candidates" />
      ) : (
        <></>
      )}
    </div>
  );
}
