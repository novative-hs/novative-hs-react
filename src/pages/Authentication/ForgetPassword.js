import PropTypes from "prop-types";
import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Alert, Card, CardBody, Col, Container, Label, Row } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// action
import { userForgetPassword } from "../../store/actions";

// import CarouselPage from "../AuthenticationInner/CarouselPage";
import sideimg from "../../../src/assets/images/f1.jpg";
import sideimg1 from "../../../src/assets/images/f2.jpg";
import sideimg3 from "../../../src/assets/images/sideimg3.jpg";
import bgimg from "../../../src/assets/images/b.jpg";
import lightblue from "../../../src/assets/images/lightblue.jpg";
import newbg from "../../../src/assets/images/newimg.jpg";
import sideimg5 from "../../../src/assets/images/sideimg.jpg";
import forgetpass1 from "../../../src/assets/images/forgetpass1.jpg";
import forgetpass2 from "../../../src/assets/images/forgetpass2.jpg";


class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleLoginClick = () => {
    window.location.href = "/login";
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Forget Password</title>
          </MetaTags>
          <Container
            fluid
            className="p-0 fw-bold d-flex align-items-center justify-content-center "
            style={{
              height: "100vh",
              // backgroundColor: "#1a53ff",

              // opacity: 0.7,
            }}
          >
            {/* Use the video element for the background */}
            {/* <video
              autoPlay
              loop
              muted
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: -1,
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
            
            {/* Background overlay with opacity */}
            <div
          
              className="w-100 h-100"
              style={{
                backgroundImage: `url(${bgimg})`,
                backgroundSize: "cover", // Ensure the image covers the entire container
                backgroundPosition: "center",
                // backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity here
                zIndex: 0,
                opacity: 0.9,
              }}
            ></div>
            
            <div className="w-75 position-absolute " style={{}}>
              <Row className="g-0 justify-content-center">
                {/* <CarouselPage /> */}
                <Col className="position-relative" md={6} lg={6} xl={6}>
                  <div
                    className="w-100 position-absolute "
                    style={{
                      backgroundImage: `url(${forgetpass2})`,
                      backgroundSize: "cover", // Ensure the image covers the entire container
                      backgroundPosition: "center",
                      opacity: 0.5, // Control the background image opacity
                      zIndex: 1, // Keep it behind the text
                      height:"100%",

                    }}
                    
                  ></div>
                  {/* <h4 className="text-light position-absolute z-2 top-50 start-50 translate-middle">Reset Your Password</h4> */}
                  
                </Col>

                <Col sm={6} md={6} lg={6} xl={6} className="">
                  <div className=" bg-light p-md-5 p-4">
                    <div className="w-100 mt-5">
                      <div className="d-flex flex-column justify-content-center w-100">
                        <div>
                          <h5 className="text-primary">Forget password</h5>
                          <p className="text-muted">
                            Do not worry, we will get back you to your account.
                          </p>
                        </div>

                        <div className="mt-4 ">
                          {this.props.forgetError && (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.forgetError}
                            </Alert>
                          )}

                          {this.props.forgetSuccessMsg && (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              {this.props.forgetSuccessMsg}
                            </Alert>
                          )}
                          <div className="">
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
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                          <div className="mt-5 text-center">
                            <p>
                              Go back to{" "}
                              <span
                                className="fw-medium text-primary"
                                onClick={this.handleLoginClick}
                                style={{ cursor: "pointer" }}
                              >
                                Login
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.func,
  forgetSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userForgetPassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userForgetPassword })(ForgetPasswordPage)
);
