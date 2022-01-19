import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";

// action
import {
  addPatientInformation,
  addPatientInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class PatientInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cnic: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      corporate_unique_id: "",
    };
  }

  componentDidMount() {
    this.props.addPatientInformationFailed("");
  }

  render() {
    // Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Patient Information | Ilaaj4u</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

              <Col xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">
                            Patient account information
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Ilaaj4u
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.patient && this.props.patient ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              You have registered successfully and you can now{" "}
                              <Link>
                                {" "}
                                <Link
                                  to="/login"
                                  className="fw-medium text-primary"
                                >
                                  {" "}
                                  login
                                </Link>{" "}
                              </Link>{" "}
                              to your account.
                            </Alert>
                          ) : null}

                          {this.props.addPatientError &&
                          this.props.addPatientError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addPatientError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              cnic: (this.state && this.state.cnic) || "",
                              email: (this.state && this.state.email) || "",
                              phone: (this.state && this.state.phone) || "",
                              address: (this.state && this.state.address) || "",
                              city: (this.state && this.state.city) || "",
                              district:
                                (this.state && this.state.district) || "",
                              is_corporate_user:
                                (this.state && this.state.is_corporate_user) ||
                                "No",
                              corporate_unique_id:
                                (this.state &&
                                  this.state.corporate_unique_id) ||
                                "",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              cnic: Yup.string()
                                .required("Please enter your CNIC")
                                .matches(
                                  /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                  "Please enter a valid CNIC e.g. 37106-8234782-3"
                                )
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. +923123456789"
                                ),
                              address: Yup.string()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              city: Yup.string()
                                .required("Please enter your city")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              district: Yup.string()
                                .required("Please enter your district")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              corporate_unique_id: Yup.string().when(
                                "is_corporate_user",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                    .trim()
                                    .required("Please enter corporate user ID"),
                                }
                              ),
                            })}
                            onSubmit={values => {
                              console.log(values);
                              this.props.addPatientInformation(
                                values,
                                this.props.match.params.id
                              );
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                {/* Name field */}
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Name
                                  </Label>
                                  <Field
                                    id="name"
                                    name="name"
                                    placeholder="Zernish Khan"
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

                                {/* CNIC field */}
                                <div className="mb-3">
                                  <Label for="cnic" className="form-label">
                                    CNIC
                                  </Label>
                                  <Field
                                    id="cnic"
                                    name="cnic"
                                    placeholder="12345-6789012-1"
                                    type="text"
                                    onChange={e =>
                                      this.setState({ cnic: e.target.value })
                                    }
                                    value={this.state.cnic}
                                    className={
                                      "form-control" +
                                      (errors.cnic && touched.cnic
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="cnic"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Email field */}
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    name="email"
                                    placeholder="abc@gmail.com"
                                    type="text"
                                    onChange={e =>
                                      this.setState({ email: e.target.value })
                                    }
                                    value={this.state.email}
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
                                </div>

                                {/* Phone field */}
                                <div className="mb-3">
                                  <Label for="phone" className="form-label">
                                    Phone
                                  </Label>
                                  <Field
                                    id="phone"
                                    name="phone"
                                    placeholder="+923123456789"
                                    type="text"
                                    onChange={e =>
                                      this.setState({ phone: e.target.value })
                                    }
                                    value={this.state.phone}
                                    className={
                                      "form-control" +
                                      (errors.phone && touched.phone
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Address field */}
                                <div className="mb-3">
                                  <Label for="address" className="form-label">
                                    Complete Address
                                  </Label>
                                  <Field
                                    id="address"
                                    name="address"
                                    placeholder="339-A Main Peshawar Road, Rawalpindi"
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

                                {/* City field */}
                                <div className="mb-3">
                                  <Label for="city" className="form-label">
                                    City
                                  </Label>
                                  <Field
                                    id="city"
                                    name="city"
                                    placeholder="Rawalpindi"
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

                                {/* District field */}
                                <div className="mb-3">
                                  <Label for="district" className="form-label">
                                    District
                                  </Label>
                                  <Field
                                    id="district"
                                    name="district"
                                    placeholder="Rawalpindi"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        district: e.target.value,
                                      })
                                    }
                                    value={this.state.district}
                                    className={
                                      "form-control" +
                                      (errors.district && touched.district
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="district"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Is Corporate User field */}
                                <div className="mb-3">
                                  <Label
                                    for="is_corporate_user"
                                    className="form-label"
                                  >
                                    Are you a corporate user?
                                  </Label>
                                  <Field
                                    name="is_corporate_user"
                                    component="select"
                                    defaultValue="No"
                                    onChange={e =>
                                      this.setState({
                                        is_corporate_user: e.target.value,
                                      })
                                    }
                                    value={this.state.is_corporate_user}
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>

                                {/* Corporate Unique ID field */}
                                {this.state.is_corporate_user === "Yes" && (
                                  <div className="mb-3">
                                    <Label
                                      for="corporate_unique_id"
                                      className="form-label"
                                    >
                                      Corporate Unique ID
                                    </Label>
                                    <Field
                                      id="corporate_unique_id"
                                      name="corporate_unique_id"
                                      placeholder="2594153c-a86d-4a70-8136-ee93e01c88cc"
                                      type="text"
                                      className={
                                        "form-control" +
                                        (errors.corporate_unique_id &&
                                        touched.corporate_unique_id
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="corporate_unique_id"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                )}

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    {" "}
                                    Complete Registration{" "}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

PatientInformation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  addPatientInformation: PropTypes.func,
  addPatientInformationFailed: PropTypes.any,
  addPatientError: PropTypes.any,
  patient: PropTypes.any,
};

const mapStateToProps = state => {
  const { patient, addPatientError, loading } = state.PatientInformation;
  return { patient, addPatientError, loading };
};

export default connect(mapStateToProps, {
  addPatientInformation,
  addPatientInformationFailed,
})(PatientInformation);
