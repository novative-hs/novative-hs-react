import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Container, Row, Label, Alert ,TabContent, TabPane, Input,   Nav,
  NavItem,
  NavLink,} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import classnames from "classnames";
// action
import {

  registerOrganization,
  registerOrganizationFailed,
} from "../../store/organization/actions";

// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class OrganizationRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFieldError: null,
      emailError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
      activeTab: "tab1",
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
    };
  }
  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };


  componentDidUpdate(prevProps) {
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError });
    }
    if (prevProps.emailError !== this.props.emailError) {
      this.setState({ emailError: this.props.emailError });
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
    if (this.props.userID) {
     console.log("the id from the props is :", this.props.userID)
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Organization</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Organization" breadcrumbItem="Register" />
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

                      {/* {this.state.incompleteRegistrationError && (
                        <div>
                          <Alert color="danger" style={{ marginTop: "13px" }}>
                            Your registration process was{" "}
                            <strong>
                              incomplete last time when you registered
                            </strong>
                            . If you want to
                            regispatient-information/113893749834ter now, please
                            click on <strong>Next</strong> button once again.
                          </Alert>
                          <Alert color="info" style={{ marginTop: "13px" }}>
                            After completing the step 2 of registration, please
                            make sure to{" "}
                            <strong>
                              verify your account on new verification email
                            </strong>{" "}
                            you will receive from us and{" "}
                            <strong>ignore the old one</strong> (if any) you
                            have received last time.
                          </Alert>
                        </div>
                      )} */}
 
 <Formik
        enableReinitialize={true}
        initialValues={{
          username: (this.state && this.state.username) || '',
          password: (this.state && this.state.password) || '',
          password2: (this.state && this.state.password2) || '',
          account_type: 'organization',
          name: (this.state && this.state.name) || '',
          email: (this.state && this.state.email) || '',
          website: (this.state && this.state.website) || '',
          city: (this.state && this.state.city) || '',
          country: (this.state && this.state.country) || '',
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().trim().required('Please enter your username'),
          password: Yup.string().required('Please enter your password'),
          password2: Yup.string()
            .required('Please re-enter your password')
            .oneOf([Yup.ref('password')], 'Both passwords need to be the same'),
          name: Yup.string().trim().required('Please enter name'),
          email: Yup.string()
            .required('Please enter your email')
            .email('Please enter valid email'),
          
        })}
        onSubmit={(values, { resetForm }) => {
          this.props.registerOrganization(values);
        
          setTimeout(() => {
            if (
              !this.state.usernameFieldError &&
              !this.state.passwordFieldError &&
              !this.state.incompleteRegistrationError
            ) {
              this.setState({
                submittedMessage: 'Organization data has been submitted successfully.',
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
              <Label className="form-label">Website</Label>
              <Field
                name="website"
                type="text"
                placeholder="Enter mobile no."
                className={
                  'form-control' + (errors.website && touched.website ? ' is-invalid' : '')
                }
              />
              <ErrorMessage name="website" component="div" className="invalid-feedback" />
            </div>


            <div className="mb-3">
              <Label for="country" className="form-label">
                Country
              </Label>
              <Field
                name="country"
                type="text"
                placeholder="Enter country"
                className={
                  'form-control' + (errors.country && touched.country ? ' is-invalid' : '')
                }
              />
              <ErrorMessage name="country" component="div" className="invalid-feedback" />
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
                className={
                  'form-control' +
                  ((errors.username && touched.username) || this.state.usernameFieldError
                    ? ' is-invalid'
                    : '')
                }
              />
              <ErrorMessage name="username" component="div" className="invalid-feedback" />
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
                    disabled={this.state.submittedMessage}
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

OrganizationRegister.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  registerOrganization: PropTypes.func,
  registerOrganizationFailed: PropTypes.any,
  emailError: PropTypes.any,
  usernameError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
};

const mapStateToProps = ({  organizationaccount }) => ({
  userAccountType: organizationaccount.userAccountType,
  loading: organizationaccount.loading,
  incompleteRegistrationError: organizationaccount.incompleteRegistrationError,
  passwordError: organizationaccount.passwordError,
  userID: organizationaccount.userID,
  emailError: organizationaccount.emailError,
  usernameError: organizationaccount.usernameError,

});
const mapDispatchToProps = (dispatch) => {
  return {
    registerOrganization: (user) => dispatch(registerOrganization(user)),
    registerOrganizationFailed: (error) => dispatch(registerOrganizationFailed(error)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationRegister);