import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { Alert, Card, CardBody, Col, Container, Row, Label } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser } from "../../store/actions";

// import images
import CarouselPage from "../AuthenticationInner/CarouselPage";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.apiError("");
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Login | Ilaaj4u</title>
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
                          <h5 className="text-primary">Welcome Back!</h5>
                          <p className="text-muted">
                            Sign in to continue to Ilaaj4u.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.error && this.props.error ? (
                            <Alert color="danger">
                              Sorry! You have provided invalid credentials.
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              password:
                                (this.state && this.state.password) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              username: Yup.string().required(
                                "Please enter your username or email"
                              ),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                            })}
                            onSubmit={values => {
                              this.props.loginUser(values, this.props.history);
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                <div className="mb-3">
                                  <Label for="username" className="form-label">
                                    Username or Email
                                  </Label>
                                  <Field
                                    name="username"
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

                                <div className="mb-3">
                                  <Label for="password" className="form-label">
                                    Password
                                  </Label>
                                  <Field
                                    name="password"
                                    type="password"
                                    autoComplete="true"
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

                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customControlInline"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="customControlInline"
                                  >
                                    Remember me
                                  </label>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    Log In
                                  </button>
                                </div>

                                <div className="mt-4 text-center">
                                  <Link
                                    to="/forgot-password"
                                    className="text-muted"
                                  >
                                    <i className="mdi mdi-lock me-1" /> Forgot
                                    your password?
                                  </Link>
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

Login.propTypes = {
  apiError: PropTypes.any,
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
