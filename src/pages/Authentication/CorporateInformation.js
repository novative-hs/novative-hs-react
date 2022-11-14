import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label, Input } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";

// action
import {
  addCorporateInformation,
  addCorporateInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class CorporateInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      owner_name: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city: "",
      district: "",
    };
  }

  componentDidMount() {
    this.props.addCorporateInformationFailed("");
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
            <title>Corporate Information | Lab Hazir</title>
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
                            Corporate information account
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.corporate && this.props.corporate ? (
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

                          {this.props.addCorporateError &&
                          this.props.addCorporateError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addCorporateError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              logo: (this.state && this.state.logo) || "",
                              owner_name:
                                (this.state && this.state.owner_name) || "",
                              email: (this.state && this.state.email) || "",
                              phone: (this.state && this.state.phone) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              address: (this.state && this.state.address) || "",
                              city: (this.state && this.state.city) || "",
                              district:
                                (this.state && this.state.district) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .trim()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              logo: Yup.mixed().required(
                                "Please upload your corporate logo"
                              ),
                              owner_name: Yup.string()
                                .trim()
                                .required("Please enter corporate owner name")
                                .min(3, "Please enter at least 3 characters")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
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
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                              landline: Yup.string()
                                .required("Please enter your landline no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                                  "Please enter a valid Pakistani landline number"
                                ),
                              address: Yup.string()
                                .trim()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              city: Yup.string()
                                .trim()
                                .required("Please enter your city")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              district: Yup.string()
                                .trim()
                                .required("Please enter your district")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                            })}
                            onSubmit={values => {
                              this.props.addCorporateInformation(
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

                                {/* Logo field */}
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Logo
                                  </Label>
                                  <Input
                                    id="formFile"
                                    name="logo"
                                    type="file"
                                    multiple={false}
                                    accept=".jpg,.jpeg,.png"
                                    onChange={e =>
                                      this.setState({ logo: e.target.files[0] })
                                    }
                                    className={
                                      "form-control" +
                                      (errors.logo && touched.logo
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />

                                  <ErrorMessage
                                    name="logo"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Owner name field */}
                                <div className="mb-3">
                                  <Label
                                    for="owner_name"
                                    className="form-label"
                                  >
                                    Owner name
                                  </Label>
                                  <Field
                                    id="owner_name"
                                    name="owner_name"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        owner_name: e.target.value,
                                      })
                                    }
                                    value={this.state.owner_name}
                                    className={
                                      "form-control" +
                                      (errors.owner_name && touched.owner_name
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="owner_name"
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

                                {/* City field */}
                                <div className="mb-3">
                                  <Label for="city" className="form-label">
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

                                {/* District field */}
                                <div className="mb-3">
                                  <Label for="district" className="form-label">
                                    District
                                  </Label>
                                  <Field
                                    id="district"
                                    name="district"
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

CorporateInformation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  addCorporateInformation: PropTypes.func,
  addCorporateInformationFailed: PropTypes.any,
  addCorporateError: PropTypes.any,
  corporate: PropTypes.any,
};

const mapStateToProps = state => {
  const { corporate, addCorporateError, loading } = state.CorporateInformation;
  return { corporate, addCorporateError, loading };
};

export default connect(mapStateToProps, {
  addCorporateInformation,
  addCorporateInformationFailed,
})(CorporateInformation);
