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
import Questionnaire from "components/Questionnaire";
import Testing from "components/Testing";
import Internship from "components/Internship";
import Attestation from "components/Attestation";
import UpdateCompetence from "components/UpdateCompetence";
import UpdateStatus from "components/UpdateStatus";

export default function SelectionDetail() {
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

  function handleNextStage(event) {
    event.preventDefault();
    let stages = ['Анкетирование', 'Тестирование', 'Стажировка', 'Аттестация']
    let nextStage = stages[stages.indexOf(selectionInfo.stage)+1]
    console.log(nextStage)
    axios
        .patch(`${API_URL_SELECTION}${selectionId}/`, {stage: nextStage}, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
        .then((response) => {
          console.log(response.data)
        window.location.reload(false);
        })
    
  }

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
                      {selectionInfo.status=="IN PROGRESS"
                        ? 'В процессе'
                        : ""}
                        {selectionInfo.status=="ACCEPTED"
                          ? 'Принят'
                          : ""}
                          {selectionInfo.status=="DECLINED"
                            ? 'Отклонен'
                            : ""}
                    </b>
                  </p>

              {selectionInfo.status=="IN PROGRESS" && selectionInfo.stage !== 'Аттестация'?
                <Button
                  className="btn-fill mt-3"
                  color="primary"
                  type="submit"
                  onClick={handleNextStage}
                >Перевести на следующий этап отбора
                </Button>
                :<></>}
                </CardBody>
              </Card>

              {selectionInfo.status=="IN PROGRESS" ? <>
              <UpdateStatus
                id={selectionId}
                prev_status={selectionInfo.status}
              />
              <UpdateCompetence
                id={selectionId}
                prev_competence={selectionInfo.competence}
              /> </> : <></>}
              </Col>
              {selectionInfo.status=="IN PROGRESS" ? 
              <Col md="4">

              {selectionInfo.stage === "Анкетирование" ? (
                <Questionnaire
                  id={selectionId}
                  questionnaire_info={selectionInfo.results.questionnaire}
                />
                
              ) : (
                <></>
              )}
              {selectionInfo.stage === "Тестирование" ? (

              <Testing id={selectionId} />
              ) : (
                <></>
              )}
              {selectionInfo.stage === "Стажировка" ? (
              <Internship id={selectionId} />
              ) : (
                <></>
              )}
              {selectionInfo.stage === "Аттестация" ? (
              <Attestation id={selectionId} />
              ) : (
                <></>
              )}
              
            </Col> : <></>}
          </Row>
        </>
      ) : (
        <></>
      )}
      {localStorage.getItem("logged_in") != "true" ? (
        <Redirect to="/hr/login" />
      ) : (
        <></>
      )}
    </div>
  );
}
