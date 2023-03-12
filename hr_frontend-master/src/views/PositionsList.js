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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { API_URL_POSITION } from "../api/ApiUrls";

export default function PositionsList() {
  const [positionsInfo, setPositionsInfo] = useState([]);

  useEffect(() => {
    fetchData();
  }, [positionsInfo]);

  const fetchData = () => {
    axios
      .get(API_URL_POSITION, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setPositionsInfo(response.data);
      });
    // setLoading(false);
  };

  return (
    <div className="content">
      <Row className="d-flex justify-content-center mt-5">
        <Col md="9">
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="text-center">
                Доступные должности
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>Должность</th>
                    <th>Навыки</th>
                  </tr>
                </thead>
                <tbody>
                  {positionsInfo? 
                  positionsInfo.map((row) => (
                    <tr>
                      <td>{row.name}</td>
                      <td>
                      {/* <td>{row.skills}</td> */}
                      {row.skills.map((skill)=> (
                        <Button variant="secondary" size="sm" className="m-1">{skill.name}</Button>
                      ))}
                      </td>
                    </tr>
                  )): <></>}
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
