import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card, CardBody, Col, Container, Row, Label, Input, Alert 
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// action
import {
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";
// Redux
import { connect } from "react-redux";

class StaffRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
      emailError: null,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.emailError !== this.props.emailError) {
      this.setState({ emailError: this.props.emailError });
    }
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError });
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
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon.className = 'mdi mdi-eye-outline';
    }
  };
  togglePassword1Visibility = () => {
    const passwordInput = document.querySelector('input[name="password2"]');
    const eyeIcon2 = document.getElementById('eye-icon1');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon2.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon2.className = 'mdi mdi-eye-outline';
    }
  };

  render() {
    console.log("Email error received:", this.props.emailError);

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Staff | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Register" breadcrumbItem="Add New Staff" />
            <Row className="justify-content-center">
              <Col lg="8">
                <Card>
                  <CardBody>
                    <div className="mt-4">
                    {this.state.submittedMessage && (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.state.submittedMessage}
                        </Alert>
                      )}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          username: (this.state && this.state.username) || '',
                          email: (this.state && this.state.email) || '',
                          password: (this.state && this.state.password) || '',
                          password2: (this.state && this.state.password2) || '',
                          account_type: (this.state && this.state.account_type) || 'CSR',
                          name: (this.state && this.state.name) || '',
                          cnic: (this.state && this.state.cnic) || '',
                          phone: (this.state && this.state.phone) || '',
                          city: (this.state && this.state.city) || '',
                          photo: (this.state && this.state.photo) || '',
                          added_by: localStorage.getItem("authUser")
                          ? JSON.parse(localStorage.getItem("authUser")).user_id
                          : '',
                        }}
                        
                        validationSchema={Yup.object().shape({
                          username: Yup.string()
                            .trim()
                            .required("Please enter your username"),
                          password: Yup.string().required(
                            "Please enter your password"
                          ),
                          name: Yup.string()
                            .trim()
                            .required("Please enter name"),
                          cnic: Yup.string()
                            .required("Please enter your CNIC")
                            .matches(
                              /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                              "Please enter a valid CNIC e.g. 37106-8234782-3"
                            ),
                          email: Yup.string()
                            .required("Please enter your email")
                            .email("Please enter valid email"),
                          phone: Yup.string()
                            .required("Please enter phone")
                            .matches(
                              /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                              "Please enter a valid Pakistani phone number e.g. 03123456789"
                            ),
                          photo: Yup.string().required("Please upload photo"),
                          password2: Yup.string()
                            .required("Please re-enter your password")
                            .when("password", {
                              is: val => (val && val.length > 0 ? true : false),
                              then: Yup.string().oneOf(
                                [Yup.ref("password")],
                                "Both password need to be the same"
                              ),
                            }),
                            city: Yup.string().trim().required('Please enter city'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                          this.props.registerUser(values)
                        
                          setTimeout(() => {
                            if (
                              !this.state.usernameFieldError &&
                              !this.state.passwordFieldError &&
                              !this.state.incompleteRegistrationError
                            ) {
                              this.setState({
                                submittedMessage:
                                  'Staff added  successfully.',
                              });
                              setTimeout(() => {
                                this.setState({ submittedMessage: '' });
                                resetForm(); // Reset form fields after the success message disappears
                              }, 2000);
                            }
                          }, 1000); // Initial 1 second delay
                        }}
                    
                      >
                      
                       {({ setFieldValue, errors, touched }) => (
                          <Form className="form-horizontal">
                            
                            <div className="mb-3">
                              <Label for="account_type" className="form-label">
                                Account type
                              </Label>
                              <Field
                                name="account_type"
                                component="select"
                                className="form-select"
                              >
                                <option value="CSR">CSR</option>
                                <option value="database-admin">Database Admin</option>
                                <option value="registration-admin">
                                  Registration Admin
                                </option>

                              </Field>
                            </div>
                            {/* Username field */}

                            <div className="mb-3">
                              <Label className="form-label">Name</Label>
                              <Field
                                name="name"
                                type="text"
                                placeholder="Enter name"
                                className={
                                  'form-control' + (errors.name && touched.name ? ' is-invalid' : '')
                                }
                              />
                              <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Field
                                name="email"
                                type="text"
                                placeholder="Enter email"
                                className={
                                  'form-control' +
                                  ((errors.email && touched.email)
                                    ? ' is-invalid'
                                    : '')
                                }
                              />
                              <ErrorMessage name="email" component="div" className="invalid-feedback" />
                         
                              {this.state.emailError && (
                                <div className="invalid-feedback d-block">
                                  {this.state.emailError}
                                </div>
                              )}
        
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Mobile No.</Label>
                              <Field
                                name="phone"
                                type="text"
                                placeholder="Enter mobile no."
                                className={
                                  'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')
                                }
                              />
                              <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">CNIC</Label>
                              <Field
                                name="cnic"
                                type="text"
                                placeholder="Enter mobile no."
                                className={
                                  'form-control' + (errors.cnic && touched.cnic ? ' is-invalid' : '')
                                }
                              />
                              <ErrorMessage
                                name="cnic"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="mb-3">
                              <Label for="photo" className="form-label">
                                Photo
                              </Label>
                              <Input
                                id="formFile"
                                name="photo"
                                placeholder="Choose image"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => setFieldValue('photo', e.target.files[0])}
                                className={
                                  'form-control' + (errors.photo && touched.photo ? ' is-invalid' : '')
                                }
                              />
                              <ErrorMessage name="photo" component="div" className="invalid-feedback" />
                            </div>

                            <div className="mb-3">
                              <Label for="city" className="form-label">
                                City
                              </Label>
                              <Field
                                name="city"
                                type="text"
                                placeholder="Enter city"
                                className={
                                  'form-control' + (errors.city && touched.city ? ' is-invalid' : '')
                                }
                              />
                              <ErrorMessage name="city" component="div" className="invalid-feedback" />
                            </div>

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
                              <div className="input-group">
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Enter password"
                                  autoComplete="on"
                                  className={
                                    'form-control' +
                                    ((errors.password && touched.password) || this.state.passwordFieldError
                                      ? ' is-invalid'
                                      : '')
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i id="eye-icon" className="mdi mdi-eye-outline"></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage name="password" component="div" className="invalid-feedback" />
                              <div className="invalid-feedback">
                                {this.state.passwordFieldError}
                              </div>

                              <div className="mt-2 input-group">
                                <Field
                                  name="password2"
                                  type="password"
                                  placeholder="Re-enter password"
                                  autoComplete="on"
                                  className={
                                    'form-control' +
                                    (errors.password2 && touched.password2 ? ' is-invalid' : '')
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePassword1Visibility}
                                  >
                                    <i id="eye-icon1" className="mdi mdi-eye-outline"></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage name="password2" component="div" className="invalid-feedback" />
                            </div>


                            <Row>
                              <Col>
                                <div className="text-end">
                                  <button
                                    type="submit"
                                    className="btn btn-primary save-user"
                                  >
                                    Save 
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </div>
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
StaffRegister.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
  emailError: PropTypes.any,
};
const mapStateToProps = ({ Account }) => ({
  emailError: Account.emailError,
  userAccountType: Account.userAccountType,
  loading: Account.loading,
  incompleteRegistrationError: Account.incompleteRegistrationError,
  passwordError: Account.passwordError,
  userID: Account.userID,
  usernameError: Account.usernameError,
});
const mapDispatchToProps = (dispatch) => {
  return {
    apiError: (error) => dispatch(apiError(error)),
    registerUser: (user) => dispatch(registerUser(user)),
    registerUserFailed: (error) => dispatch(registerUserFailed(error)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StaffRegister);