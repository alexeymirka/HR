import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  FormGroup,
  Input,
  Row,
  Col,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import {useHistory, Redirect} from 'react-router-dom';

import axios from "axios";
import {
  API_URL_CANTIDATES_FILTER,
  API_URL_CANDIDATE,
  API_URL_SKILL,
} from "../api/ApiUrls";

export default function CandidatesList() {
  const [candidatesInfo, setCandidatesInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsResult, setSkillsResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [skillsResult]);

  const fetchData = () => {
    // console.log("get data");
    let data = { skills: skillsResult };
    axios
      .post(API_URL_CANTIDATES_FILTER, data, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // console.log(skillsResult, response.data.candidates);
        setCandidatesInfo(response.data.candidates);
      });
    axios
      .get(API_URL_SKILL, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSkills(response.data);
      });
    setLoading(false);
  };
  function handleSkillSelect(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSkillsResult(value);
  }

  function handleUnsetFiltering(event) {
    event.preventDefault();
    setSkillsResult([]);
  }

  function handleCandidateDelete(id) {
    // event.preventDefault();
    console.log(id);
    axios
      .delete(`${API_URL_CANDIDATE}${id}/`, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  const history = useHistory();
  function handleCandidateChange(id) {
    let path = `/hr/candidate/${id}`;
    history.push(path);
  }

  return (
    <div className="content">
      <Row className="d-flex justify-content-center mt-5">
        <Col md="2">
          <Button
            className="btn-fill w-100 ml-2 mb-3"
            color="primary"
            type="submit"
            onClick={handleUnsetFiltering}
          >
            Сбросить фильтрацию
          </Button>
          <FormGroup>
            <label>Требуемые навыки (можно выбрать несколько)</label>
            <Input
              multiple
              size={skills.length}
              name="selectMulti"
              type="select"
              onChange={(e) => handleSkillSelect(e)}
            >
              {skills ? (
                skills.map((skill) => (
                  <option value={skill.id}>{skill.name}</option>
                ))
              ) : (
                <></>
              )}
            </Input>
          </FormGroup>
        </Col>
        <Col md="10">
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="text-center">
                Кандидаты
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>Кандидат</th>
                    <th>Навыки</th>
                    <th>Изменить кандидата</th>
                    <th>Удалить кандидата</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatesInfo ? (
                    candidatesInfo.map((row) => (
                      <tr>
                        <td>{row.name}</td>
                        <td>
                          {row.skills.map((skill) => (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="m-1"
                            >
                              {skill.name}
                            </Button>
                          ))}
                        </td>
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            className="m-1"
                            onClick={() => handleCandidateChange(row.id)}
                          >
                            Изменить
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            className="m-1"
                            onClick={() => handleCandidateDelete(row.id)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
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
