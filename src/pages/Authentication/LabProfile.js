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

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";
import { propTypes } from "react-bootstrap/esm/Image";

class LabProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      country: "",
      email: "",
      department: "",
      landline: "",
      address: "",
      city: "",
      organization: "",
      postalcode: "",
      is_active: "",
      is_blocked: "",
      fax: "",
      isProfileUpdated: false,
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
        landline: this.props.success.landline,
        address: this.props.success.address,
        city: this.props.success.city,
        fax: this.props.success.fax,
        department: this.props.success.department,
        country: this.props.success.country,
        postalcode: this.props.success.postalcode,
        organization: this.props.success.organization,

        complaint_handling_email: this.props.success.complaint_handling_email,
        complaint_handling_phone: this.props.success.complaint_handling_phone,

        is_active: this.props.success.is_active,
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
                        country: (this.state && this.state.country) || "",
                        fax: (this.state && this.state.fax) || "",
                        department: (this.state && this.state.department) || "",
                        postalcode: (this.state && this.state.postalcode) || "",
                        landline: (this.state && this.state.landline) || "",
                        address: (this.state && this.state.address) || "",
                        city: (this.state && this.state.city) || "",
                        organization:
                          (this.state && this.state.organization) || "",

                        complaint_handling_email:
                          (this.state && this.state.complaint_handling_email) ||
                          "",
                        complaint_handling_phone:
                          (this.state && this.state.complaint_handling_phone) ||
                          "",
                        is_active:
                          (this.state && this.state.is_active) || "Yes",
                      }}
                      validationSchema={Yup.object().shape({
                        name: Yup.string()
                          .trim()
                          .required("Please enter your name")
                          .min(3, "Please enter at least 3 characters")
                          .max(255, "Please enter maximum 255 characters"),

                        email: Yup.string()
                          .required("Please enter your email")
                          .email("Please enter valid email")
                          .max(255, "Please enter maximum 255 characters"),

                        landline: Yup.string()
                          .required("Please enter your landline no.")
                          .max(255, "Please enter maximum 255 characters"),
                        postalcode: Yup.string()
                          .required("Please enter your postalcode no.")
                          .max(255, "Please enter maximum 255 characters"),
                        fax: Yup.string()
                          .required("Please enter your fax no.")
                          .max(255, "Please enter maximum 255 characters"),
                        address: Yup.string()
                          .trim()
                          .required("Please enter your full address")
                          .max(255, "Please enter maximum 255 characters"),
                        city: Yup.string()
                          .trim()
                          .required("Please enter your city")
                          .max(255, "Please enter maximum 255 characters")
                          .matches(
                            /^[a-zA-Z][a-zA-Z ]+$/,
                            "Please enter only alphabets and spaces"
                          ),
                        country: Yup.string()
                          .trim()
                          .required("Please enter your country")
                          .max(255, "Please enter maximum 255 characters")
                          .matches(
                            /^[a-zA-Z][a-zA-Z ]+$/,
                            "Please enter only alphabets and spaces"
                          ),
                        department: Yup.string()
                          .trim()
                          .required("Please enter your department")
                          .max(255, "Please enter maximum 255 characters"),
                        organization: Yup.string()
                          .trim()
                          .required("Please enter your organization")
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
                                  onChange={e =>
                                    this.setState({ name: e.target.value })
                                  }
                                  value={this.state.name}
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
                              {/* Email field */}
                              <div className="mb-3">
                                <Label for="email" className="form-label">
                                  Email
                                </Label>
                                <Field
                                  name="email"
                                  type="text"
                                  onFocus={() => {
                                    this.setState({
                                      emailFieldError: null,
                                    });
                                  }}
                                  onChange={e =>
                                    this.setState({ email: e.target.value })
                                  }
                                  value={this.state.email}
                                  className={
                                    "form-control" +
                                    ((errors.email && touched.email) ||
                                    this.state.emailFieldError
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="invalid-feedback"
                                />
                                <div className="invalid-feedback">
                                  {this.state.emailFieldError}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6} md={6} xl={6}>
                              {/* Landline field */}
                              <div className="mb-3">
                                <Label for="landline" className="form-label">
                                  Landline
                                </Label>
                                <Field
                                  id="landline"
                                  name="landline"
                                  type="text"
                                  onChange={e =>
                                    this.setState({
                                      landline: e.target.value,
                                    })
                                  }
                                  value={this.state.landline}
                                  className={
                                    "form-control" +
                                    (errors.landline && touched.landline
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="landline"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                            <Col sm={6} md={6} xl={6}>
                              {" "}
                              {/* fax */}
                              <div className="mb-3">
                                <Label for="fax" className="form-label">
                                  Fax
                                </Label>
                                <Field
                                  id="fax"
                                  name="fax"
                                  type="text"
                                  onChange={e =>
                                    this.setState({ fax: e.target.value })
                                  }
                                  value={this.state.fax}
                                  className={
                                    "form-control" +
                                    (errors.fax && touched.fax
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={6} md={6} xl={6}>
                              {" "}
                              {/* postalcode */}
                              <div className="mb-3">
                                <Label for="postalcode" className="form-label">
                                  Postalcode
                                </Label>
                                <Field
                                  id="postalcode"
                                  name="postalcode"
                                  type="text"
                                  onChange={e =>
                                    this.setState({
                                      postalcode: e.target.value,
                                    })
                                  }
                                  value={this.state.postalcode}
                                  className={
                                    "form-control" +
                                    (errors.postalcode && touched.postalcode
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="postalcode"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                            <Col sm={6} md={6} xl={6}>
                              {" "}
                              {/* city */}
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  City
                                </Label>
                                <Field
                                  id="city"
                                  name="city"
                                  type="text"
                                  onChange={e =>
                                    this.setState({ city: e.target.value })
                                  }
                                  value={this.state.city}
                                  className={
                                    "form-control" +
                                    (errors.city && touched.city
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6} md={6} xl={6}>
                              {" "}
                              {/* country */}
                              <div className="mb-3">
                                <Label for="country" className="form-label">
                                  Country
                                </Label>
                                <Field
                                  id="country"
                                  name="country"
                                  type="text"
                                  onChange={e =>
                                    this.setState({ country: e.target.value })
                                  }
                                  value={this.state.country}
                                  className={
                                    "form-control" +
                                    (errors.country && touched.country
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                            <Col sm={6} md={6} xl={6}>
                              {" "}
                              {/* department */}
                              <div className="mb-3">
                                <Label for="department" className="form-label">
                                  Department
                                </Label>
                                <Field
                                  id="department"
                                  name="department"
                                  type="text"
                                  onChange={e =>
                                    this.setState({
                                      department: e.target.value,
                                    })
                                  }
                                  value={this.state.department}
                                  className={
                                    "form-control" +
                                    (errors.department && touched.department
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="department"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>

                          {/* organization */}
                          <div className="mb-3">
                            <Label for="organization" className="form-label">
                              Organization
                            </Label>
                            <Field
                              id="organization"
                              name="organization"
                              type="text"
                              onChange={e =>
                                this.setState({ organization: e.target.value })
                              }
                              value={this.state.organization}
                              className={
                                "form-control" +
                                (errors.organization && touched.organization
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>

                          {/* Address field */}
                          <div className="mb-3">
                            <Label for="address" className="form-label">
                              Complete address
                            </Label>
                            <Field
                              id="address"
                              name="address"
                              type="text"
                              onChange={e =>
                                this.setState({ address: e.target.value })
                              }
                              value={this.state.address}
                              className={
                                "form-control" +
                                (errors.address && touched.address
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="address"
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
