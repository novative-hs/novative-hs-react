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
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";
import { addStaff, addStaffFail } from "store/staff/actions";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class StaffRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      staff: "",
      usernameFieldError: null,
      // emailFieldError: null,
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

  componentDidMount() {
    const { addStaffFail} = this.props;
    addStaffFail(""); 
   
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

    // if (prevProps.emailError != this.props.emailError) {
    //   this.setState({ emailFieldError: this.props.emailError });
    // }

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
    const { onAddStaff } = this.props;
    const staff = this.state.staff;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Staff | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Register" />
            <Breadcrumbs title="Staff" breadcrumbItem="Register - Step 1" />
            <Row className="justify-content-center">
              <Col lg="8">
              <Nav className="mt-4 mb-2 gap-4" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "tab1",
                          })}
                          // onClick={() => {
                          //   this.toggleTab("tab1");
                          // }}
                        >
                          <i className="bx bx-user d-block check-nav-icon font-size-18" />
                        
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "tab2",
                          })}
                          // onClick={() => {
                          //   this.toggleTab("tab2");
                          // }}
                        >
                          <i className="bx bx-home d-block check-nav-icon font-size-18" />
                       
                        </NavLink>
                      </NavItem>
                    </Nav>
                <Card>
                  <CardBody>
                   
                    {this.props.addStaffError && (
          <Alert color="danger" style={{ marginTop: "13px" }}>
            {this.props.addStaffError}
          </Alert>
        )}
        {this.props.addStaffSuccess && (
          <div>
            <Alert color="success" style={{ marginTop: "13px" }}>
              {this.props.addStaffSuccess.message}
            </Alert>
            {setTimeout(() => {
              this.props.history.push("/databaseadmin-list");
            }, 2000)}
          </div>
        )}
                    <div className="mt-4">
                      {this.state.submittedMessage && (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.state.submittedMessage}
                        </Alert>
                      )}

                      {/* To show incomplete registration error to inform user */}
                      {this.state.incompleteRegistrationError && (
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
                      )}
   <TabContent activeTab={this.state.activeTab}>
                        {this.state.activeTab === "tab1" && (
                          <TabPane tabId="tab1">
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          username: (this.state && this.state.username) || "",
                          // email: (this.state && this.state.email) || "",
                          password: (this.state && this.state.password) || "",
                          password2: (this.state && this.state.password2) || "",
                          account_type:
                            (this.state && this.state.account_type) || "CSR",
                        }}
                        validationSchema={Yup.object().shape({
                          username: Yup.string()
                            .trim()
                            .required("Please enter your username"),
                          password: Yup.string().required(
                            "Please enter your password"
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
                      
                        // Check for errors and set the success message
                        setTimeout(() => {
                          if (
                            !this.state.usernameFieldError &&
                            !this.state.passwordFieldError &&
                            !this.state.incompleteRegistrationError
                          ) {
                            this.setState({
                              submittedMessage: "Please wait for a while we are processing. Thank you for your patience.",
                            });
                      
                            // Wait for a short period to display the success message before switching tabs
                            setTimeout(() => {
                              this.toggleTab("tab2");
                      
                              // Reset the submitted message after 1 second
                              setTimeout(() => {
                                this.setState({
                                  submittedMessage: "",
                                });
                              }, 1000); // 1 second delay
                            }, 1000); // 2 seconds delay for user to see the message
                          }
                        }, 1000); // Initial 1 second delay
                      }}
                    >
                        {({ errors, status, touched }) => (
                          <Form className="form-horizontal">
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
                              <div className="input-group">
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Enter password"
                                  autoComplete="on"
                                  onFocus={() => {
                                    this.setState({
                                      passwordFieldError: null,
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    ((errors.password && touched.password) ||
                                    this.state.passwordFieldError
                                      ? " is-invalid"
                                      : "")
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
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="invalid-feedback"
                                />

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
                                    "form-control" +
                                    (errors.password2 && touched.password2
                                      ? " is-invalid"
                                      : "")
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
                                <ErrorMessage
                                  name="password2"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              
                            </div>

                            {/* Account type field */}
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

                            <Row>
                              <Col>
                                <div className="text-end">
                                  <button
                                    type="submit"
                                    className="btn btn-primary save-user"
                                    disabled={this.state.submittedMessage}
                                  >
                                    Next
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                      </TabPane>
                        )}
                      {this.state.activeTab === "tab2" && (
                          <TabPane tabId="tab2">
                   <Formik
                      enableReinitialize={true}
                      initialValues={{
                        name: (staff && staff.name) || "",
                        email: (staff && staff.email) || "",
                        cnic: (staff && staff.cnic) || "",
                        phone: (staff && staff.phone) || "",
                        city: (staff && staff.city) || "",
                        photo: (this.state && this.state.collectorImg) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        hiddentEditFlag: Yup.boolean(),
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
                      })}
                    //   onSubmit={values => {
                    //     const newStaff = {
                    //       email: values.email,
                    //       name: values.name,
                    //       cnic: values.cnic,
                    //       phone: values.phone,
                    //       photo: this.state.collectorImg,
                    //       city: values.city,
                    //     };

                    //     // save new Staff
                    //     onAddStaff(newStaff, this.props.userID);

                    //     // if (this.props.staff.length != 0) {
                    //     //   this.props.history.push("/add-")
                    //     // }

                    //       window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                    //       // If no error messages then show wait message
                    //       setTimeout(() => {
                    //         if (this.props.staff) {
                    //           this.setState({
                    //             complaintSuccess:
                    //               "Staff Added Succesfully",
                    //           });
                    //           setTimeout(() => {
                    //             // this.props.history.push("/csr-list");
                    //         }, 2000)
                    //         }
                    //       }, 1000);
                          
                    //   }
                    // }
                    // >
                    onSubmit={values => {
                      const newStaff = {
                        email: values.email,
                        name: values.name,
                        cnic: values.cnic,
                        phone: values.phone,
                        photo: this.state.collectorImg,
                        city: values.city,
                      };

                      // save new Staff
                      onAddStaff(newStaff, this.props.userID);              
                    }}
                  >
                      {({ errors, status, touched }) => (
                        <Form>
                          <Row>
                            <Col className="col-12">
                              <div className="mb-3">
                                <Label className="form-label">Name</Label>
                                <Field
                                  name="name"
                                  type="text"
                                  placeholder="Enter name"
                                  value={this.state.staff.name}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: e.target.value,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        city: staff.city,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.name && touched.name
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mb-3">
                                <Label className="form-label">Email</Label>
                                <Field
                                  name="email"
                                  type="text"
                                  placeholder="Enter email"
                                  value={this.state.staff.email}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        email: e.target.value,
                                        name: staff.name,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                     
                                        city: staff.city,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
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
                              <div className="mb-3">
                                <Label className="form-label">CNIC</Label>
                                <Field
                                  name="cnic"
                                  type="text"
                                  placeholder="Enter CNIC"
                                  value={this.state.staff.cnic}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: e.target.value,
                                        phone: staff.phone,
                                        
                                        city: staff.city,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.cnic && touched.cnic
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="cnic"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mb-3">
                                <Label className="form-label">Mobile No.</Label>
                                <Field
                                  name="phone"
                                  type="text"
                                  placeholder="Enter mobile no."
                                  value={this.state.staff.phone}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: e.target.value,
                                       
                                        city: staff.city,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.phone && touched.phone
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="phone"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  Photo
                                </Label>
                                <Input
                                  id="formFile"
                                  name="photo"
                                  placeholder="Choose image"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png"
                                  onChange={e =>
                                    this.setState({
                                      collectorImg: e.target.files[0],
                                    })
                                  }
                                  className={
                                    "form-control" +
                                    (errors.photo && touched.photo
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <ErrorMessage
                                  name="photo"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                                    
                             
                          
                              
                              <div className="mb-3">


<Label for="city" className="form-label">
  City
</Label>
<Field
                                  name="city"
                                  type="text"
                                  placeholder="Enter city"
                                  value={this.state.staff.city}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        city: e.target.value,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.city && touched.city
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

<ErrorMessage
  name="city"
  component="div"
  className="invalid-feedback"
/>
</div>


                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-success save-user"
                                >
                                  Save
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
                      </TabPane>
                        )}
                      </TabContent>
                      
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
  addStaff: PropTypes.func,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  staff: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
  onAddStaff: PropTypes.func,
  addStaffFail: PropTypes.func,
  addStaffError: PropTypes.any,
  addStaffSuccess: PropTypes.any,
};

const mapStateToProps = ({ staff , Account }) => ({
  staff: staff.staff,
  addStaffError: staff.addStaffError,
  addStaffSuccess: staff.addStaffSuccess,
  userAccountType: Account.userAccountType,
  loading: Account.loading,
  incompleteRegistrationError: Account.incompleteRegistrationError,
  passwordError: Account.passwordError,
  userID: Account.userID,
  usernameError: Account.usernameError,

});
const mapDispatchToProps = (dispatch) => {
  return {
    onAddStaff: (staff, userID) => dispatch(addStaff(staff, userID)),
    apiError: (error) => dispatch(apiError(error)),
    registerUser: (user) => dispatch(registerUser(user)),
    registerUserFailed: (error) => dispatch(registerUserFailed(error)),
    addStaffFail: (message) => {
      console.log("addStaffFail called with message:", message);
      dispatch(addStaffFail(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffRegister);