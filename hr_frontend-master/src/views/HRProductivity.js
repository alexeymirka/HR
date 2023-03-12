import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  FormGroup,
  Input
} from "reactstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { API_URL_HR_PRODUCTIVITY, API_URL_USERS } from "../api/ApiUrls";
//  TODO исправить криыую фильрацию по пользователю
export default function HRProductivity() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [params, setParams] = useState({});
  
  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    let hRProductivityData = await axios.get(API_URL_HR_PRODUCTIVITY, {
      params: params,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    setData(hRProductivityData.data);
    let usersData = await axios.get(API_URL_USERS, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    setUsers(usersData.data);
    // console.log('request', params.hr__id, hRProductivityData.data, hRProductivityData.data[0].hr)

  };

  const handleUserSelect = (e) => {
    // console.log('select', e.target.value, e.target.name)
    e.persist();
    if (e.target.value !='false') {
      setParams((prevState) => ({
        ...prevState,
        'hr__id': e.target.value,
      }));
    }
    else {
        delete params['hr__id']
        fetchData()
    }
    // fetchData()
  };

  return (
    <div className="content">
      <Row className="d-flex justify-content-center mt-5">
        <Col>
          <FormGroup>
            <label>HR</label>
            <Input
              type="select"
              name='hr__id'
              onChange={(e) => handleUserSelect(e)}
            >
              <option value={false}>Все</option>
              {users ? (
                users.map((user) => (
                  <option value={user.id}>{user.username}</option>
                ))
              ) : (
                <></>
              )}
            </Input>
          </FormGroup>
          <label>Обработано {data.length} человек</label>
        </Col>
        <Col md="9">
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="text-center">
                Продуктивность HR
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter">
                <thead className="text-primary">
                  <tr>
                    <th>HR</th>
                    <th>Действие</th>
                    <th>Кандидат</th>
                    <th>Должность</th>
                    <th>Время</th>
                  </tr>
                </thead>
                <tbody>
                  {data ? (
                    data.map((row) => (
                      <tr>
                        <td>{row.hr}</td>
                        <td>{row.action}</td>
                        <td>{row.candidate}</td>
                        <td>{row.position}</td>
                        <td>{row.created_at}</td>
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
      {localStorage.getItem("is_superuser") != "true" ? (
        <Redirect to="/hr/candidates" />
      ) : (
        <></>
      )}
    </div>
  );
}
