import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
  Alert,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// action
import {
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";
// Redux
import { connect } from "react-redux";
import Select from "react-select";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

class StaffRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
      emailError: null,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.emailError !== this.props.emailError) {
      this.setState({ emailError: this.props.emailError });
    }
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError });
    }
    if (prevProps.passwordError != this.props.passwordError) {
      this.setState({ passwordFieldError: this.props.passwordError });
    }

    if (
      prevProps.incompleteRegistrationError !=
      this.props.incompleteRegistrationError
    ) {
      this.setState({
        incompleteRegistrationError: this.props.incompleteRegistrationError,
      });
    }
  }
  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById("eye-icon");

    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.className = "mdi mdi-eye-off-outline";
    } else if (passwordInput) {
      passwordInput.type = "password";
      eyeIcon.className = "mdi mdi-eye-outline";
    }
  };
  togglePassword1Visibility = () => {
    const passwordInput = document.querySelector('input[name="password2"]');
    const eyeIcon2 = document.getElementById("eye-icon1");

    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon2.className = "mdi mdi-eye-off-outline";
    } else if (passwordInput) {
      passwordInput.type = "password";
      eyeIcon2.className = "mdi mdi-eye-outline";
    }
  };

  render() {
    // console.log("Email error received:", this.props.emailError);

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Staff | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Register" />
            <Row className="justify-content-center">
              <Col lg="8">
                <Card>
                  <CardBody>
                    <div className="mt-4">
                      {this.state.submittedMessage && (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.state.submittedMessage}
                        </Alert>
                      )}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          username: (this.state && this.state.username) || "",
                          email: (this.state && this.state.email) || "",
                          password: (this.state && this.state.password) || "",
                          password2: (this.state && this.state.password2) || "",
                          account_type:
                            (this.state && this.state.account_type) || "labowner",
                          name: (this.state && this.state.name) || "",
                          cnic: (this.state && this.state.cnic) || "",
                          phone: (this.state && this.state.phone) || "",
                          city: (this.state && this.state.city) || "",

                          landline: (this.state && this.state.landline) || "",
                          postalcode:
                            (this.state && this.state.postalcode) || "",

                          fax: (this.state && this.state.fax) || "",
                          organization:
                            (this.state && this.state.organization) || "",
                          country: (this.state && this.state.country) || "",

                          address: (this.state && this.state.address) || "",
                          Select_schemes:
                            (this.state && this.state.Select_schemes) || "No",
                          department:
                            (this.state && this.state.department) || "",

                          lab_staff_name:
                            (this.state && this.state.lab_staff_name) || "",
                          lab_staff_designation:
                            (this.state && this.state.lab_staff_designation) ||
                            "",
                          district: (this.state && this.state.district) || "",
                          landline_registered_by:
                            (this.state && this.state.landline_registered_by) ||
                            "",
                          website: (this.state && this.state.website) || "",
                          
                          added_by: localStorage.getItem(
                            "authUser"
                          )
                            ? JSON.parse(
                                localStorage.getItem(
                                  "authUser"
                                )
                              ).user_id
                            : "",
                        }}
                        // validationSchema={Yup.object().shape({
                        //   username: Yup.string()
                        //     .required("Username is required")
                        //     .min(3, "Username must be at least 3 characters")
                        //     .max(
                        //       50,
                        //       "Username can't be longer than 50 characters"
                        //     ),
                        //   password: Yup.string().required(
                        //     "Please enter your password"
                        //   ),
                        //   name: Yup.string()
                        //     .trim()
                        //     .required("Please enter name")
                        //     .min(3, "Name must be at least 3 characters")
                        //     .max(50, "Name can't be longer than 50 characters"),

                        //   email: Yup.string()
                        //     .required("Please enter your email")
                        //     .email("Please enter valid email"),

                        //   password2: Yup.string()
                        //     .required("Please re-enter your password")
                        //     .when("password", {
                        //       is: val => (val && val.length > 0 ? true : false),
                        //       then: Yup.string().oneOf(
                        //         [Yup.ref("password")],
                        //         "Both password need to be the same"
                        //       ),
                        //     }),
                        //   city: Yup.string()
                        //     .trim()
                        //     .required("Please enter city"),

                        //   landline: Yup.string()
                        //     .required("Telephone number is required")
                        //     .matches(
                        //       /^\d{7,15}$/,
                        //       "Telephone number must be between 7 and 15 digits"
                        //     ),

                        //   postalcode: Yup.string()
                        //     .trim()
                        //     .required("Please enter postalcode"),

                        //   organization: Yup.string()
                        //     .required("Organization name is required")
                        //     .max(
                        //       100,
                        //       "Organization name can't be longer than 100 characters"
                        //     ),

                        //   country: Yup.string()
                        //     .required("Country is required")
                        //     .max(
                        //       50,
                        //       "Country can't be longer than 50 characters"
                        //     ),

                        //   address: Yup.string()
                        //     .required("Address is required")
                        //     .max(
                        //       200,
                        //       "Address can't be longer than 200 characters"
                        //     ),

                        //   Select_schemes:
                        //     Yup.string().required("Scheme is required"),

                        //   department: Yup.string()
                        //     .required("Department is required")
                        //     .max(
                        //       100,
                        //       "Department can't be longer than 100 characters"
                        //     ),

                        //   district: Yup.string()
                        //     .required("District is required")
                        //     .max(
                        //       50,
                        //       "District can't be longer than 50 characters"
                        //     ),
                        //   lab_staff_name: Yup.string()
                        //     .required("Lab staff name is required")
                        //     .max(
                        //       50,
                        //       "Lab staff name can't be longer than 50 characters"
                        //     ),
                        //   lab_staff_designation: Yup.string()
                        //     .required("Lab staff designation is required")
                        //     .max(
                        //       50,
                        //       "Lab staff designation can't be longer than 50 characters"
                        //     ),

                        //   landline_registered_by: Yup.string()
                        //     .required("Landline number is required")
                        //     .matches(
                        //       /^\d{7,15}$/,
                        //       "Landline number must be between 7 and 15 digits"
                        //     ),
                        //   website: Yup.string()
                        //     .url("Invalid URL")
                        //     .required("Website is required"),
                        // })}
                        onSubmit={values => {
                          this.props.registerUser(values);
                          // console.log("valuessss",  this.props.registerUser(values))

                          // Check for errors and set the success message
                          setTimeout(() => {
                            if (
                              !this.state.usernameFieldError &&
                              !this.state.passwordFieldError &&
                              !this.state.incompleteRegistrationError
                            ) {
                              this.setState({
                                submittedMessage: "Participant added  successfully.",
                              });
                            }
                          }, 1000); // Initial 1 second delay
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form className="form-horizontal">
                            {/* Name field */}
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Name
                                  </Label>
                                  <Field
                                    name="name"
                                    type="text"
                                    placeholder="Enter name"
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
                                {/* Address field */}
                                <div className="mb-3">
                                  <Label for="address" className="form-label">
                                    Address
                                  </Label>
                                  <Field
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Please enter your complete address"
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
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label for="landline" className="form-label">
                                    Telephone No
                                  </Label>
                                  <Field
                                    id="landline"
                                    name="landline"
                                    type="text"
                                    placeholder="Please enter your landline no."
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

                              {/* city */}
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="city" className="form-label">
                                    City
                                  </Label>
                                  <Field
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Please enter your city/town"
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
                                  <Label for="country" className="form-label">
                                    Country
                                  </Label>
                                  <Field
                                    id="country"
                                    name="country"
                                    type="text"
                                    placeholder="Please enter your country"
                                    className={
                                      "form-control" +
                                      (errors.country && touched.country
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
                                    Organization Name
                                  </Label>
                                  <Field
                                    id="organization"
                                    name="organization"
                                    type="text"
                                    placeholder="Please enter your organization"
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
                                  {/* <span className="text-primary font-size-12">
                                    <strong>
                                      Note: Please add the complete valid
                                      address searchable on google maps.
                                    </strong>
                                  </span> */}
                                </div>
                              </Col>
                              {/* District */}
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="district" className="form-label">
                                    District
                                  </Label>
                                  <Field
                                    id="district"
                                    name="district"
                                    type="text"
                                    placeholder="Please enter district"
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
                                  {/* <span className="text-primary font-size-12">
                                    <strong>
                                      Note: Please add the complete valid
                                      address searchable on google maps.
                                    </strong>
                                  </span> */}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              {/* Participant Sector */}
                              <Col sm={6} md={6} xl={6}></Col>
                              {/* Participant Type */}
                              <Col sm={6} md={6} xl={6}></Col>
                            </Row>
                            {/* Schemes */}
                            <div className="mb-3">
                              <Label
                                for="Select_schemes"
                                className="form-label"
                              >
                                Select scheme
                              </Label>
                              <Field
                               name="Select_schemes"
                               as="select"
                               className="form-select"
                              >
                                <option value=" ">Choose option</option>
                                <option value="abc">Abc</option>
                                <option value="xyz">Xyz</option>
                              </Field>
                            </div>
                            <div className="mb-3">
                              <Label for="website" className="form-label">
                                Website
                              </Label>
                              <Field
                                id="website"
                                name="website"
                                type="text"
                                placeholder="Please enter your website_URL"
                                className={
                                  "form-control" +
                                  (errors.website && touched.website
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="website"
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
                            <div className="mb-3 mt-5">
                              <h3>Who is registering the participant</h3>
                            </div>
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
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label
                                    for="landline_registered_by"
                                    className="form-label"
                                  >
                                    Telephone No
                                  </Label>
                                  <Field
                                    id="landline_registered_by"
                                    name="landline_registered_by"
                                    type="text"
                                    placeholder="Please enter your landline no."
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
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label className="form-label">Email</Label>
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
                            </Row>

                            {/* Username field */}
                            <div className="mb-3">
                              <Label for="username" className="form-label">
                                Username
                              </Label>
                              <Field
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                type="text"
                                onFocus={() => {
                                  this.setState({
                                    usernameFieldError: null,
                                  });
                                }}
                                className={
                                  "form-control" +
                                  ((errors.username && touched.username) ||
                                  this.state.usernameFieldError
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="username"
                                component="div"
                                className="invalid-feedback"
                              />

                              <div className="invalid-feedback">
                                {this.state.usernameFieldError}
                              </div>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Password</Label>
                              <div className="input-group">
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Enter password"
                                  autoComplete="on"
                                  className={
                                    "form-control" +
                                    ((errors.password && touched.password) ||
                                    this.state.passwordFieldError
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i
                                      id="eye-icon"
                                      className="mdi mdi-eye-outline"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                              <div className="invalid-feedback">
                                {this.state.passwordFieldError}
                              </div>

                              <div className="mt-2 input-group">
                                <Field
                                  name="password2"
                                  type="password"
                                  placeholder="Re-enter password"
                                  autoComplete="on"
                                  className={
                                    "form-control" +
                                    (errors.password2 && touched.password2
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePassword1Visibility}
                                  >
                                    <i
                                      id="eye-icon1"
                                      className="mdi mdi-eye-outline"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="password2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>

                            {/* <div className="mb-3">
                              <label htmlFor="account_type">Account Type</label>
                              <Field
                                name="account_type"
                                as="select" // Using `as="select"` with Field
                                // component="select"
                                className="form-select"
                              >
                                <option value="" disabled>
                                  Select Account Type
                                </option>
                                <option value="patient">Patient</option>
                                <option value="labowner">Lab</option>
                                <option value="b2bclient">B2B Client</option>
                                <option value="donor">Donor</option>
                                <option value="corporate">Corporate</option>
                              </Field>
                              <ErrorMessage
                                name="account_type"
                                component="div"
                                className="text-danger"
                              />
                            </div> */}

                            <div className="mt-3 d-grid">
                              <button
                                className="btn btn-primary btn-block"
                                type="submit"
                                // disabled={this.state.submittedMessage}
                                style={{
                                  backgroundColor: "#1D1DE4",
                                }}
                              >
                                {" "}
                                Register{" "}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
StaffRegister.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
  emailError: PropTypes.any,
};
const mapStateToProps = ({ Account }) => ({
  emailError: Account.emailError,
  userAccountType: Account.userAccountType,
  loading: Account.loading,
  incompleteRegistrationError: Account.incompleteRegistrationError,
  passwordError: Account.passwordError,
  userID: Account.userID,
  usernameError: Account.usernameError,
});
const mapDispatchToProps = dispatch => {
  return {
    apiError: error => dispatch(apiError(error)),
    registerUser: user => dispatch(registerUser(user)),
    registerUserFailed: error => dispatch(registerUserFailed(error)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StaffRegister);
