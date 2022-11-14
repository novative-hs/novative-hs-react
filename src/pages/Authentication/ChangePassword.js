import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// action
import { userChangePassword } from "store/auth/changepwd/actions";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      old_password: "",
      new_password: "",
      new_password2: "",
      passwordFieldError: "",
      changeSuccessMsg: "",
    };
  }

  render() {
    // const { onAddNewComplaint } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Lab Hazir | Change Password</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Account" breadcrumbItem="Change Password" />
            {this.state.changeSuccessMsg && (
              <Alert color="success" className="col-md-9">
                {this.state.changeSuccessMsg}
              </Alert>
            )}

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        old_password:
                          (this.state && this.state.old_password) || "",
                        new_password:
                          (this.state && this.state.new_password) || "",
                        new_password2:
                          (this.state && this.state.new_password2) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        old_password: Yup.string().required(
                          "Please enter your old password"
                        ),
                        new_password: Yup.string().required(
                          "Please enter your new password"
                        ),
                        new_password2: Yup.string()
                          .required("Please re-enter your new password")
                          .when("new_password", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: Yup.string().oneOf(
                              [Yup.ref("new_password")],
                              "Both password need to be the same"
                            ),
                          }),
                      })}
                      onSubmit={values => {
                        this.props.userChangePassword(values);

                        setTimeout(() => {
                          this.setState({
                            passwordFieldError: this.props.changeError,
                            changeSuccessMsg: this.props.changeSuccessMsg,
                          });
                        }, 1000);

                        setTimeout(() => {
                          this.setState({
                            changeSuccessMsg: "",
                          });

                          values.old_password = "";
                          values.new_password = "";
                          values.new_password2 = "";
                          this.props.history.push("/change-password");
                        }, 5000);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal">
                          <div className="mb-3">
                            <Label className="form-label">Old Password</Label>
                            <div>
                              <Field
                                name="old_password"
                                type="password"
                                placeholder="Enter your old password"
                                autoComplete="on"
                                onFocus={() => {
                                  this.setState({
                                    passwordFieldError: null,
                                  });
                                }}
                                className={
                                  "form-control" +
                                  ((errors.old_password &&
                                    touched.old_password) ||
                                  this.state.passwordFieldError
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="old_password"
                                component="div"
                                className="invalid-feedback"
                              />

                              <div className="invalid-feedback">
                                {this.state.passwordFieldError}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label className="form-label">New Password</Label>
                            <div>
                              <Field
                                name="new_password"
                                type="password"
                                placeholder="Enter your new password"
                                autoComplete="on"
                                onFocus={() => {
                                  this.setState({
                                    passwordFieldError: null,
                                  });
                                }}
                                className={
                                  "form-control" +
                                  (errors.new_password && touched.new_password
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="new_password"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="mt-2">
                              <Field
                                name="new_password2"
                                type="password"
                                placeholder="Re-enter your new password"
                                autoComplete="on"
                                className={
                                  "form-control" +
                                  (errors.new_password2 && touched.new_password2
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="new_password2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          <div className="text-end">
                            <button
                              className="btn btn-primary w-md"
                              type="submit"
                              disabled={this.state.changeSuccessMsg}
                            >
                              Done
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ChangePassword.propTypes = {
  match: PropTypes.object,
  changeError: PropTypes.any,
  changeSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userChangePassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { changeError, changeSuccessMsg } = state.ChangePassword;
  return { changeError, changeSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userChangePassword })(ChangePassword)
);
