import PropTypes from "prop-types";
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
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import {
  updatePatientProfile,
  getPatientProfile,
  getPatientProfileSuccess,
} from "../../store/actions";

class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cnic: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      is_corporate_user: "",
      corporate_unique_id: "",
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getPatientProfile(this.props.match.params.id);
    }, 1000);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        cnic: this.props.success.cnic,
        email: this.props.success.email,
        phone: this.props.success.phone,
        address: this.props.success.address,
        city: this.props.success.city,
        district: this.props.success.district,
        is_corporate_user: this.props.success.is_corporate_user,
        corporate_unique_id: this.props.success.corporate_unique_id,
      });
    }, 3000);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Ilaaj4u" breadcrumbItem="Profile" />

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.name}</h5>
                          <p className="mb-0">{this.state.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            <h4 className="card-title mb-4">Update Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    cnic: (this.state && this.state.cnic) || "",
                    email: (this.state && this.state.email) || "",
                    phone: (this.state && this.state.phone) || "",
                    address: (this.state && this.state.address) || "",
                    city: (this.state && this.state.city) || "",
                    district: (this.state && this.state.district) || "",
                    complaint_handling_email:
                      (this.state && this.state.complaint_handling_email) || "",
                    complaint_handling_phone:
                      (this.state && this.state.complaint_handling_phone) || "",
                    is_corporate_user:
                      (this.state && this.state.is_corporate_user) || "No",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters"),
                    cnic: Yup.string()
                      .required("Please enter your CNIC")
                      .matches(
                        /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                        "Please enter a valid CNIC e.g. 37106-8234782-3"
                      )
                      .max(255, "Please enter maximum 255 characters"),
                    email: Yup.string()
                      .required("Please enter your email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    phone: Yup.string()
                      .required("Please enter your phone no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                        "Please enter a valid Pakistani phone number e.g. +923123456789"
                      ),
                    address: Yup.string()
                      .required("Please enter your full address")
                      .max(255, "Please enter maximum 255 characters"),
                    city: Yup.string()
                      .required("Please enter your city")
                      .max(255, "Please enter maximum 255 characters"),
                    district: Yup.string()
                      .required("Please enter your district")
                      .max(255, "Please enter maximum 255 characters"),
                  })}
                  onSubmit={values => {
                    this.props.updatePatientProfile(
                      values,
                      this.props.match.params.id
                    );
                    // To show success message of update
                    this.setState({ isProfileUpdated: true });

                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getPatientProfile(this.props.match.params.id);
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
                          Name
                        </Label>
                        <Field
                          id="name"
                          name="name"
                          placeholder="LaboMart"
                          type="text"
                          onChange={e =>
                            this.setState({ name: e.target.value })
                          }
                          value={this.state.name}
                          className={
                            "form-control" +
                            (errors.name && touched.name ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* CNIC field */}
                      <div className="mb-3">
                        <Label for="cnic" className="form-label">
                          CNIC
                        </Label>
                        <Field
                          id="cnic"
                          name="cnic"
                          placeholder="12345-6789012-1"
                          type="text"
                          readOnly={true}
                          onChange={e =>
                            this.setState({ cnic: e.target.value })
                          }
                          value={this.state.cnic}
                          className={
                            "form-control" +
                            (errors.cnic && touched.cnic ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="cnic"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Phone
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
                          placeholder="+923123456789"
                          type="text"
                          onChange={e =>
                            this.setState({ phone: e.target.value })
                          }
                          value={this.state.phone}
                          className={
                            "form-control" +
                            (errors.phone && touched.phone ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="phone"
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
                          placeholder="labomart@xyz.com"
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

                      {/* Address field */}
                      <div className="mb-3">
                        <Label for="address" className="form-label">
                          Complete Address
                        </Label>
                        <Field
                          id="address"
                          name="address"
                          placeholder="339-A Main Peshawar Road, Rawalpindi"
                          type="text"
                          onChange={e =>
                            this.setState({ address: e.target.value })
                          }
                          value={this.state.address}
                          className={
                            "form-control" +
                            (errors.address && touched.address
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* City field */}
                      <div className="mb-3">
                        <Label for="city" className="form-label">
                          City
                        </Label>
                        <Field
                          id="city"
                          name="city"
                          placeholder="Rawalpindi"
                          type="text"
                          onChange={e =>
                            this.setState({ city: e.target.value })
                          }
                          value={this.state.city}
                          className={
                            "form-control" +
                            (errors.city && touched.city ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* District field */}
                      <div className="mb-3">
                        <Label for="district" className="form-label">
                          District
                        </Label>
                        <Field
                          id="district"
                          name="district"
                          placeholder="Rawalpindi"
                          type="text"
                          onChange={e =>
                            this.setState({
                              district: e.target.value,
                            })
                          }
                          value={this.state.district}
                          className={
                            "form-control" +
                            (errors.district && touched.district
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="district"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Is Corporate User field */}
                      <div className="mb-3">
                        <Label for="is_corporate_user" className="form-label">
                          Are you a corporate user?
                        </Label>
                        <Field
                          name="is_corporate_user"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_corporate_user: e.target.value,
                            })
                          }
                          value={this.state.is_corporate_user}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>
                      {/* Corporate Unique ID field */}
                      {this.state.is_corporate_user === "Yes" && (
                        <div className="mb-3">
                          <Label
                            for="corporate_unique_id"
                            className="form-label"
                          >
                            Corporate Unique ID
                          </Label>
                          <Field
                            id="corporate_unique_id"
                            name="corporate_unique_id"
                            placeholder="2594153c-a86d-4a70-8136-ee93e01c88cc"
                            type="text"
                            className={
                              "form-control" +
                              (errors.corporate_unique_id &&
                              touched.corporate_unique_id
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="corporate_unique_id"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      )}
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

PatientProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updatePatientProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getPatientProfile: PropTypes.func,
  getPatientProfileSuccess: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.PatientProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updatePatientProfile,
    getPatientProfile,
    getPatientProfileSuccess,
  })(PatientProfile)
);
