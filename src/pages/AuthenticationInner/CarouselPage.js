import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Col } from "reactstrap";

export default class CarouselPage extends Component {
  render() {
    return (
      <React.Fragment>
        <Col md={6} lg={6} xl={6} className="auth-bg-color">
          <div className="auth-full-bg pt-lg-5 p-4">
            <div className="w-100">
              <div className="bg-overlay"></div>
              <div className="d-flex h-100 flex-column">
                <div className="p-4 mt-5">
                  <div className="row justify-content-center">
                    <div className="col-lg-7">
                      {window.location.href.includes("login") && (
                        <div className="text-center">
                          <h3 className="mb-3">
                            <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                            <span className="text-primary">Welcome on </span>{" "}
                            Board
                          </h3>
                          <div>
                            <div>
                              <div className="R-content">
                                <div className="py-3">
                                  <p className="font-size-16 mb-4">
                                    &quot;Please ensure your email has been
                                    verified and your account has been approved
                                    by Lab Hazir before you attempt to Login.
                                    &ldquo;
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-size-16 text-primary">
                                - Team Lab Hazir
                              </h4>
                            </div>
                          </div>
                        </div>
                      )}

                      {window.location.href.includes("register") && (
                        <div className="text-center">
                          <h4 className="mb-3">
                            <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                            <span className="text-primary">Registration</span>{" "}
                            Process
                          </h4>
                          <div>
                            <div>
                              <div className="R-content">
                                <div className="ml-auto">
                                  <p className="font-size-15 mb-4">
                                    &quot;We have two steps registration process
                                    for all types of accounts.<br></br>
                                    <br></br>
                                    <h5 className="text-primary">Step 1:</h5>
                                    This is a common page and requires unique
                                    username, unique email and password from
                                    you.
                                    <br></br>
                                    <br></br>
                                    <h5 className="text-primary">NOTE:</h5>Each
                                    type of user will be the admin of his
                                    respective account.
                                    <br></br>
                                    <br></br>
                                    Please fill the required information and
                                    select NEXT button to proceed.&ldquo;
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-size-16 text-primary">
                                  - Team Lab Hazir
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {window.location.href.includes("lab-information") && (
                        <div className="text-center">
                          <h4 className="mb-3">
                            <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                            <span className="text-primary">Registration</span>{" "}
                            Process
                          </h4>
                          <div>
                            <div>
                              <div className="R-content">
                                <div className="py-3">
                                  <p className="font-size-15 mb-4">
                                    &quot;We have two steps registration process
                                    for all types of accounts.<br></br>
                                    <br></br>
                                    <h5 className="text-primary">Step 2:</h5>
                                    This page requires more detailed information
                                    about Laboratory, please ensure that Lab is
                                    registered on Google Map and the address
                                    entered here is same as on google map, so
                                    that it is searchable for the patients.
                                    <br></br>
                                    <br></br>
                                    When Step 2 is completed, check your email
                                    and click on the verification link to verify
                                    your account. <br></br>
                                    <br></br>
                                    <h5 className="text-primary">NOTE:</h5> If
                                    marketer is registering your account. Please
                                    log in and change password afterwards.
                                    &ldquo;
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-size-16 text-primary">
                                - Team Lab Hazir
                              </h4>
                              <p className="font-size-14 mb-0"></p>
                            </div>
                          </div>
                        </div>
                      )}

                      {window.location.href.includes("patient-information") ||
                        (window.location.href.includes(
                          "b2bclient-information"
                        ) && (
                          <div className="text-center">
                            <h4 className="mb-3">
                              <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                              <span className="text-primary">Registration</span>{" "}
                              Process
                            </h4>
                            <div>
                              <div>
                                <div className="R-content">
                                  <div className="py-3">
                                    <p className="font-size-15 mb-4">
                                      &quot;We have two steps registration
                                      process for all types of accounts.
                                      <br></br>
                                      <br></br>
                                      <h5 className="text-primary">Step 2:</h5>
                                      When Step 2 is completed, please check
                                      your email and click on the verification
                                      link to verify your account. &ldquo;
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-size-16 text-primary">
                                  - Team Lab Hazir
                                </h4>
                              </div>
                            </div>
                          </div>
                        ))}

                      {window.location.href.includes("forgot-password") && (
                        <div className="text-center">
                          <h4 className="mb-3">
                            <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                            <span className="text-primary">Forget</span>{" "}
                            Password
                          </h4>
                          <div>
                            <div className="item">
                              <div className="py-3">
                                <div className="R-content">
                                  <p className="font-size-16 mb-4">
                                    &quot;If you have lost your Password or wish
                                    to reset it. Please enter your email. <br />
                                    <br />
                                    You will recive a link to create your new
                                    password shortly. &ldquo;
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    - Team Lab Hazir
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {window.location.href.includes("confirm-password") && (
                        <div className="text-center">
                          <h4 className="mb-3">
                            <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                            <span className="text-primary">Confirm</span>{" "}
                            Password
                          </h4>
                          <div>
                            <div>
                              <div className="item">
                                <div className="py-3">
                                  <div className="R-content">
                                    <p className="font-size-16 mb-4">
                                      &quot;You are just one step away from
                                      getting your account back.
                                      <br />
                                      <br /> Enter your new password and confirm
                                      it to reset your new passowrd. &ldquo;
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-size-16 text-primary">
                                      - Team Lab Hazir
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}
