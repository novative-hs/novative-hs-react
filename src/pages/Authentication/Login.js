import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import {
  Alert,
  Col,
  Container,
  Row,
  Label,
  Card,
  CardBody,
  CardTitle,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser } from "../../store/actions";
// import images
import CarouselPage from "../AuthenticationInner/CarouselPage";
import backgroundImage from "../../../src/assets/images/sideimg.jpg";
import bgimg from "../../../src/assets/images/b.jpg";
import logo from "../../../src/assets/images/LogoNeqas.jpg";

import { userForgetPassword } from "../../store/actions";
import TimelineItem from "antd/es/timeline/TimelineItem";

// Define validation
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  lab_code: Yup.string().required("labcode is required"),
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_role: "NHS", // Default role
      isLoginInProgress: false,
    };
  }

  componentDidMount() {
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }

    if (localStorage.getItem("authUser")) {
      this.props.history.push("/logout");
    }
    this.props.apiError("");
  }

  togglePasswordVisibility = e => {
    const button = e.currentTarget;
    const inputGroup = button.closest(".input-group");

    if (!inputGroup) return;

    const passwordInput = inputGroup.querySelector('input[name="password"]');
    const eyeIcon = button.querySelector("i");

    if (passwordInput && eyeIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.className = "mdi mdi-eye-off-outline";
      } else {
        passwordInput.type = "password";
        eyeIcon.className = "mdi mdi-eye-outline";
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Login | NHS NEQAS</title>
        </MetaTags>

        <Container
          fluid
          className="d-flex flex-column justify-content-center align-items-center "
          style={{
            minHeight: "100vh",
            backgroundImage: `url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Logo top-left */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: 1000,
              color: "white",
            }}
          >
            <img
              src="https://externalqcapi.com/media/organization/nhs_logo.webp"
              alt="NHS Logo"
              style={{
                width: "170px",
                height: "70px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Row for "Coming Soon" banner */}
          <Row className="g-0 justify-content-center pb-3">
            {" "}
            {/* pb-4 adds bottom padding */}
            {/* Centered "Coming Soon" text */}
            <Col
              xs="auto"
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "100%",
              }}
            >
              <h1
                style={{
                  fontWeight: "bold",
                  animation: "blinker 1.5s linear infinite",
                  fontSize: "2rem",
                  fontFamily: "Laurel Black",
                  margin: 0,
                  color: "white",
                  textShadow: "0 0 10px rgba(255,255,255,0.6)",
                }}
              >
                Coming Soon - Data Migration In Process
              </h1>
            </Col>
          </Row>

          <Row
            className="g-0 w-100 justify-content-center"
            style={{ maxWidth: "700px", height: "auto" }}
          >
            <Col className="position-relative" md={6}>
              <div
                className="h-100 w-100 position-absolute"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.7,
                  zIndex: 1,
                }}
              ></div>
            </Col>
            <Col className="bg-light" md={6}>
              <div
                className="d-flex flex-column justify-content-center px-4 py-3"
                style={{ height: "100%" }}
              >
                <h3 className="text-center mt-3 mb-2 text-dark">Login Form</h3>

                {this.props.error && (
                  <Alert color="danger">{this.props.error}</Alert>
                )}

                <Formik
                  validateOnChange={true}
                  validateOnBlur={true}
                  initialValues={{
                    login_role: "NHS",
                    lab_code: "",
                    username: "",
                    email: "",
                    password: "",
                  }}
                  validationSchema={Yup.object().shape({
                    login_role: Yup.string().required("Login role is required"),
                    username: Yup.string().required("Username is required"),
                    lab_code: Yup.string().when("login_role", {
                      is: "labowner",
                      then: Yup.string().required("Lab Code is required"),
                    }),
                    password: Yup.string()
                      .required("Password is required")
                      .matches(/^\S*$/, "Password must not contain spaces")
                      .when("login_role", {
                        is: "labowner",
                        then: Yup.string()
                          .required("Password is required")
                          .min(6, "Password must be at least 6 characters")
                          .matches(/^\S*$/, "Password must not contain spaces"),
                      }),
                  })}
                  onSubmit={async (values, { setErrors }) => {
                    if (this.state.isLoginInProgress) return;
                    this.setState({ isLoginInProgress: true });

                    try {
                      await this.props.loginUser(values, this.props.history);

                      setTimeout(() => {
                        const success = this.props.success;
                        const error = this.props.error;

                        if (error) {
                          this.props.apiError(error.message);
                          setErrors({ password: "Invalid login credentials" });
                          setTimeout(() => this.props.apiError(null), 240000);
                        } else {
                          const { organization_name } = success;
                          switch (success.account_type) {
                            case "labowner":
                              this.props.history.push(
                                `/${encodeURIComponent(
                                  organization_name
                                )}/dashboard-participant`
                              );
                              break;
                            case "registration-admin":
                              this.props.history.push(
                                `/${encodeURIComponent(
                                  organization_name
                                )}/dashboard-registrationadmin`
                              );
                              break;
                            case "CSR":
                              this.props.history.push(
                                `/${encodeURIComponent(
                                  organization_name
                                )}/register-participant-CSR`
                              );
                              break;
                            case "superadmin":
                              this.props.history.push("/add-organization");
                              break;
                            case "database-admin":
                              this.props.history.push(
                                `/${encodeURIComponent(
                                  organization_name
                                )}/dashboard-databaseadmin`
                              );
                              break;
                            case "organization":
                              this.props.history.push(
                                `/${encodeURIComponent(
                                  organization_name
                                )}/dashboard-organization`
                              );
                              break;
                            default:
                              break;
                          }
                        }
                      }, 1000);
                    } catch (error) {
                      this.props.apiError(error.message);
                      setErrors({
                        password: "Server error or incorrect password",
                      });
                      setTimeout(() => this.props.apiError(null), 240000);
                    } finally {
                      this.setState({ isLoginInProgress: false });
                    }
                  }}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form className="form-horizontal">
                      {/* Role Dropdown */}
                      <div className="mb-3">
                        <Label for="login_role" className="form-label">
                          Login As
                        </Label>
                        <Field
                          as="select"
                          name="login_role"
                          className="form-select"
                          onChange={e => {
                            setFieldValue("login_role", e.target.value);
                            this.setState({ login_role: e.target.value });
                          }}
                        >
                          <option value="NHS">NHS</option>
                          <option value="labowner">Participant</option>
                        </Field>
                      </div>

                      {/* Conditional Fields */}
                      {values.login_role === "labowner" && (
                        <>
                          <div className="mb-3">
                            <Label for="lab_code" className="form-label">
                              Lab Code
                            </Label>
                            <Field
                              name="lab_code"
                              type="text"
                              className={`form-control ${
                                errors.lab_code && touched.lab_code
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="lab_code"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>

                          <div className="mb-3">
                            <Label for="username" className="form-label">
                              Username
                            </Label>
                            <Field
                              name="username"
                              type="text"
                              className={`form-control ${
                                errors.username && touched.username
                                  ? "is-invalid"
                                  : ""
                              }`}
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
                                className={`form-control ${
                                  errors.password && touched.password
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                              <button
                                className="btn btn-light"
                                type="button"
                                onClick={this.togglePasswordVisibility}
                              >
                                <i className="mdi mdi-eye-outline"></i>
                              </button>
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </>
                      )}

                      {values.login_role === "NHS" && (
                        <>
                          <div className="mb-3">
                            <Label for="username" className="form-label">
                              Username or Email
                            </Label>
                            <Field
                              name="username"
                              type="text"
                              className={`form-control ${
                                errors.username && touched.username
                                  ? "is-invalid"
                                  : ""
                              }`}
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
                                className={`form-control ${
                                  errors.password && touched.password
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
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
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </>
                      )}

                      <div className="mb-3">
                        <Link to="/forgot-password" className="text-primary">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-100"
                        style={{ backgroundColor: "#1D1DE4" }}
                      >
                        Login
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
          {/* <Row
            className="mt-1 justify-content-center pt-1"
            style={{ width: "700px", maxWidth: "90%" }}
          >
            <p></p>
          </Row> */}
          <Row
            className="mt-1 justify-content-center pt-6 Laurel-font"
            style={{ width: "700px", maxWidth: "90%" }}
          >
            <Col md={12} className="text-white text-start small">
              <p className="mb-1 fw-bold fs-3 text-left">NHS - NEQAS</p>
              <p className="mb-1 fs-6 text-left">
                Novative Healthtech Solutions (NHS)
              </p>
              <p className="mb-1 fs-6 text-left">
                Atta-ur-Rahman School of Applied Biosciences (ASAB)
              </p>
              <p className="mb-1 fs-6 text-left">
                National University of Sciences & Technology (NUST)
              </p>
              <p className="mb-1 fs-6 text-left">
                Office 4, Sector H-12, Islamabad, PAKISTAN
              </p>
              <p className="mb-0 fs-6 text-left">
                📧{" "}
                <a href="mailto:order@nhs-neqas.com" className="text-white">
                  order@nhs-neqas.com
                </a>
              </p>
            </Col>
          </Row>
        </Container>
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
  history: PropTypes.object,
};

const mapStateToProps = state => {
  console.log("State:", state); // Add your console.log statement here
  const { error, success } = state.Login;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
