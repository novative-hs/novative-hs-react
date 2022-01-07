import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Card, CardBody, Col, Container, Row, Label } from "reactstrap";
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

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      emailFieldError: null,
      passwordFieldError: null,
    };
  }

  componentDidMount() {
    this.props.apiError("");
    this.props.registerUserFailed("");
  } 


  componentDidUpdate(prevProps) {
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError })
    }

    if (prevProps.emailError != this.props.emailError) {
      this.setState({ emailFieldError: this.props.emailError })
    }

    if (prevProps.passwordError != this.props.passwordError) {
      this.setState({ passwordFieldError: this.props.passwordError })
    }
  }

  render() {
    
    this.getRegistrationAPIResponse()

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Register | Ilaaj4u</title>
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
                          <h5 className="text-primary">Register account</h5>
                          <p className="text-muted">
                            Get your free Ilaaj4u account now.
                          </p>
                        </div>

                        <div className="mt-4">
                          {/* {this.props.registrationError && this.props.registrationError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.registrationError}
                            </Alert>
                          ) : null} */}

                          {this.props.userID && this.props.userID ? (
                            <Alert color="success" style={{ marginTop: "13px" }}>
                              Congratulations! You have registered successfully.
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              email: 
                                (this.state && this.state.email) || "",
                              password:
                                (this.state && this.state.password) || "",
                              password2:
                                (this.state && this.state.password2) || "",
                              account_type:
                                (this.state && this.state.account_type) || "patient",
                            }}
                            validationSchema={Yup.object().shape({
                              username: Yup.string().required(
                                "Please enter your username"
                              ),
                              email: Yup.string().required(
                                "Please enter your email"
                              ).email("Please enter valid email"),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                              password2: Yup.string().when("password", {
                                is: val => (val && val.length > 0 ? true : false),
                                then: Yup.string().oneOf(
                                  [Yup.ref("password")],
                                  "Both password need to be the same"
                                ),
                              }),

                            })}
                            onSubmit={values => {
                              this.props.registerUser(values);
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
                                    onFocus={() => {this.setState({ usernameFieldError: null })}}
                                    className={
                                      "form-control" +
                                      ((errors.username && touched.username) || this.state.usernameFieldError
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="invalid-feedback"
                                  />

                                  <div className="invalid-feedback">{this.state.usernameFieldError}</div>

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
                                    onFocus={() => {this.setState({ emailFieldError: null })}}
                                    className={
                                      "form-control" +
                                      (errors.email && touched.email || this.state.emailFieldError
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="invalid-feedback"
                                  />

                                  <div className="invalid-feedback">{this.state.emailFieldError}</div>
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
                                      onFocus={() => {this.setState({ passwordFieldError: null })}}
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password || this.state.passwordFieldError
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="password"
                                      component="div"
                                      className="invalid-feedback"
                                    />

                                    <div className="invalid-feedback">{this.state.passwordFieldError}</div>
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
                                  <Label for="account_type" className="form-label">
                                    Username
                                  </Label>                                
                                  <Field name="account_type" component="select" className="form-select">
                                    <option value="patient">Patient</option>
                                    <option value="labowner">Lab Owner</option>
                                    <option value="corporate">Corporate</option>
                                  </Field>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    {" "}
                                    Register{" "}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                          <div className="mt-3 text-center">
                            <p>
                              Already have an account?{" "}
                              <Link
                                to="pages-login-2"
                                className="fw-medium text-primary"
                              >
                                {" "}
                                Login
                              </Link>{" "}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="mt-4 mt-md-5 text-center">
                        <p className="mb-0">
                          © {new Date().getFullYear()} {" "} Ilaaj4u
                        </p>
                      </div> */}
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

  getRegistrationAPIResponse() {
    if (this.props.userID) {
      console.log("User ID: ", this.props.userID);
      console.log("User Account Type: ", this.props.userAccountType);
    }
  }
}

Register.propTypes = {
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  emailError: PropTypes.any,
  passwordError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
};

const mapStateToProps = state => {
  const { userID, userAccountType, emailError, usernameError, passwordError, loading } = state.Account;
  return { userID, userAccountType, emailError, usernameError, passwordError, loading };
};

export default connect(mapStateToProps, {
  registerUser,
  apiError,
  registerUserFailed,
})(Register);
