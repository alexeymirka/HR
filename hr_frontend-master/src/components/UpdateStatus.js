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
  import { API_URL_SELECTION } from "../api/ApiUrls";
  
  export default function UpdateStatus({id, prev_status}) {
    // const [status, setStatus] = useState(prev_status);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    // function validateForm() {
    //   return status!==null;
    // }
  
    function handleSubmit(status) {
      // event.preventDefault();
      let data = { status: status};
      console.log(data)
      axios
        .patch(`${API_URL_SELECTION}${id}/`, data, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
        .then((response) => {
          console.log(response.data)
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
                <h5 className="title text-center">Статус кандидата</h5>
              </CardHeader>
              <CardBody>
                <Row className="d-flex justify-content-center">
                <Button
                  className="btn-fill ml-2 mb-3"
                  color="primary"
                  type="submit"
                  onClick={() => {
                    handleSubmit("ACCEPTED");
                  }}
                  // disabled={!validateForm()}
                >
                  Принять 
                </Button>
                <Button
                  className="btn-fill ml-2 mb-3"
                  color="primary"
                  type="submit"
                  onClick={() => {
                    handleSubmit("DECLINED");
                  }}
                  // disabled={!validateForm()}
                >
                  Отклонить 
                </Button>
                <Alert
                  color="warning"
                  className="ml-2 mr-3"
                  style={{ display: showError ? "block" : "none" }}
                >
                  {errorMessage}
                </Alert>
                </Row>
              </CardBody>
            </Card>
   );      
  }