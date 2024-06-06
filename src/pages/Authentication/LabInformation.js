import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Alert, Col, Container, Row, Label, Input } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";
import bgimg from "../../../src/assets/images/b.jpg";

// action
import {
  addLabInformation,
  addLabInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

let mainLabOptionGroup = [
  {
    options: [],
  },
];
let territoriesOptionGroup = [
  {
    options: [],
  },
];

// To give error border effect on single value select
const errorStyle = {
  control: base => ({
    ...base,
    borderColor: "#f46a6a",
  }),
};

// To remove thick blue border effect
const style = {
  control: (base, state) => ({
    ...base,
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 1,
    "&:hover": {
      border: state.isFocused ? 0 : 1,
    },
  }),
};

class LabInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      landline: "",
      fax: "",
      organization: "",
      postalcode: "",
      country: "",
      city: "",
      address: "",
      department: "",
      email: "",
      is_registering_for_first_time: "No",
      registered_by: "Lab",
      marketer_name: "",
      marketer_cnic: "",
      marketer_email: "",
      marketer_phone: "",
      marketer_city: "",
      Select_schemes: "",
    };
  }

  componentDidMount() {
    this.props.addLabInformationFailed("");

    // Wait for sometime so that response is loaded from database
    setTimeout(() => {
      if (this.props.labs.length) {
        const labs = this.props.labs;
        // const mainLabs = this.props.labs.filter(lab => lab.type === "main lab");

        for (let i = 0; i < labs.length; i++) {
          mainLabOptionGroup[0]["options"].push({
            label: labs[i].name,
            value: labs[i].account_id,
          });
        }
      }
    }, 2000);
  }

  render() {
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Lab Information | Lab Hazir</title>
          </MetaTags>
          <div
            className="background-container py-5"
            style={{
              backgroundImage: `url(${bgimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
            }}
          >
            <Container fluid className="p-0">
              <Row className="g-0 h-100">
                {/* <CarouselPage /> */}
                <div className="d-flex align-items-center justify-content-center">
                  <Col className="bg-light" sm={10} md={10} xl={6}>
                    <div className="auth-full-page-content p-md-5 p-4">
                      <div className="w-100">
                        <div className="d-flex flex-column h-100">
                          <div className="my-auto">
                            <div>
                              <h5 className="text-primary">
                                Account information - Step 2 of 2
                              </h5>
                            </div>
                            <div className="mt-4">
                              {this.props.lab && this.props.lab ? (
                                <Alert
                                  color="success"
                                  style={{ marginTop: "13px" }}
                                >
                                  The verification link is sent to your email,
                                  please verify your account first in order to
                                  login.{" "}
                                </Alert>
                              ) : null}
                              {this.props.lab && this.props.lab
                                ? // Redirecting back to the login page
                                  setTimeout(() => {
                                    if (this.props.lab) {
                                      this.props.history.push("/login");
                                    }
                                  }, 2000)
                                : null}
                              {this.props.addLabError &&
                              this.props.addLabError ? (
                                <Alert
                                  color="danger"
                                  style={{ marginTop: "13px" }}
                                >
                                  {this.props.addLabError}
                                </Alert>
                              ) : null}
                              <div className="mt-4">
                                <Formik
                                  enableReinitialize={true}
                                  initialValues={{
                                    name: (this.state && this.state.name) || "",
                                    email:
                                      (this.state && this.state.email) || "",
                                    landline:
                                      (this.state && this.state.landline) || "",
                                    postalcode:
                                      (this.state && this.state.postalcode) ||
                                      "",

                                    fax: (this.state && this.state.fax) || "",
                                    organization:
                                      (this.state && this.state.organization) ||
                                      "",
                                    country:
                                      (this.state && this.state.country) || "",
                                    city: (this.state && this.state.city) || "",
                                    address:
                                      (this.state && this.state.address) || "",
                                    Select_schemes:
                                      (this.state &&
                                        this.state.Select_schemes) ||
                                      "",
                                    department:
                                      (this.state && this.state.department) ||
                                      "",
                                    registered_by:
                                      (this.state &&
                                        this.state.registered_by) ||
                                      "Lab",
                                    lab_staff_name:
                                      (this.state &&
                                        this.state.lab_staff_name) ||
                                      "",
                                    lab_staff_designation:
                                      (this.state &&
                                        this.state.lab_staff_designation) ||
                                      "",
                                    marketer_name:
                                      (this.state &&
                                        this.state.marketer_name) ||
                                      "",
                                    marketer_cnic:
                                      (this.state &&
                                        this.state.marketer_cnic) ||
                                      "",
                                    marketer_email:
                                      (this.state &&
                                        this.state.marketer_email) ||
                                      "",
                                    marketer_phone:
                                      (this.state &&
                                        this.state.marketer_phone) ||
                                      "",
                                    marketer_city:
                                      (this.state &&
                                        this.state.marketer_city) ||
                                      "",
                                    is_registering_for_first_time:
                                      (this.state &&
                                        this.state
                                          .is_registering_for_first_time) ||
                                      "",
                                  }}
                                  validationSchema={Yup.object().shape({
                                    name: Yup.string()
                                      .trim()
                                      .required("Please enter your name")
                                      .min(
                                        3,
                                        "Please enter at least 3 characters"
                                      )
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    city: Yup.string()
                                      .trim()
                                      .required("Please enter your city")

                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    country: Yup.string()
                                      .trim()
                                      .required("Please enter your country")

                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),

                                    landline: Yup.string()
                                      .required(
                                        "Please enter your landline no."
                                      )
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    postalcode: Yup.string()
                                      .required(
                                        "Please enter your postalcode no."
                                      )
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    fax: Yup.string()
                                      .required("Please enter your fax no.")
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    organization: Yup.string()
                                      .required(
                                        "Please enter your organization"
                                      )
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    address: Yup.string()
                                      .trim()
                                      .required(
                                        "Please enter your full address"
                                      )

                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                      // Select_schemes: Yup.string()
                                      // .trim()
                                      // .required(
                                      //   "Please select the scheme"
                                      // ),
                                    registered_by: Yup.string()
                                      .trim()
                                      .required("Please enter Name")
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    department: Yup.string()
                                      .trim()
                                      .required(
                                        "Please enter your Department Name"
                                      )
                                      .max(
                                        255,
                                        "Please enter maximum 255 characters"
                                      ),
                                    lab_staff_name: Yup.string().when(
                                      "registered_by",
                                      {
                                        is: val => val == "Lab",
                                        then: Yup.string()
                                          .trim()
                                          .required("Please enter your name")
                                          .min(
                                            3,
                                            "Please enter at least 3 characters"
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          ),
                                      }
                                    ),
                                    lab_staff_designation: Yup.string().when(
                                      "registered_by",
                                      {
                                        is: val => val == "Lab",
                                        then: Yup.string()
                                          .trim()
                                          .required(
                                            "Please enter your designation"
                                          )
                                          .min(
                                            3,
                                            "Please enter at least 3 characters"
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          )
                                          .matches(
                                            /^[a-zA-Z][a-zA-Z ]+$/,
                                            "Please enter only alphabets  spaces"
                                          ),
                                      }
                                    ),
                                    marketer_name: Yup.string().when(
                                      "is_registering_for_first_time",
                                      {
                                        is: val => val == "Yes",
                                        then: Yup.string()
                                          .trim()
                                          .required(
                                            "Please enter marketer name"
                                          )
                                          .min(
                                            3,
                                            "Please enter at least 3 characters"
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          ),
                                      }
                                    ),
                                    marketer_cnic: Yup.string().when(
                                      "is_registering_for_first_time",
                                      {
                                        is: val => val == "Yes",
                                        then: Yup.string()
                                          .required(
                                            "Please enter marketer CNIC"
                                          )
                                          .matches(
                                            /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                            "Please enter a valid CNIC e.g. 37106-8234782-3"
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          ),
                                      }
                                    ),

                                    marketer_email: Yup.string().when(
                                      "registered_by",
                                      {
                                        is: val => val == "Marketer",
                                        then: Yup.string()
                                          .required(
                                            "Please enter marketer email"
                                          )
                                          .email("Please enter valid email")
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          ),
                                      }
                                    ),
                                    marketer_phone: Yup.string().when(
                                      "is_registering_for_first_time",
                                      {
                                        is: val => val == "Yes",
                                        then: Yup.string()
                                          .required(
                                            "Please enter marketer mobile no."
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          )
                                          .matches(
                                            /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                            "Please enter a valid Pakistani phone number e.g. 03123456789"
                                          ),
                                      }
                                    ),
                                    marketer_city: Yup.string().when(
                                      "is_registering_for_first_time",
                                      {
                                        is: val => val == "Yes",
                                        then: Yup.string()
                                          .trim()
                                          .required(
                                            "Please select marketer city"
                                          )
                                          .max(
                                            255,
                                            "Please enter maximum 255 characters"
                                          )
                                          .matches(
                                            /^[a-zA-Z][a-zA-Z ]+$/,
                                            "Please enter only alphabets and spaces"
                                          ),
                                      }
                                    ),
                                    email: Yup.string()
                                      .required("Please enter your email")
                                      .email("Please enter valid email"),
                                  })}
                                  onSubmit={values => {
                                    this.props.addLabInformation(
                                      values,
                                      this.props.match.params.id
                                    );
                                    window.scrollTo({
                                      top: 0,
                                      left: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  {({ errors, status, touched, values }) => (
                                    <Form className="form-horizontal">
                                      {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                                      {/* Name field */}
                                      <Row>
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="name"
                                              className="form-label"
                                            >
                                              Name
                                            </Label>
                                            <Field
                                              id="name"
                                              name="name"
                                              type="text"
                                              placeholder="Please enter your name"
                                              onChange={e =>
                                                this.setState({
                                                  name: e.target.value,
                                                })
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
                                            <Label
                                              for="email"
                                              className="form-label"
                                            >
                                              Email
                                            </Label>
                                            <Field
                                              name="email"
                                              placeholder="Enter email"
                                              onChange={e =>
                                                this.setState({
                                                  email: e.target.value,
                                                })
                                              }
                                              type="text"
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
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col sm={6} md={6} xl={6}>
                                          {/* Landline field */}
                                          <div className="mb-3">
                                            <Label
                                              for="landline"
                                              className="form-label"
                                            >
                                              Phone No
                                            </Label>
                                            <Field
                                              id="landline"
                                              name="landline"
                                              type="text"
                                              placeholder="Please enter your landline no."
                                              onChange={e =>
                                                this.setState({
                                                  landline: e.target.value,
                                                })
                                              }
                                              value={this.state.landline}
                                              className={
                                                "form-control" +
                                                (errors.landline &&
                                                touched.landline
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
                                        {/* postalcode */}
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="postalcode"
                                              className="form-label"
                                            >
                                              Postal Code
                                            </Label>
                                            <Field
                                              id="postalcode"
                                              name="postalcode"
                                              type="text"
                                              placeholder="Please enter your postalcode no."
                                              onChange={e =>
                                                this.setState({
                                                  postalcode: e.target.value,
                                                })
                                              }
                                              value={this.state.postalcode}
                                              className={
                                                "form-control" +
                                                (errors.postalcode &&
                                                touched.postalcode
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
                                      </Row>
                                      {/* Fax */}
                                      <Row>
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="fax"
                                              className="form-label"
                                            >
                                              Fax No
                                            </Label>
                                            <Field
                                              id="fax"
                                              name="fax"
                                              type="text"
                                              placeholder="Please enter your fax no."
                                              onChange={e =>
                                                this.setState({
                                                  fax: e.target.value,
                                                })
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
                                              name="fax"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>
                                        </Col>
                                        {/* city */}
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="city"
                                              className="form-label"
                                            >
                                              City
                                            </Label>
                                            <Field
                                              id="city"
                                              name="city"
                                              type="text"
                                              placeholder="Please enter your city/town"
                                              onChange={e =>
                                                this.setState({
                                                  city: e.target.value,
                                                })
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
                                          {/* country */}
                                          <div className="mb-3">
                                            <Label
                                              for="country"
                                              className="form-label"
                                            >
                                              Country
                                            </Label>
                                            <Field
                                              id="country"
                                              name="country"
                                              type="text"
                                              placeholder="Please enter your country"
                                              onChange={e =>
                                                this.setState({
                                                  country: e.target.value,
                                                })
                                              }
                                              value={this.state.country}
                                              className={
                                                "form-control" +
                                                (errors.country &&
                                                touched.country
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="country"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>
                                        </Col>
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="organization"
                                              className="form-label"
                                            >
                                              Organization
                                            </Label>
                                            <Field
                                              id="organization"
                                              name="organization"
                                              type="text"
                                              placeholder="Please enter your organization"
                                              onChange={e =>
                                                this.setState({
                                                  organization: e.target.value,
                                                })
                                              }
                                              value={this.state.organization}
                                              className={
                                                "form-control" +
                                                (errors.organization &&
                                                touched.organization
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="organization"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                      {/* department field */}
                                      <Row>
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="department"
                                              className="form-label"
                                            >
                                              Department
                                            </Label>
                                            <Field
                                              id="department"
                                              name="department"
                                              type="text"
                                              placeholder="Please enter your complete department"
                                              onChange={e =>
                                                this.setState({
                                                  department: e.target.value,
                                                })
                                              }
                                              value={this.state.department}
                                              className={
                                                "form-control" +
                                                (errors.department &&
                                                touched.department
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="department"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                            {/* <span className="text-primary font-size-12">
                                    <strong>
                                      Note: Please add the complete valid
                                      address searchable on google maps.
                                    </strong>
                                  </span> */}
                                          </div>
                                        </Col>
                                        {/* Registered by field */}
                                        <Col sm={6} md={6} xl={6}>
                                          <div className="mb-3">
                                            <Label
                                              for="registered_by"
                                              className="form-label"
                                            >
                                              Who is registering lab?
                                            </Label>
                                            <Field
                                              name="registered_by"
                                              component="select"
                                              onChange={e =>
                                                this.setState({
                                                  registered_by: e.target.value,
                                                })
                                              }
                                              defaultValue={
                                                this.state.registered_by
                                              }
                                              className="form-select"
                                            >
                                              <option value="Lab">Lab</option>
                                              <option value="Marketer">
                                                Marketer
                                              </option>
                                            </Field>
                                          </div>
                                        </Col>
                                      </Row>
                                      {this.state.registered_by === "Lab" && (
                                        <div>
                                          <Row>
                                            <Col sm={6} md={6} xl={6}>
                                              {/* Lab Staff Name field */}
                                              <div className="mb-3">
                                                <Label
                                                  for="lab_staff_name"
                                                  className="form-label"
                                                >
                                                  Registered by (Name)
                                                </Label>
                                                <Field
                                                  id="lab_staff_name"
                                                  name="lab_staff_name"
                                                  type="text"
                                                  placeholder="Please enter the name of person registering lab"
                                                  onChange={e =>
                                                    this.setState({
                                                      lab_staff_name:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    this.state.lab_staff_name
                                                  }
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
                                            {/* Lab Staff Designation field */}
                                            <Col sm={6} md={6} xl={6}>
                                              <div className="mb-3">
                                                <Label
                                                  for="lab_staff_designation"
                                                  className="form-label"
                                                >
                                                  Lab Staff Designation
                                                </Label>
                                                <Field
                                                  id="lab_staff_designation"
                                                  name="lab_staff_designation"
                                                  type="text"
                                                  placeholder="Please enter the designation of person registering lab"
                                                  onChange={e =>
                                                    this.setState({
                                                      lab_staff_designation:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    this.state
                                                      .lab_staff_designation
                                                  }
                                                  className={
                                                    "form-control" +
                                                    (errors.lab_staff_designation &&
                                                    touched.lab_staff_designation
                                                      ? " is-invalid"
                                                      : "")
                                                  }
                                                />
                                                <ErrorMessage
                                                  name="lab_staff_designation"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      )}

                                      {/* Marketer's fields */}
                                      {this.state.registered_by ===
                                        "Marketer" && (
                                        <div>
                                          <Row>
                                            <Col sm={6} md={6} xl={6}>
                                              {/* Is Registering First Time field */}
                                              <div className="mb-3">
                                                <Label
                                                  for="is_registering_for_first_time"
                                                  className="form-label"
                                                >
                                                  Are you registering lab for
                                                  the first time?
                                                </Label>
                                                <Field
                                                  name="is_registering_for_first_time"
                                                  component="select"
                                                  onChange={e =>
                                                    this.setState({
                                                      is_registering_for_first_time:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    this.state
                                                      .is_registering_for_first_time
                                                  }
                                                  className="form-select"
                                                >
                                                  <option value="Yes">
                                                    Yes
                                                  </option>
                                                  <option value="No">No</option>
                                                </Field>
                                              </div>
                                            </Col>
                                            {/* Marketer Email field */}
                                            <Col sm={6} md={6} xl={6}>
                                              <div className="mb-3">
                                                <Label
                                                  for="marketer_email"
                                                  className="form-label"
                                                >
                                                  Marketer Email
                                                </Label>
                                                <Field
                                                  name="marketer_email"
                                                  type="text"
                                                  placeholder="Please enter marketer email"
                                                  onChange={e =>
                                                    this.setState({
                                                      marketer_email:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    this.state.marketer_email
                                                  }
                                                  className={
                                                    "form-control" +
                                                    (errors.marketer_email &&
                                                    touched.marketer_email
                                                      ? " is-invalid"
                                                      : "")
                                                  }
                                                />
                                                <ErrorMessage
                                                  name="marketer_email"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                              </div>
                                            </Col>
                                          </Row>
                                          {this.state
                                            .is_registering_for_first_time ===
                                            "Yes" && (
                                            <div>
                                              <Row>
                                                <Col sm={6} md={6} xl={6}>
                                                  {/* Marketer Name field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="marketer_name"
                                                      className="form-label"
                                                    >
                                                      Marketer Name
                                                    </Label>
                                                    <Field
                                                      id="marketer_name"
                                                      name="marketer_name"
                                                      type="text"
                                                      placeholder="Please enter marketer name"
                                                      onChange={e =>
                                                        this.setState({
                                                          marketer_name:
                                                            e.target.value,
                                                        })
                                                      }
                                                      value={
                                                        this.state.marketer_name
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.marketer_name &&
                                                        touched.marketer_name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="marketer_name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                                {/* Marketer CNIC field */}
                                                <Col sm={6} md={6} xl={6}>
                                                  <div className="mb-3">
                                                    <Label
                                                      for="marketer_cnic"
                                                      className="form-label"
                                                    >
                                                      Marketer CNIC
                                                    </Label>
                                                    <Field
                                                      id="marketer_cnic"
                                                      name="marketer_cnic"
                                                      type="text"
                                                      placeholder="Please enter marketer cnic"
                                                      onChange={e =>
                                                        this.setState({
                                                          marketer_cnic:
                                                            e.target.value,
                                                        })
                                                      }
                                                      value={
                                                        this.state.marketer_cnic
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.marketer_cnic &&
                                                        touched.marketer_cnic
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="marketer_cnic"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col sm={6} md={6} xl={6}>
                                                  {/* Marketer Phone field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="marketer_phone"
                                                      className="form-label"
                                                    >
                                                      Marketer Mobile No.
                                                    </Label>
                                                    <Field
                                                      id="marketer_phone"
                                                      name="marketer_phone"
                                                      type="text"
                                                      placeholder="Please enter marketer mobile no."
                                                      onChange={e =>
                                                        this.setState({
                                                          marketer_phone:
                                                            e.target.value,
                                                        })
                                                      }
                                                      value={
                                                        this.state
                                                          .marketer_phone
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.marketer_phone &&
                                                        touched.marketer_phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="marketer_phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                                <Col sm={6} md={6} xl={6}>
                                                  {/* Marketer City field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="marketer_city"
                                                      className="form-label"
                                                    >
                                                      Marketer City
                                                    </Label>
                                                    <Select
                                                      name="marketer_city"
                                                      component="Select"
                                                      onChange={selectedGroup =>
                                                        this.setState({
                                                          marketer_city:
                                                            selectedGroup.value,
                                                        })
                                                      }
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.marketer_city &&
                                                        touched.marketer_city
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.marketer_city &&
                                                            touched.marketer_city
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={CITIES}
                                                      placeholder="Select City..."
                                                    />

                                                    <ErrorMessage
                                                      name="marketer_city"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <div className="mb-3">
                                        <Label
                                          for="Select_schemes"
                                          className="form-label"
                                        >
                                          Select scheme
                                        </Label>
                                        <Field
                                          name="Select_schemes"
                                          component="select"
                                          onChange={e =>
                                            this.setState({
                                              scheme: e.target.value,
                                            })
                                          }
                                          defaultValue={this.state.scheme}
                                          className="form-select"
                                        >
                                          <option value="abc">Abc</option>
                                          <option value="xyz">Xyz</option>
                                        </Field>
                                      </div>

                                      {/* Address field */}
                                      <div className="mb-3">
                                        <Label
                                          for="address"
                                          className="form-label"
                                        >
                                          Address
                                        </Label>
                                        <Field
                                          id="address"
                                          name="address"
                                          type="text"
                                          placeholder="Please enter your complete address"
                                          onChange={e =>
                                            this.setState({
                                              address: e.target.value,
                                            })
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
                                        {/* <span className="text-primary font-size-12">
                                    <strong>
                                      Note: Please add the complete valid
                                      address searchable on google maps.
                                    </strong>
                                  </span> */}
                                      </div>

                                      <div className="mt-3 d-grid">
                                        <button
                                          className="btn btn-primary btn-block"
                                          type="submit"
                                          style={{
                                            backgroundColor: "#1D1DE4",
                                          }}
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
                    </div>
                  </Col>
                </div>
              </Row>
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

LabInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,

  labs: PropTypes.array,

  addLabInformation: PropTypes.func,
  addLabInformationFailed: PropTypes.any,
  addLabError: PropTypes.any,
  lab: PropTypes.any,
};

const mapStateToProps = state => ({
  addLabError: state.LabInformation.addLabError,
  lab: state.LabInformation.lab,
  labs: state.LabInformation.labs,
});

export default connect(mapStateToProps, {
  addLabInformation,
  addLabInformationFailed,
})(LabInformation);
