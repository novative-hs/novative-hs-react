import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { Alert, Col, Container, Row, Label } from "reactstrap";

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
    this.state = {
      count: 0,
      guest_id: "",
    };
  }

  componentDidMount() {
 
    const url = window.location.href;
    const queryString = url.includes('&') ? url.substring(url.indexOf('&') + 1) : '';
    console.log(queryString);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params)
    const latitudeFromUrl = params.get('lat');
    const longitudeFromUrl = params.get('lon');

    console.log('Latitude:', latitudeFromUrl);
    console.log('Longitude:', longitudeFromUrl);
    if (latitudeFromUrl && longitudeFromUrl) {

      const url = `http://localhost:3000/nearby-labs/&lat=${latitudeFromUrl}&lon=${longitudeFromUrl}`;
      const queryString = url.substring(url.indexOf("&") + 1);
      const finalUrl = ("&") + queryString; // Remove the leading question mark ('?')        
      this.setState({ finalUrl: finalUrl });
      console.log("differ with the final url state:", this.state.finalUrl);

      console.log(finalUrl);
      console.log("whsuqi", this.props.match.params.uuid);
    }

    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }
    // const guest_id = this.props.match.params.guest_id;
    // console.log("dis mount",guest_id)

    if (localStorage.getItem("authUser")) {
      this.props.history.push("/logout");
    }
    this.props.apiError("");
    // console.log("finalurl in the app", finalUrl, this.state.finalUrl)
    console.log("guest_id",this.props.match.params.guest_id)
    console.log("uuid",this.props.match.params.uuid)

  }

  removeAttributes(element, ...attrs) {
    attrs.forEach(attr => element.removeAttribute(attr));
  }

  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon.className = 'mdi mdi-eye-outline';
    }
  };


  render() {
    const isLargeScreen = window.innerWidth > 470;
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Login | Lab Hazir</title>
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
                          <h5 className="text-primary">Welcome Back!</h5>
                          <p className="text-muted">
                            Sign in to continue to Lab Hazir
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.error && this.props.error && (
                            <Alert color="danger">{this.props.error}</Alert>
                          )}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              password:
                                (this.state && this.state.password) || "",
                              guest_id:
                                (this.props && this.props.match.params.guest_id) || "",
                            }
                            }
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
                              console.log("page: ", values)
                              setTimeout(() => {
                                console.log(values)
                                const success = this.props.success;
                                if (!isLargeScreen && this.state.finalUrl) {
                                  console.log("finalUrl in mobile app else case", this.state.finalUrl)
                                  if (success.account_type === "patient") {
                                    this.props.history.push(
                                      this.state.finalUrl
                                        ? `/nearby-labs/${this.state.finalUrl}`
                                        : `/nearby-labs/${this.state.finalUrl}`
                                    );
                                  } else if (success.account_type === "samplecollector") {
                                    this.props.history.push("/dashboard-samplecollector");
                                  }
                                } 
                                if (isLargeScreen && success.account_type === "patient" && !this.state.finalUrl) {
                                  this.props.history.push(
                                    this.props.match.params.uuid
                                      ? `/nearby-labs/${this.props.match.params.uuid}`
                                      : `/nearby-labs`
                                  );
                                  console.log(this.props.match.params.uuid);
                                } 
                                  else if (success.account_type === "labowner") {
                                    this.props.history.push("/dashboard-lab");
                                  } else if (success.account_type === "b2b-admin") {
                                    this.props.history.push("/b2b-clients-list");
                                  } else if (success.account_type === "b2bclient") {
                                    this.props.history.push("/dashboard-b2bclient");
                                  } else if (success.account_type === "CSR") {
                                    this.props.history.push("/dashboard-csr");
                                  } else if (success.account_type === "finance-officer") {
                                    this.props.history.push("/dashboard-finance");
                                  } else if (success.account_type === "finance-admin") {
                                    this.props.history.push("/dashboard-financeadmin");
                                  } else if (success.account_type === "auditor") {
                                    this.props.history.push("/dashboard-auditor");
                                  } else if (success.account_type === "registration-admin") {
                                    this.props.history.push("/pending-labs");
                                  } else if (success.account_type === "marketer-admin") {
                                    this.props.history.push("/discount-labhazir");
                                  } else if (success.account_type === "samplecollector") {
                                    this.props.history.push("/dashboard-samplecollector");
                                  } else if (success.account_type === "csr-admin") {
                                    this.props.history.push("/pending-complaints-lab");
                                  } else if (success.account_type === "auditor-admin") {
                                    this.props.history.push("/pending-audits");
                                  } else if (success.account_type === "hr-admin") {
                                    this.props.history.push("/add-staff");
                                  } else if (success.account_type === "donor") {
                                    this.props.history.push("/donor-profile");
                                  }


                              }, 1000);
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
                                  <div className="input-group auth-pass-inputgroup">
                                    <Field
                                      name="password"
                                      type="password"
                                      autoComplete="true"
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password ? " is-invalid" : "")
                                      }
                                    />
                                    <button
                                      className="btn btn-light"
                                      type="button"
                                      id="password-addon"
                                      onClick={this.togglePasswordVisibility}
                                    >
                                      <i id="eye-icon" className="mdi mdi-eye-outline"></i>
                                    </button>
                                  </div>
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

                                <div className="mt-3 text-center">
                                  {(!isLargeScreen && this.state.finalUrl) ? (
                                    <p>
                                      Do not have an account?{" "}
                                      <Link
                                        to={this.state.finalUrl ? `/register/${this.state.finalUrl}` : "/register"}
                                        className="fw-medium text-primary"
                                      >
                                        Register
                                      </Link>{" "}
                                    </p>
                                  ) : (
                                    <p>
                                      Do not have an account?{" "}
                                      <Link
                                        to={
                                          this.props.match.params.uuid
                        ? `/register/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                        : `/register/${this.props.match.params.guest_id}`
                                        }
                                        className="fw-medium text-primary"
                                      >
                                        Register
                                      </Link>{" "}
                                    </p>
                                  )}
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
  match: PropTypes.object,
  apiError: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.Login;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
