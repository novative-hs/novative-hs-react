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
  addLabInformation,
  addLabInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class LabInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      owner_name: "",
      registration_no: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city: "",
      district: "",
      complaint_handling_email: "",
      complaint_handling_phone: "",
    };
  }

  componentDidMount() {
    this.props.addLabInformationFailed("");
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
            <title>Lab Information | Ilaaj4u</title>
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
                            Lab account information
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Ilaaj4u
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.lab && this.props.lab ? (
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

                          {this.props.addLabError && this.props.addLabError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addLabError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              logo: (this.state && this.state.logo) || "",
                              owner_name:
                                (this.state && this.state.owner_name) || "",
                              registration_no:
                                (this.state && this.state.registration_no) ||
                                "",
                              email: (this.state && this.state.email) || "",
                              phone: (this.state && this.state.phone) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              address: (this.state && this.state.address) || "",
                              city: (this.state && this.state.city) || "",
                              district:
                                (this.state && this.state.district) || "",
                              complaint_handling_email:
                                (this.state &&
                                  this.state.complaint_handling_email) ||
                                "",
                              complaint_handling_phone:
                                (this.state &&
                                  this.state.complaint_handling_phone) ||
                                "",
                              accept_credit_card_for_payment:
                                (this.state &&
                                  this.state.accept_credit_card_for_payment) ||
                                "No",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              logo: Yup.mixed().required(
                                "Please upload your lab logo"
                              ),
                              owner_name: Yup.string()
                                .required("Please enter lab owner name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              registration_no: Yup.string()
                                .required("Please enter lab owner name")
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
                              landline: Yup.string()
                                .required("Please enter your landline no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani landline number"
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
                              complaint_handling_email: Yup.string()
                                .required(
                                  "Please enter your complaint handling email"
                                )
                                .email("Please enter valid email")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              complaint_handling_phone: Yup.string()
                                .required(
                                  "Please enter your complaint handling phone no."
                                )
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. +923123456789"
                                ),
                            })}
                            onSubmit={values => {
                              console.log(values);
                              // console.log(values.logo.split("\\").slice(-1)[0]);
                              this.props.addLabInformation(
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
                                    placeholder="LaboMart"
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
                                    placeholder="Choose image"
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
                                    placeholder="John Doe"
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

                                {/* Registration No field */}
                                <div className="mb-3">
                                  <Label
                                    for="registration_no"
                                    className="form-label"
                                  >
                                    Registration Number
                                  </Label>
                                  <Field
                                    id="registration_no"
                                    name="registration_no"
                                    placeholder="74398H3847"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        registration_no: e.target.value,
                                      })
                                    }
                                    value={this.state.registration_no}
                                    className={
                                      "form-control" +
                                      (errors.registration_no &&
                                      touched.registration_no
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="registration_no"
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
                                    placeholder="labomart@xyz.com"
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

                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label for="landline" className="form-label">
                                    Landline
                                  </Label>
                                  <Field
                                    id="landline"
                                    name="landline"
                                    placeholder="+925712345678"
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

                                {/* Complaint Handling Email field */}
                                <div className="mb-3">
                                  <Label
                                    for="complaint_handling_email"
                                    className="form-label"
                                  >
                                    Complaint handling email
                                  </Label>
                                  <Field
                                    name="complaint_handling_email"
                                    placeholder="xyz@complaint.com"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        complaint_handling_email:
                                          e.target.value,
                                      })
                                    }
                                    value={this.state.complaint_handling_email}
                                    className={
                                      "form-control" +
                                      (errors.complaint_handling_email &&
                                      touched.complaint_handling_email
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="complaint_handling_email"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Complaint Handling Phone field */}
                                <div className="mb-3">
                                  <Label
                                    for="complaint_handling_phone"
                                    className="form-label"
                                  >
                                    Complaint handling phone
                                  </Label>
                                  <Field
                                    id="complaint_handling_phone"
                                    name="complaint_handling_phone"
                                    placeholder="+925712345678"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        complaint_handling_phone:
                                          e.target.value,
                                      })
                                    }
                                    value={this.state.complaint_handling_phone}
                                    className={
                                      "form-control" +
                                      (errors.complaint_handling_phone &&
                                      touched.complaint_handling_phone
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="complaint_handling_phone"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Accept Credit Card for Payment field */}
                                <div className="mb-3">
                                  <Label
                                    for="accept_credit_card_for_payment"
                                    className="form-label"
                                  >
                                    Do you accept credit card for payment?
                                  </Label>
                                  <Field
                                    name="accept_credit_card_for_payment"
                                    component="select"
                                    defaultValue="No"
                                    onChange={e =>
                                      this.setState({
                                        accept_credit_card_for_payment:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.accept_credit_card_for_payment
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
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

LabInformation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  addLabInformation: PropTypes.func,
  addLabInformationFailed: PropTypes.any,
  addLabError: PropTypes.any,
  lab: PropTypes.any,
};

const mapStateToProps = state => {
  const { lab, addLabError, loading } = state.LabInformation;
  return { lab, addLabError, loading };
};

export default connect(mapStateToProps, {
  addLabInformation,
  addLabInformationFailed,
})(LabInformation);
