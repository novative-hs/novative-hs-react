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

// Define validation
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      guest_id: "",
      submittedMessage: null,
      // isForgotPasswordModalOpen: false,
      email: "",
    };

    // this.togglePermissionModal = this.togglePermissionModal.bind(this);
  }

  // toggleForgotPasswordModal = () => {
  //   this.setState(prevState => ({
  //     isForgotPasswordModalOpen: !prevState.isForgotPasswordModalOpen,
  //   }));
  // };

  //************** */
  // togglePermissionModal = () => {
  //   this.setState(prevState => ({
  //     PermissionModal: !prevState.PermissionModal,
  //   }));
  //   this.state.btnText === "Copy"
  //     ? this.setState({ btnText: "Copied" })
  //     : this.setState({ btnText: "Copy" });
  // };

  componentDidMount() {
    const url = window.location.href;


    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }

    if (localStorage.getItem("authUser")) {
      this.props.history.push("/logout");
    }
    this.props.apiError("");
    // console.log("finalurl in the app", finalUrl, this.state.finalUrl)
    console.log("guest_id", this.props.match.params.guest_id);
  }

  removeAttributes(element, ...attrs) {
    attrs.forEach(attr => element.removeAttribute(attr));
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
  render() {
    const isLargeScreen = window.innerWidth > 470;

    // const backdropStyle = {
    //   position: "fixed",
    //   top: 0,
    //   left: 0,
    //   width: "100%",
    //   height: "100%",
    //   backgroundColor: "rgba(0, 0, 0, 0.8)", // or any value between 0 and 1
    //   zIndex: 9999,
    //   display: this.state.PermissionModal ? "block" : "none",
    // };

    // const modalStyle = {
    //   position: "fixed",
    //   top: "50%",
    //   left: "50%",
    //   transform: "translate(-50%, -50%)",
    //   backgroundColor: "white",
    //   padding: "20px",
    //   width: "500px", // Increase width
    //   height: "400px", // Increase height
    //   zIndex: 10000,
    //   display: this.state.PermissionModal ? "block" : "none",
    // };

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Login | NHS NEQAS</title>
          </MetaTags>
          <Container
            fluid
            className="p-0 fw-bold d-flex align-items-center justify-content-center "
            style={{
              height: "100vh",
              // backgroundColor: "#1a53ff",
              backgroundImage: `url(${bgimg})`,
              backgroundSize: "cover", // Ensure the image covers the entire container
              backgroundPosition: "center",
            }}
          >
            <Row className="g-0 w-75 h-85">
              <Col className="position-relative" md={6} lg={6} xl={6}>
                <div
                  className="h-100 w-100 position-absolute"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover", // Ensure the image covers the entire container
                    backgroundPosition: "center",
                    opacity: 0.7, // Control the background image opacity
                    zIndex: 1, // Keep it behind the text
                  }}
                ></div>
                
              </Col>
              <Col className="bg-light " md={6} lg={6} xl={6}>
                <div className="d-flex flex-column justify-content-center h-100 px-5 py-5">
                  <h2 className="text-center mt-3 mb-2 text-dark">
                    Login Form
                  </h2>

                  {/* <div className="d-flex justify-content-between mb-3">
                    <div className="flex-fill me-2">
                      <Button
                        className="w-100 "
                        style={{ backgroundColor: "#1D1DE4" }}
                      >
                        Login
                      </Button>
                    </div>
                    <div className="flex-fill ms-2">
                      <Link to="/register">
                        <Button
                          className="w-100 "
                          // style={{ backgroundColor: "#0000CD" }}
                        >
                          Signup
                        </Button>
                      </Link>
                    </div>
                  </div> */}
                  <div className="mt-4">
                    {this.props.error && this.props.error && (
                      <Alert color="danger">{this.props.error}</Alert>
                    )}
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        username: "",
                        password: "",
                        account_type: "",
                      }}
                      validationSchema={Yup.object().shape({
                        username: Yup.string().required(
                          "Please enter your username or email"
                        ),
                        password: Yup.string().required(
                          "Please enter your password"
                        ),
                      })}
                      onSubmit={async values => {
                        // Check if login is already in progress
                        if (this.state.isLoginInProgress) {
                          return;
                        }

                        // Set the flag to indicate login is in progress
                        this.setState({ isLoginInProgress: true });

                        try {
                          // Call loginUser asynchronously
                          await this.props.loginUser(
                            values,
                            this.props.history
                          );

                          // Handle success logic if needed

                          setTimeout(() => {
                            const success = this.props.success;
                            console.log("success msj", success)
                            const error = this.props.error;
                            if (error) {
                              // Handle the error without triggering redirection
                              console.error("Error:", error);
                              this.props.apiError(error.message); // Dispatch the error message to state

                              // Automatically remove the error message after 4 minutes (240,000 milliseconds)
                              setTimeout(() => {
                                this.props.apiError(null); // Clear the error message
                              }, 240000);
                            } else {
                              // No error, redirect logic here
                              const isLargeScreen = window.innerWidth > 470;

                              if (success.account_type === "labowner") {
                                const { organization_name } = success;
                                   this.props.history.push(`/${encodeURIComponent(organization_name)}/dashboard-participant`);
                              } else if (
                                success.account_type === "registration-admin"
                              ) {
                                const { organization_name } = success;
                                this.props.history.push(`/${encodeURIComponent(organization_name)}/dashboard-registrationadmin`);
                              }  else if (
                                success.account_type === "CSR"
                              ) {
                                const { organization_name } = success;
                                this.props.history.push(`/${encodeURIComponent(organization_name)}/register-participant-CSR`);
                              } else if (
                                success.account_type === "superadmin"
                              ) {
                                this.props.history.push("/add-organization");
                              } else if (
                                success.account_type === "database-admin"
                              ) {
                                const { organization_name } = success;
                                this.props.history.push(`/${encodeURIComponent(organization_name)}/dashboard-databaseadmin`);
                              } else if (
                                success.account_type === "organization"
                              ) {
                                const { organization_name } = success;
                                this.props.history.push(`/${encodeURIComponent(organization_name)}/dashboard-organization`);
                              }
                            }
                          }, 1000);
                        } catch (error) {
                          // Handle the error without triggering redirection
                          console.error("Error:", error);
                          this.props.apiError(error.message); // Dispatch the error message to state

                          // Automatically remove the error message after 4 minutes (240,000 milliseconds)
                          setTimeout(() => {
                            this.props.apiError(null); // Clear the error message
                          }, 240000);
                        } finally {
                          // Reset the flag after login attempt
                          this.setState({ isLoginInProgress: false });
                        }
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
                                  (errors.password && touched.password
                                    ? " is-invalid"
                                    : "")
                                }
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

                          <div className="mb-3">
                            <Link
                              to="/forgot-password"
                              className="text-primary"
                            >
                              <i className="mdi mdi-lock me-1" /> Forgot your
                              password?
                            </Link>
                          </div>

                          <Button
                            type="submit"
                            // color="primary"

                            className="w-100"
                            style={{
                              backgroundColor: "#1D1DE4", // Change background color based on state
                              // color: "#ffffff", // Ensure text color is readable on custom background
                              // borderColor: "#007bff", // Optionally, set the border color
                            }}
                          >
                            Login
                          </Button>

                          {/* <div className="mt-3 text-center">
                            {!isLargeScreen && this.state.finalUrl ? (
                              <p>
                                Do not have an account?{" "}
                                <Link
                                  to={
                                    this.state.finalUrl
                                      ? `/register/${this.state.finalUrl}`
                                      : "/register"
                                  }
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
                          </div> */}
                        </Form>
                      )}
                    </Formik>

                    {/* <div className="mb-3 text-center">
                      <button
                        onClick={this.toggleForgotPasswordModal}
                        className="btn btn-link text-primary"
                      >
                        <i className="mdi mdi-lock me-1" /> Forgot your
                        password?
                      </button>
                    </div> */}
                  </div>

                  {/* <Modal
                    isOpen={this.state.isForgotPasswordModalOpen}
                    toggle={this.toggleForgotPasswordModal}
                  >
                    <ModalHeader toggle={this.toggleForgotPasswordModal}>
                      Forgot Password
                    </ModalHeader>
                    <ModalBody>
                      <div className="">
                       
                        <div className="p-2">
                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              email: (this.state && this.state.email) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              email: Yup.string().required(
                                "Please enter your email"
                              ),
                            })}
                            onSubmit={values => {
                              console.log("error", )
                              this.props.userForgetPassword(
                                values,
                                this.props.history
                              );
                              window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                              });
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    name="email"
                                    type="text"
                                    onChange={(e) => this.setState({ email: e.target.value })}

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
                                <div className="text-end">
                                  <button
                                    className="btn btn-primary w-md"
                                    type="submit"
                                    disabled={this.props.forgetSuccessMsg}
                                    onClick={this.handleResetButtonClick}
                                  >
                                    Reset
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                        
                        {this.props.forgetError && this.props.forgetError &&(
                          <Alert color="danger">{this.props.forgetError}</Alert>
                        )}
                     
                        {this.props.forgetSuccessMsg && this.props.forgetSuccessMsg && (
                          <Alert color="success">
                            {this.props.forgetSuccessMsg}
                          </Alert>
                        )}
                      </div>
                    </ModalBody>
                  </Modal> */}
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

  history: PropTypes.object,
};

// const mapStateToProps = state => {
//   const { error, success, forgetError, forgetSuccessMsg } = state.Login;
//   return { error, success, forgetError, forgetSuccessMsg };
// };
const mapStateToProps = state => {
  console.log("State:", state); // Add your console.log statement here
  const { error, success } = state.Login;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
