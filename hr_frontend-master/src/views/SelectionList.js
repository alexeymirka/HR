import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useHistory, Redirect } from "react-router-dom";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL_SELECTION } from "../api/ApiUrls";

export default function SelectionList() {
  const [selectionInfo, setSelectionInfo] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectionInfo]);

  const fetchData = () => {
    axios
      .get(API_URL_SELECTION, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSelectionInfo(response.data);
      });
    // setLoading(false);
  };
  const history = useHistory();

  function handleSelectionDetail(id) {
    let path = `/hr/selection_detail/${id}`;
    history.push(path);
  }

  function handleSelectionInfo(id) {
    let path = `/hr/selection_info/${id}`;
    history.push(path);
  }

  return (
    <div className="content">
      <Row className="d-flex justify-content-center mt-5">
        <Col md="9">
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="text-center">
                Отбор кандидатов
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>Должность</th>
                    <th>Кандидат</th>
                    <th>Этап отбора</th>
                    <th>Статус</th>
                    <th>Управление</th>
                    {localStorage.getItem("is_superuser")=='true' ? (
                      <th>Результаты</th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectionInfo ? (
                    selectionInfo.map((row) => (
                      <tr>
                        <td>{row.position}</td>
                        <td>{row.candidate}</td>
                        <td>{row.stage}</td>
                        <td>

                    <b>
                      {row.status=="IN PROGRESS"
                        ? 'В процессе'
                        : ""}
                        {row.status=="ACCEPTED"
                          ? 'Принят'
                          : ""}
                          {row.status=="DECLINED"
                            ? 'Отклонен'
                            : ""}
                    </b>
                          </td>
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            className="m-1"
                            onClick={() => handleSelectionDetail(row.id)}
                          >
                            Управление
                          </Button>
                        </td>
                        {localStorage.getItem("is_superuser") == "true" ? (
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              className="m-1"
                              onClick={() => handleSelectionInfo(row.id)}
                            >
                              Результаты оценки
                            </Button>
                          </td>
                        ) : (
                          <></>
                        )}
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
