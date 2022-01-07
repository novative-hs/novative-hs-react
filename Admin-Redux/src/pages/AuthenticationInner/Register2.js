import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { Col, Container, Row, Alert, Label } from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// import images
import CarouselPage from "./CarouselPage";

// action
import {
  apiError,
  registerUser,
  registerUserFailed,
  registerUserSuccessful,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class Register2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.apiError("");
    this.props.registerUserFailed("");
    this.props.registerUserSuccessful("");
  }

  render() {
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
                              ),
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
                              console.log(values,'values');
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
                                    className={
                                      "form-control" +
                                      (errors.username && touched.username
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="username"
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
                                    placeholder="Enter email"
                                    type="email"
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

                                {/* Password field */}
                                <div className="mb-3">
                                  <Label className="form-label">Password</Label>
                                  <div>
                                    <Field
                                      name="password"
                                      type="password"
                                      placeholder="Enter password"
                                      autoComplete="on"
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="password"
                                      component="div"
                                      className="invalid-feedback"
                                    />
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
                                  {/* <select className="form-select" value={this.state.value} onChange={this.handleChange}>
                                    <option value="patient">Patient</option>
                                    <option value="labowner">Lab Owner</option>
                                    <option value="corporate">Corporate</option>
                                  </select> */}
                                </div>
                                {/* <div className="mb-3">
                                  <Label for="account_type" className="form-label">
                                    Username
                                  </Label>
                                  <Field
                                    name="account_type"
                                    placeholder="Enter account type"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.account_type && touched.account_type
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="account_type"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div> */}
                                
                                {/* <div>
                                  <p className="mb-0">
                                    By registering you agree to the Ilaaj4u {" "}
                                    <Link to="#" className="text-primary">
                                      Terms of Use
                                    </Link>
                                  </p>
                                </div> */}

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
}

Register2.propTypes = {
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  registerUserSuccessful: PropTypes.any,
  registrationError: PropTypes.any,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const { user, registrationError, loading } = state.Account;
  return { user, registrationError, loading };
};

export default connect(mapStateToProps, {
  registerUser,
  apiError,
  registerUserFailed,
  registerUserSuccessful,
})(Register2);

