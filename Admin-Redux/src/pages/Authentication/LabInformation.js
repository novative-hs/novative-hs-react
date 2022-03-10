import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Alert, Col, Container, Row, Label, Input } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";

// action
import {
  getLabs,
  getLabsSuccess,
  addLabInformation,
  addLabInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

let optionGroup = [
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
      type: "",
      main_lab_account_id: "",
      financial_settlement: "",
      logo: "",
      owner_name: "",
      registration_no: "",
      national_taxation_no: "",
      is_iso_certified: "No",
      iso_certificate: "",
      lab_experience: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city: "",
      district: "",
      complaint_handling_email: "",
      complaint_handling_phone: "",
      registered_by: "Lab",
      is_registering_for_first_time: "No",
      marketer_name: "",
      marketer_cnic: "",
      marketer_email: "",
      marketer_phone: "",
      marketer_city: "",
      iso_certificate_error: "",
    };
  }

  componentDidMount() {
    this.props.getLabs(); // Calling to get labs list from database
    this.props.addLabInformationFailed("");

    // Wait for sometime so that response is loaded from database
    setTimeout(() => {
      if (this.props.labs.length) {
        const labs = this.props.labs;
        for (let i = 0; i < labs.length; i++) {
          optionGroup[0]["options"].push({
            label: labs[i].name,
            value: labs[i].account_id,
          });
        }
      }
    }, 3000);
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ main_lab_account_id: selectedGroup.value });
  };

  handleISOCertifiedChange = e => {
    this.setState({ is_iso_certified: e.target.value });

    if (e.target.value  === "Yes") {
      if (!this.state.iso_certificate) {
        this.setState({ iso_certificate_error: "Please upload your ISO 15189 certificate" });
      } else {
        this.setState({ iso_certificate_error: "" });
      }
    } else {
      this.setState({ iso_certificate: "" });
      this.setState({ iso_certificate_error: "" });
    }
  };

  handleISOCertificateChange = e => {;
    this.setState({ iso_certificate: e.target.files[0] });
    this.setState({ iso_certificate_error: "" });
  };



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
                              You have registered successfully and your account
                              is pending for approval, which will be done by our
                              staff after inspection of your lab. Thank you for
                              your interest.
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
                              type:
                                (this.state && this.state.type) || "Main Lab",
                              main_lab_account_id:
                                (this.state &&
                                  this.state.main_lab_account_id) ||
                                "",
                              financial_settlement:
                                (this.state &&
                                  this.state.financial_settlement) ||
                                "Self",
                              logo: (this.state && this.state.logo) || "",
                              owner_name:
                                (this.state && this.state.owner_name) || "",
                              registration_no:
                                (this.state && this.state.registration_no) ||
                                "",
                              national_taxation_no:
                                (this.state &&
                                  this.state.national_taxation_no) ||
                                "",
                              is_iso_certified:
                                (this.state &&
                                  this.state.is_iso_certified) ||
                                "No",
                              iso_certificate: (this.state && this.state.iso_certificate) || "",
                              lab_experience: (this.state && this.state.lab_experience) || "",
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
                              is_digital_payment_accepted:
                                (this.state &&
                                  this.state.is_digital_payment_accepted) ||
                                "No",
                              registered_by:
                                (this.state &&
                                  this.state.registered_by) ||
                                "Lab",
                              is_registering_for_first_time:
                                (this.state &&
                                  this.state.is_registering_for_first_time) ||
                                "No",
                              marketer_name: (this.state && this.state.marketer_name) || "",
                              marketer_cnic: (this.state && this.state.marketer_cnic) || "",
                              marketer_email: (this.state && this.state.marketer_email) || "",
                              marketer_phone: (this.state && this.state.marketer_phone) || "",
                              marketer_city: (this.state && this.state.marketer_city) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string().trim()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                )
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              main_lab_account_id: Yup.string().when("type", {
                                is: val => val === "Collection Point",
                                then: Yup.string().required(
                                  "Please enter your main lab"
                                ),
                              }),
                              logo: Yup.mixed().required(
                                "Please upload your lab logo"
                              ),
                              owner_name: Yup.string().trim()
                                .required("Please enter lab owner name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                )
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              registration_no: Yup.string().trim().max(
                                255,
                                "Please enter maximum 255 characters"
                              ),
                              national_taxation_no: Yup.string().trim()
                                .required("Please enter NTN # of your lab")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              lab_experience: Yup.number("Please enter number only")
                                .required("Please enter your lab experience")
                                .positive()
                                .integer()
                                .min(0, "Please enter a number greater than or equal to 0")
                                .max(150, "Please enter a number less than or equal to 150"),
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
                              address: Yup.string().trim()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              city: Yup.string().trim()
                                .required("Please enter your city")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ).matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              district: Yup.string().trim()
                                .required("Please enter your district")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ).matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
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
                              marketer_name: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string().trim()
                                  .required("Please enter marketer name")
                                  .min(3, "Please enter at least 3 characters")
                                  .max(
                                    255,
                                    "Please enter maximum 255 characters"
                                  ).matches(
                                    /^[a-zA-Z][a-zA-Z ]+$/,
                                    "Please enter only alphabets and spaces"
                                  ),
                                }
                              ),
                              marketer_cnic: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                  .required("Please enter marketer CNIC")
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
                                  .required("Please enter marketer email")
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
                                  .required("Please enter marketer phone no.")
                                  .max(255, "Please enter maximum 255 characters")
                                  .matches(
                                    /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                    "Please enter a valid Pakistani phone number e.g. +923123456789"
                                  ),
                                }
                              ),
                              marketer_city: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string().trim()
                                  .required("Please enter marketer city")
                                  .max(
                                    255,
                                    "Please enter maximum 255 characters"
                                  ).matches(
                                    /^[a-zA-Z][a-zA-Z ]+$/,
                                    "Please enter only alphabets and spaces"
                                  ),
                                }
                              ),
                            })}
                            onSubmit={values => {
                              if (values.is_iso_certified === "Yes") {
                                console.log("Inside if.....");
                                if (values.iso_certificate) {
                                  this.props.addLabInformation(
                                    values,
                                    this.props.match.params.id
                                  );
                                }
                              } else {
                                  this.props.addLabInformation(
                                    values,
                                    this.props.match.params.id
                                  );
                                }
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
                                    placeholder="Labo Mart"
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

                                {/* Type field */}
                                <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    What is your lab type?
                                  </Label>
                                  <Field
                                    name="type"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        type: e.target.value,
                                      })
                                    }
                                    value={this.state.type}
                                    className="form-select"
                                  >
                                    <option value="Main Lab">Main Lab</option>
                                    <option value="Collection Point">
                                      Collection Point
                                    </option>
                                  </Field>
                                </div>

                                {/* Main lab name field */}
                                {this.state.type === "Collection Point" && (
                                  <div className="mb-3">
                                    <Label
                                      for="main_lab_account_id"
                                      className="form-label"
                                    >
                                      What is your main lab name?
                                    </Label>
                                    <Select
                                      styles={
                                        errors.main_lab_account_id &&
                                        touched.main_lab_account_id
                                          ? errorStyle
                                          : style
                                      }
                                      name="main_lab_account_id"
                                      component="select"
                                      onChange={this.handleSelectGroup}
                                      className="defautSelectParent is-invalid"
                                      options={optionGroup}
                                    />

                                    {touched.main_lab_account_id &&
                                      errors.main_lab_account_id && (
                                        <div
                                          style={{
                                            marginTop: "0.25rem",
                                            fontSize: "80%",
                                            color: "#f46a6a",
                                          }}
                                        >
                                          Please select your main lab
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Financial settlement field */}
                                {this.state.type === "Collection Point" && (
                                  <div className="mb-3">
                                    <Label for="type" className="form-label">
                                      Who is responsible for financial
                                      settlements?
                                    </Label>
                                    <Field
                                      name="financial_settlement"
                                      component="select"
                                      onChange={e =>
                                        this.setState({
                                          financial_settlement: e.target.value,
                                        })
                                      }
                                      value={this.state.financial_settlement}
                                      className="form-select"
                                    >
                                      <option value="Self">Self</option>
                                      <option value="Main Lab">Main Lab</option>
                                    </Field>
                                  </div>
                                )}

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

                                {/* Health Dept Registration No. field */}
                                <div className="mb-3">
                                  <Label
                                    for="registration_no"
                                    className="form-label"
                                  >
                                    Health dept registration number (optional)
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

                                {/* National Taxation No field */}
                                <div className="mb-3">
                                  <Label
                                    for="national_taxation_no"
                                    className="form-label"
                                  >
                                    Lab NTN #
                                  </Label>
                                  <Field
                                    id="national_taxation_no"
                                    name="national_taxation_no"
                                    placeholder="74398H3847"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        national_taxation_no: e.target.value,
                                      })
                                    }
                                    value={this.state.national_taxation_no}
                                    className={
                                      "form-control" +
                                      (errors.national_taxation_no &&
                                      touched.national_taxation_no
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="national_taxation_no"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Is ISO 15189 certified field */}
                                <div className="mb-3">
                                  <Label
                                    for="is_iso_certified"
                                    className="form-label"
                                  >
                                    Are you certified from ISO 15189?
                                  </Label>
                                  <Field
                                    name="is_iso_certified"
                                    component="select"
                                    onChange={this.handleISOCertifiedChange}
                                    value={
                                      this.state.is_iso_certified
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>

                                {/* ISO certificate field */}
                                {this.state.is_iso_certified === "Yes" && (
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    ISO 15189 Certificate
                                  </Label>
                                  <Input
                                    id="formFile"
                                    name="iso_certificate"
                                    placeholder="Choose image"
                                    type="file"
                                    multiple={false}
                                    onChange={this.handleISOCertificateChange}
                                    accept=".jpg,.jpeg,.png"
                                    className={
                                      "form-control" +
                                      (this.state.iso_certificate_error
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />

                                  <div className="invalid-feedback">
                                    {this.state.iso_certificate_error}
                                  </div>
                                </div>
                                )}

                                {/* Lab experience field */}
                                <div className="mb-3">
                                  <Label for="lab_experience" className="form-label">
                                    Lab Experience (Years)
                                  </Label>
                                  <Field
                                    id="lab_experience"
                                    name="lab_experience"
                                    placeholder="3"
                                    type="number"
                                    onChange={e =>
                                      this.setState({ lab_experience: e.target.value })
                                    }
                                    value={this.state.lab_experience}
                                    className={
                                      "form-control" +
                                      (errors.lab_experience && touched.lab_experience
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="lab_experience"
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
                                    Complete address
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

                                {/* Accept Digital Payments field */}
                                <div className="mb-3">
                                  <Label
                                    for="is_digital_payment_accepted"
                                    className="form-label"
                                  >
                                    Do you accept digital payments?
                                  </Label>
                                  <Field
                                    name="is_digital_payment_accepted"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        is_digital_payment_accepted:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_digital_payment_accepted
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>

                                {/* Registered by field */}
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
                                        registered_by:
                                          e.target.value,
                                      })
                                    }
                                    defaultValue={
                                      this.state.registered_by
                                    }
                                    className="form-select"
                                  >
                                    <option value="Lab">Lab</option>
                                    <option value="Marketer">Marketer</option>
                                  </Field>
                                </div>

                                
                                {/* Marketer's fields */}
                                {this.state.registered_by === "Marketer" && (
                                  <div>
                                    {/* Is Registering First Time field */}
                                    <div className="mb-3">
                                      <Label
                                        for="is_registering_for_first_time"
                                        className="form-label"
                                      >
                                        Are you registering lab for the first time?
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
                                          this.state.is_registering_for_first_time
                                        }
                                        className="form-select"
                                      >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </Field>
                                    </div>
                                
                                    {/* Marketer Email field */}
                                    <div className="mb-3">
                                      <Label for="marketer_email" className="form-label">
                                        Marketer email
                                      </Label>
                                      <Field
                                        name="marketer_email"
                                        placeholder="johndoe@gmail.com"
                                        type="text"
                                        onChange={e =>
                                          this.setState({ marketer_email: e.target.value })
                                        }
                                        value={this.state.marketer_email}
                                        className={
                                          "form-control" +
                                          (errors.marketer_email && touched.marketer_email
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

                                    {this.state.is_registering_for_first_time === "Yes" && (
                                    <div>
                                      {/* Marketer Name field */}
                                      <div className="mb-3">
                                      <Label for="marketer_name" className="form-label">
                                        Marketer name
                                      </Label>
                                      <Field
                                        id="marketer_name"
                                        name="marketer_name"
                                        placeholder="John Doe"
                                        type="text"
                                        onChange={e =>
                                          this.setState({ marketer_name: e.target.value })
                                        }
                                        value={this.state.marketer_name}
                                        className={
                                          "form-control" +
                                          (errors.marketer_name && touched.marketer_name
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

                                    {/* Marketer CNIC field */}
                                    <div className="mb-3">
                                      <Label for="marketer_cnic" className="form-label">
                                        Marketer CNIC
                                      </Label>
                                      <Field
                                        id="marketer_cnic"
                                        name="marketer_cnic"
                                        placeholder="12345-6789012-1"
                                        type="text"
                                        onChange={e =>
                                          this.setState({ marketer_cnic: e.target.value })
                                        }
                                        value={this.state.marketer_cnic}
                                        className={
                                          "form-control" +
                                          (errors.marketer_cnic && touched.marketer_cnic
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

                                    {/* Marketer Phone field */}
                                    <div className="mb-3">
                                      <Label for="marketer_phone" className="form-label">
                                        Marketer phone
                                      </Label>
                                      <Field
                                        id="marketer_phone"
                                        name="marketer_phone"
                                        placeholder="+923123456789"
                                        type="text"
                                        onChange={e =>
                                          this.setState({ marketer_phone: e.target.value })
                                        }
                                        value={this.state.marketer_phone}
                                        className={
                                          "form-control" +
                                          (errors.marketer_phone && touched.marketer_phone
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

                                    {/* Marketer City field */}
                                    <div className="mb-3">
                                      <Label for="marketer_city" className="form-label">
                                        Marketer City
                                      </Label>
                                      <Field
                                        id="marketer_city"
                                        name="marketer_city"
                                        placeholder="Rawalpindi"
                                        type="text"
                                        onChange={e =>
                                          this.setState({ marketer_city: e.target.value })
                                        }
                                        value={this.state.marketer_city}
                                        className={
                                          "form-control" +
                                          (errors.marketer_city && touched.marketer_city
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="marketer_city"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                    </div>
                                    )}
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

LabInformation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  onGetLabs: PropTypes.func,
  labs: PropTypes.array,
  getLabs: PropTypes.func,
  getLabsSuccess: PropTypes.func,
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
  getLabs,
  getLabsSuccess,
  addLabInformation,
  addLabInformationFailed,
})(LabInformation);
