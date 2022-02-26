import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
import Select from "react-select";
import { Formik, Field } from "formik";
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Button,
  Form,
  Input,
  InputGroup,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

class FormLayouts extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Form Layouts | Skote - React Admin & Dashboard Template</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Forms" breadcrumbItem="Form Fields" />
            <Row>
                <Card>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col lg={2}>
                        <div className="col-sm-auto">
                        <Label htmlFor="autoSizingSelect">Types </Label>
                        <select defaultValue="0" className="form-select">
                          <option value="Choose...">Choose...</option>
                          <option value="Current Location">Current Location </option>
                          <option value="Register Address">Register Address</option>
                          <option value="Custom Address">Custom Address</option>
                        </select>
                        </div>
                        </Col>
                          <Col lg={2}>
                          <div className="mb-3">
                            <Label htmlFor="formrow_InputCity">City</Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="formrow_InputCity"
                              placeholder="Enter Your City"
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                      <div className="mb-3">
                            <Label htmlFor="formrow_InputLocation">Location</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="formrow_InputLocation"
                            placeholder="Search Location..."
                          />
                      </div>
                      </Col>
                      <div>
                        <button type="submit" className="btn btn-primary w-md">
                          FIND
                        </button>
                      </div>
                    </Row>
                    </Form>
                  </CardBody>
                </Card>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default FormLayouts;
