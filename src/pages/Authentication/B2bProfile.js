import PropTypes from "prop-types";
import Select from "react-select";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateB2bProfile, getB2bProfile } from "store/auth/b2bprofile/actions";

class B2bProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnText: "Copy",
      business_name: "",
      email: "",
      landline: "",
      website_url: "",
      isProfileUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getB2bProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        business_name: this.props.success.business_name,
        email: this.props.success.email,
        landline: this.props.success.landline,
        website_url: this.props.success.website_url,
      });
    }, 1000);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="B2b" breadcrumbItem="Profile" />

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            {/* <h4 className="card-title mb-4">Update B2BClient Profile</h4> */}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    business_name:
                      (this.state && this.state.business_name) || "",
                    email: (this.state && this.state.email) || "",
                    landline: (this.state && this.state.landline) || "",
                    website_url: (this.state && this.state.website_url) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    business_name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                    email: Yup.string()
                      .required("Please enter your email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    landline: Yup.string()
                      .required("Please enter your landline no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                        "Please enter a valid Pakistani landline number"
                      ),
                    website_url: Yup.string()
                      .trim()
                      .required("Please enter your website url")
                      .max(255, "Please enter maximum 255 characters"),
                  })}
                  onSubmit={values => {
                    // To show success message of update
                    this.setState({ isProfileUpdated: true });

                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getB2bProfile(this.state.user_id);
                    }, 1000);

                    // To make success message disappear after sometime
                    setTimeout(() => {
                      this.setState({
                        isProfileUpdated: false,
                      });
                    }, 5000);
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      {/* Name field */}
                      <div className="mb-3">
                        <Label for="name" className="form-label">
                          Business name
                        </Label>
                        <Field
                          id="business_name"
                          name="business_name"
                          type="text"
                          onChange={e =>
                            this.setState({ business_name: e.target.value })
                          }
                          value={this.state.business_name}
                          className={
                            "form-control" +
                            (errors.business_name && touched.business_name
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="business_name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Email field */}
                      <div className="mb-3">
                        <Label for="email" className="form-label">
                          Email
                        </Label>
                        <Field
                          name="email"
                          type="text"
                          onChange={e =>
                            this.setState({ email: e.target.value })
                          }
                          value={this.state.email}
                          className={
                            "form-control" +
                            (errors.email && touched.email ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Landline field */}
                      <div className="mb-3">
                        <Label for="landline" className="form-label">
                          Landline
                        </Label>
                        <Field
                          id="landline"
                          name="landline"
                          type="text"
                          onChange={e =>
                            this.setState({
                              landline: e.target.value,
                            })
                          }
                          value={this.state.landline}
                          className={
                            "form-control" +
                            (errors.landline && touched.landline
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="landline"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Address field */}
                      <div className="mb-3">
                        <Label for="website_url" className="form-label">
                          Website Url
                        </Label>
                        <Field
                          id="website_url"
                          name="website_url"
                          type="text"
                          onChange={e =>
                            this.setState({ website_url: e.target.value })
                          }
                          value={this.state.website_url}
                          className={
                            "form-control" +
                            (errors.website_url && touched.website_url
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="website_url"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div>
                        <input
                          value={
                            "https://labhazir.com/nearby-labs/" +
                            this.props.success.uuid
                          }
                          className="form-control"
                          readOnly={true}
                        />

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "https://labhazir.com/nearby-labs/" +
                                this.props.success.uuid
                            );
                            this.setState({ btnText: "Copied" });
                          }}
                        >
                          {this.state.btnText}
                        </button>
                        {/* 
                        {this.state.copied ? (
                          <span style={{ color: "red" }}>Copied.</span>
                        ) : null} */}
                      </div>

                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Update Profile
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

B2bProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateB2bProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getB2bProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.B2bProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateB2bProfile,
    getB2bProfile,
  })(B2bProfile)
);