import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row,
  Label,
  Alert,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import backgroundImage from "../../../src/assets/images/sideimg.jpg";
import bgimg from "../../../src/assets/images/b.jpg";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import logo from "../../../src/assets/images/LogoNeqas.jpg";

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

// Define validation schema

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      // emailFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
    };
  }

  componentDidMount() {
    const url = window.location.href;
    const queryString = url.includes("&")
      ? url.substring(url.indexOf("&") + 1)
      : "";
    console.log(queryString);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params);
    const latitudeFromUrl = params.get("lat");
    const longitudeFromUrl = params.get("lon");

    console.log("Latitude:", latitudeFromUrl);
    console.log("Longitude:", longitudeFromUrl);
    if (latitudeFromUrl && longitudeFromUrl) {
      const url = `http://localhost:3000/nearby-labs/&lat=${latitudeFromUrl}&lon=${longitudeFromUrl}`;
      const queryString = url.substring(url.indexOf("&") + 1);
      const finalUrl = "&" + queryString; // Remove the leading question mark ('?')
      this.setState({ finalUrl: finalUrl });
      console.log("differ with the final url state:", this.state.finalUrl);

      console.log(finalUrl);
      console.log("whsuqi", this.props.match.params.uuid);
    }
    console.log("uuid", this.props.match.params.uuid);
    console.log("guest_id", this.props.match.params.guest_id);

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
  togglePassword2Visibility = () => {
    const passwordInput = document.querySelector('input[name="password2"]');
    const eyeIcon2 = document.getElementById("eye-icon2");

    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon2.className = "mdi mdi-eye-off-outline";
    } else if (passwordInput) {
      passwordInput.type = "password";
      eyeIcon2.className = "mdi mdi-eye-outline";
    }
  };
  //*********************** */
  // handleSubmit = (values, { setSubmitting }) => {
  //   // Simulate form submission logic
  //   console.log("Form submitted with:", values);

  //   // Simulate async operation (e.g., API call)
  //   setTimeout(() => {
  //     setSubmitting(false); // Reset form submission state
  //   }, 1000);
  // };
  render() {
    const isLargeScreen = window.innerWidth > 470;
    if (this.props.userID) {
      if (this.props.userAccountType == "patient") {
        if (
          !this.props.match.params.uuid &&
          !this.props.match.params.guest_id
        ) {
          return (
            <Redirect
              to={{
                pathname: "/patient-information/" + this.props.userID,
                state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
              }}
            />
          );
        } else if (
          this.props.match.params.guest_id &&
          this.props.match.params.uuid
        ) {
          return (
            <Redirect
              to={{
                pathname:
                  "/patient-information/" +
                  this.props.userID +
                  "/" +
                  this.props.match.params.guest_id +
                  "/" +
                  this.props.match.params.uuid,
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
                  this.props.match.params.guest_id,
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
      } else if (this.props.userAccountType == "donor") {
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
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
            />
            <title>Register | NHS NEQAS</title>
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
            <Row className="g-0 w-75 ">
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
                <div className="h-100 w-100 position-absolute p-3 z-2 d-flex ">
                  <img
                    src={logo}
                    alt="Logo"
                    className="mr-3 align-self-end" // Add margin-right for spacing between the logo and text
                    style={{ width: "30%", height: "13%" }} // Adjust logo size
                  />
                  {/* <p className="text-light position-absolute align-self-endalign-self-end">
                    We have a two-step registration process for all types of
                    accounts. We have a two-step registration process for all
                    types of accounts. We have a two-step registration process
                    for all types of accounts. We have a two-step registration
                    process for all types of accounts.
                  </p> */}
                </div>
              </Col>
              <Col className="bg-light " md={6} lg={6} xl={6}>
                <div className="d-flex flex-column justify-content-center h-100  p-5">
                  <h2 className="text-center mt-3 mb-3 text-dark">
                    Signup Form
                  </h2>

                  <div className="p-2 d-flex justify-content-between">
                    <div className="flex-fill me-2">
                      {" "}
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/login/${this.props.match.params.uuid}`
                            : `/login`
                        }
                      >
                        <Button className="w-100">Login</Button>
                      </Link>
                    </div>
                    <div className="flex-fill ms-2">
                      <Button
                        className="w-100"
                        style={{ backgroundColor: "#1D1DE4" }}
                      >
                        {" "}
                        Signup
                      </Button>
                    </div>
                  </div>
                  <div className="py-3">
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        username: "",
                        password: "",
                        account_type: "",

                        password2: "",
                      }}
                      // validationSchema={loginSchema}
                      validationSchema={Yup.object().shape({
                        username: Yup.string()
                          .trim()
                          .required("Please enter your username"),
                        // name: Yup.string()
                        //   .trim()
                        //   .required("Please enter your name"),

                        // email: Yup.string()
                        //   .required("Please enter your email")
                        //   .email("Please enter valid email"),
                        password: Yup.string()
                          .required("Please enter your password")
                          .matches(
                            /^(?=.*\d).{5,}$/, // Regex to enforce at least 8 characters in password
                            "Password must contain at least 5 characters and one numeric digit."
                          ),
                        password2: Yup.string()
                          .required("Please re-enter your password")
                          .when("password", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: Yup.string().oneOf(
                              [Yup.ref("password")],
                              "Both password need to be the same"
                            ),
                          }),
                      })}
                      onSubmit={values => {
                        this.props.registerUser(values);
                        // console.log(window.location.href)
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                        // If no error messages then show wait message
                        setTimeout(() => {
                          if (
                            !this.state.usernameFieldError &&
                            !this.state.passwordFieldError &&
                            // !this.state.emailFieldError &&
                            !this.state.incompleteRegistrationError
                          ) {
                            this.setState({
                              submittedMessage:
                                "Please wait for a while we are processing. Thank you for your patience.",
                            });
                          }
                        }, 1000);
                        console.log("submit", values);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form>
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
                            <div>
                              <div className="input-group auth-pass-inputgroup">
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Enter password"
                                  autoComplete="on"
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
                                {errors.password && touched.password && (
                                  <div className="invalid-feedback">
                                    Password must contain at least 8 characters
                                    and one numeric digit.
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="input-group auth-pass-inputgroup">
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
                                <button
                                  className="btn btn-light"
                                  type="button"
                                  id="password2-addon" // Unique ID for the eye icon of password2
                                  onClick={this.togglePassword2Visibility} // Updated function name
                                >
                                  <i
                                    id="eye-icon2"
                                    className="mdi mdi-eye-outline"
                                  ></i>{" "}
                                  {/* Updated ID for the eye icon */}
                                </button>
                              </div>
                              <ErrorMessage
                                name="password2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
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
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block"
                              type="submit"
                              disabled={this.state.submittedMessage}
                              style={{
                                backgroundColor: "#1D1DE4",
                              }}
                            >
                              {" "}
                              Next{" "}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
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
