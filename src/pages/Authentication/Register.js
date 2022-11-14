import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Label, Alert } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";

// action
import {
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      emailFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
    };
  }

  componentDidMount() {
    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }

    this.props.apiError("");
    this.props.registerUserFailed("");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError });
    }

    if (prevProps.emailError != this.props.emailError) {
      this.setState({ emailFieldError: this.props.emailError });
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

  render() {
    if (this.props.userID) {
      if (this.props.userAccountType == "patient") {
        if (!this.props.match.params.uuid) {
          return (
            <Redirect
              to={{
                pathname: "/patient-information/" + this.props.userID,
                state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname:
                  "/patient-information/" +
                  this.props.userID +
                  "/" +
                  this.props.match.params.uuid,
                state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
              }}
            />
          );
        }
      } else if (this.props.userAccountType == "labowner") {
        return (
          <Redirect
            to={{
              pathname: "/lab-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
            }}
          />
        );
      } else if (this.props.userAccountType == "corporate") {
        return (
          <Redirect
            to={{
              pathname: "/corporate-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
            }}
          />
        );
      } else if (this.props.userAccountType == "b2bclient") {
        return (
          <Redirect
            to={{
              pathname: "/b2bclient-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
            }}
          />
        );
      }
     else if (this.props.userAccountType == "donor") {
      return (
        <Redirect
          to={{
            pathname: "/donor-information/" + this.props.userID,
            state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
          }}
        />
      );
    }
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Register | Lab Hazir</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

              <Col md={6} lg={6} xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">
                            Register account - Step 1 of 2
                          </h5>
                          <p className="text-muted">
                            Get your free Lab Hazir account now.
                          </p>
                        </div>

                        {/* To show submitted message of processing if submission is succesful */}
                        <div className="mt-4">
                          {this.state.submittedMessage && (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              {this.state.submittedMessage}
                            </Alert>
                          )}

                          {/* To show incomplete registration error to inform user */}
                          {this.state.incompleteRegistrationError && (
                            <div>
                              <Alert
                                color="danger"
                                style={{ marginTop: "13px" }}
                              >
                                Your registration process was{" "}
                                <strong>
                                  incomplete last time when you registered
                                </strong>
                                . If you want to
                                regispatient-information/113893749834ter now,
                                please click on <strong>Next</strong> button
                                once again.
                              </Alert>
                              <Alert color="info" style={{ marginTop: "13px" }}>
                                After completing the step 2 of registration,
                                please make sure to{" "}
                                <strong>
                                  verify your account on new verification email
                                </strong>{" "}
                                you will receive from us and{" "}
                                <strong>ignore the old one</strong> (if any) you
                                have received last time.
                              </Alert>
                            </div>
                          )}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              email: (this.state && this.state.email) || "",
                              password:
                                (this.state && this.state.password) || "",
                              password2:
                                (this.state && this.state.password2) || "",
                              account_type:
                                (this.state && this.state.account_type) ||
                                "labowner",
                            }}
                            validationSchema={Yup.object().shape({
                              username: Yup.string()
                                .trim()
                                .required("Please enter your username")
                                .matches(
                                  /^\S*$/,
                                  "Please do not include whitespaces"
                                ),
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email"),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                              password2: Yup.string()
                                .required("Please re-enter your password")
                                .when("password", {
                                  is: val =>
                                    val && val.length > 0 ? true : false,
                                  then: Yup.string().oneOf(
                                    [Yup.ref("password")],
                                    "Both password need to be the same"
                                  ),
                                }),
                            })}
                            onSubmit={values => {
                              this.props.registerUser(values);

                              // If no error messages then show wait message
                              setTimeout(() => {
                                if (
                                  !this.state.usernameFieldError &&
                                  !this.state.passwordFieldError &&
                                  !this.state.emailFieldError &&
                                  !this.state.incompleteRegistrationError
                                ) {
                                  this.setState({
                                    submittedMessage:
                                      "Please wait for a while we are processing. Thank you for your patience.",
                                  });
                                }
                              }, 1000);
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
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

                                {/* Email field */}
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    name="email"
                                    placeholder="Enter email"
                                    type="text"
                                    onFocus={() => {
                                      this.setState({ emailFieldError: null });
                                    }}
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

                                {/* Password field */}
                                <div className="mb-3">
                                  <Label className="form-label">Password</Label>
                                  <div>
                                    <Field
                                      name="password"
                                      type="password"
                                      placeholder="Enter password"
                                      autoComplete="on"
                                      onFocus={() => {
                                        this.setState({
                                          passwordFieldError: null,
                                        });
                                      }}
                                      className={
                                        "form-control" +
                                        ((errors.password &&
                                          touched.password) ||
                                        this.state.passwordFieldError
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="password"
                                      component="div"
                                      className="invalid-feedback"
                                    />

                                    <div className="invalid-feedback">
                                      {this.state.passwordFieldError}
                                    </div>
                                  </div>
                                  <div className="mt-2">
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
                                    <ErrorMessage
                                      name="password2"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </div>

                                {/* Account type field */}
                                <div className="mb-3">
                                  <Label
                                    for="account_type"
                                    className="form-label"
                                  >
                                    Account type
                                  </Label>
                                  <Field
                                    name="account_type"
                                    component="select"
                                    className="form-select"
                                  >
                                    <option value="patient">Patient</option>
                                    <option value="labowner">Lab</option>
                                    <option value="b2bclient">
                                      B2B Client
                                    </option>
                                    <option value="donor">
                                      Donor
                                    </option>
                                    {/* <option value="corporate">Corporate</option> */}
                                  </Field>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                    disabled={this.state.submittedMessage}
                                  >
                                    {" "}
                                    Next{" "}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                          <div className="mt-3 text-center">
                            <p>
                              Already have an account?{" "}
                              <Link
                                // to={{ pathname: "/login" }}
                                to={
                                  this.props.match.params.uuid
                                    ? `/login/${this.props.match.params.uuid}`
                                    : `/login`
                                }
                                className="fw-medium text-primary"
                              >
                                {" "}
                                Login
                              </Link>{" "}
                            </p>
                          </div>
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

Register.propTypes = {
  match: PropTypes.object,
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  emailError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
};

const mapStateToProps = state => {
  const {
    userID,
    userAccountType,
    emailError,
    usernameError,
    passwordError,
    incompleteRegistrationError,
    loading,
  } = state.Account;
  return {
    userID,
    userAccountType,
    emailError,
    usernameError,
    passwordError,
    incompleteRegistrationError,
    loading,
  };
};

export default connect(mapStateToProps, {
  registerUser,
  apiError,
  registerUserFailed,
})(Register);