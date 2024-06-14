import PropTypes from "prop-types";
import Select from "react-select";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import {
  updateLabProfile,
  getLabProfile,
  updateLabProfileFail,
  apiError,
} from "../../store/actions";

import { propTypes } from "react-bootstrap/esm/Image";

class LabProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      lab_staff_name:"",
      landline_registered_by:"",
      shipping_address: "",
      billing_address: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      emailFieldError: null,
    };
  }

  componentDidMount() {
    this.props.getLabProfile(this.state.user_id);
    this.props.apiError("");
    this.props.updateLabProfileFail("");

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        email: this.props.success.email,
        landline_registered_by: this.props.success.landline_registered_by,
        shipping_address: this.props.success.shipping_address,
        billing_address: this.props.success.billing_address,
        lab_staff_name: this.props.success.lab_staff_name,
      
      });
    }, 1500);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.emailError != this.props.emailError) {
      this.setState({ emailFieldError: this.props.emailError });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content ">
          <Container fluid className="">
            {/* Render Breadcrumb */}
            <Breadcrumb title="Account" breadcrumbItem="Profile" />

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            {/* <Row className="mb-5"> */}
            {/* <div className="d-flex  justify-content-center"> */}
            <Row className="align-items-center justify-content-center ">
              <Col sm={10} md={10} lg={8} xl={8}>
                <h5 className="card-title mb-4 mt-5 fs-4">Update Profile</h5>{" "}
                <Card className="" style={{ backgroundColor: "#E8E7E7" }}>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        name: (this.state && this.state.name) || "",
                        email: (this.state && this.state.email) || "",
                        lab_staff_name:
                          (this.state && this.state.lab_staff_name) || "",
                        landline_registered_by:
                          (this.state && this.state.landline_registered_by) || "",
                        shipping_address:
                          (this.state && this.state.shipping_address) || "",
                        billing_address:
                          (this.state && this.state.billing_address) || "",
                       
                      }}
                      validationSchema={Yup.object().shape({
                        name: Yup.string()
                          .trim()
                          .required("Please enter your name")
                          .min(3, "Please enter at least 3 characters")
                          .max(255, "Please enter maximum 255 characters"),

                        lab_staff_name: Yup.string()
                          .trim()
                          .required("Please enter name of notification person")
                          .min(3, "Please enter at least 3 characters")
                          .max(255, "Please enter maximum 255 characters"),

                        email: Yup.string()
                          .required("Please enter your email")
                          .email("Please enter valid email")
                          .max(255, "Please enter maximum 255 characters"),

                        landline_registered_by: Yup.string()
                          .required("Please enter your landline_registered_by")
                          .max(255, "Please enter maximum 255 characters"),
                        billing_address: Yup.string()
                          .required("Please enter your billing_address")
                          .max(255, "Please enter maximum 255 characters"),
                        shipping_address: Yup.string()
                          .trim()
                          .required("Please enter your shipping_address")
                          .max(255, "Please enter maximum 255 characters"),
                       
                      })}
                      onSubmit={values => {
                        // console.log("ssssssssssss",emailFieldError )
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });

                        this.props.updateLabProfile(values, this.state.user_id);
                        // To show success message of
                        if (!this.state.emailFieldError) {
                          this.setState({ isProfileUpdated: true });
                        }
                        // To get updated profile again
                        setTimeout(() => {
                          this.props.getLabProfile(this.state.user_id);
                        }, 1000);

                        setTimeout(() => {
                          this.setState({
                            isProfileUpdated: false,
                          });
                        }, 5000);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal mb-3">
                          {/* Name field */}
                          <Row>
                            <Col sm={6} md={6} xl={6}>
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  id="name"
                                  name="name"
                                  type="text"
                                  className={
                                    "form-control" +
                                    (errors.name && touched.name
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                            <Col sm={6} md={6} xl={6}>
                              {/* Name of notifying person */}
                              <div className="mb-3">
                                <Label
                                  for="lab_staff_name"
                                  className="form-label"
                                >
                                  {/* Registered by (Name) */}
                                  Name of notification person
                                </Label>
                                <Field
                                  id="lab_staff_name"
                                  name="lab_staff_name"
                                  type="text"
                                  placeholder="Please enter the name of person registering participant"
                                  className={
                                    "form-control" +
                                    (errors.lab_staff_name &&
                                    touched.lab_staff_name
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="lab_staff_name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6} md={6} xl={6}>
                              <div className="mb-3">
                                <Label className="form-label">
                                  Email of notification person
                                </Label>
                                <Field
                                  name="email"
                                  type="text"
                                  placeholder="Enter email"
                                  className={
                                    "form-control" +
                                    (errors.email && touched.email
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="invalid-feedback"
                                />

                                {this.state.emailError && (
                                  <div className="invalid-feedback d-block">
                                    {this.state.emailError}
                                  </div>
                                )}
                              </div>
                            </Col>

                            <Col sm={6} md={6} xl={6}>
                              {/* Landline field */}
                              <div className="mb-3">
                                <Label
                                  for="landline_registered_by"
                                  className="form-label"
                                >
                                  Contact No. of notification person
                                </Label>
                                <Field
                                  id="landline_registered_by"
                                  name="landline_registered_by"
                                  type="text"
                                  placeholder="Please enter landline no."
                                  className={
                                    "form-control" +
                                    (errors.landline_registered_by &&
                                    touched.landline_registered_by
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="landline_registered_by"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>

                          {/* shipping field */}
                          <div className="mb-3">
                            <Label
                              for="shipping_address"
                              className="form-label"
                            >
                              Shipping Address
                            </Label>
                            <Field
                              id="shipping_address"
                              name="shipping_address"
                              type="text"
                              className={
                                "form-control" +
                                (errors.shipping_address &&
                                touched.shipping_address
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="shipping_address"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          {/* billing_address */}
                          <div className="mb-3">
                            <Label for="billing_address" className="form-label">
                              Billingh Address
                            </Label>
                            <Field
                              id="billing_address"
                              name="billing_address"
                              type="text"
                              className={
                                "form-control" +
                                (errors.billing_address &&
                                touched.billing_address
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="billing_address"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>

                          <div className="text-end mt-4">
                            <Button
                              type="submit"
                              style={{
                                backgroundColor: "#1D1DE4",
                              }}
                            >
                              Update Profile
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* <Col className="" sm={10} md={10} xl={8}> */}
            {/* {this.props.emailError &&
                            this.props.emailError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.emailError}
                            </Alert>
                          ) : null} */}

            {/* </Col> */}
            {/* </div> */}
            {/* </Row> */}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  emailError: PropTypes.any,
  updateLabProfileFail: PropTypes.any,
  apiError: PropTypes.any,
  updateLabProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, emailError, success } = state.LabProfile;
  return { error, emailError, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateLabProfile,
    updateLabProfileFail,
    apiError,
    getLabProfile,
  })(LabProfile)
);
