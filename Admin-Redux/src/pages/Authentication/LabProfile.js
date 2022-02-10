import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, Button, Card, CardBody, Col, Container, Row, Label } from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";

class LabProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { account_id: "",
    name: "", 
    owner_name: "" ,
    phone: "" ,
    landline: "" ,
    address:"",
    city:"",
    district:"",
    complaint_handling_email:"",
    complaint_handling_phone:"",
    accept_credit_card_for_payment:"",
    is_active:""
  };
  }

  componentDidMount() {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        this.setState({
          account_id: obj.account_id,
          name: obj.name,
          owner_name: obj.owner_name,
          phone: obj.phone,
          landline:obj.landline,
          address: obj.address,
          city:obj.city,
          district: obj.district,
          complaint_handling_email:obj.complaint_handling_email,
          complaint_handling_phone:obj.complaint_handling_phone,
          accept_credit_card_for_payment:obj.accept_credit_card_for_payment,
          is_active: obj.is_active,

        });
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        this.setState({           
          account_id: obj.account_id,
          name: obj.name,
          owner_name: obj.owner_name,
          phone: obj.phone,
          landline:obj.landline,
          address: obj.address,
          city:obj.city,
          district: obj.district,
          complaint_handling_email:obj.complaint_handling_email,
          complaint_handling_phone:obj.complaint_handling_phone,
          accept_credit_card_for_payment:obj.accept_credit_card_for_payment,
          is_active: obj.is_active });
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props !== prevProps) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        this.setState({
          account_id: obj.account_id,
          name: obj.name,
          owner_name: obj.owner_name,
          phone: obj.phone,
          landline:obj.landline,
          address: obj.address,
          city: obj.city,
          district: obj.district,
          complaint_handling_email: obj.complaint_handling_email,
          complaint_handling_phone: obj.complaint_handling_phone,
          accept_credit_card_for_payment: obj.accept_credit_card_for_payment,
          is_active: obj.is_active,
        });
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        this.setState({          
          account_id: obj.account_id,
          name: obj.name,
          owner_name: obj.owner_name,
          phone: obj.phone,
          landline:obj.landline,
          address: obj.address,
          city:obj.city,
          district: obj.district,
          complaint_handling_email:obj.complaint_handling_email,
          complaint_handling_phone:obj.complaint_handling_phone,
          accept_credit_card_for_payment:obj.accept_credit_card_for_payment,
          is_active: obj.is_active });
      }
      setTimeout(() => {
        this.props.resetProfileFlag();
      }, 3000);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Skote" breadcrumbItem="Profile" />

            <Row>
              <Col lg="12">
                {this.props.error && this.props.error ? (
                  <Alert color="danger">{this.props.error}</Alert>
                ) : null}
                {this.props.success && this.props.success ? (
                  <Alert color="success">{this.props.success}</Alert>
                ) : null}

                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="me-3">
                        <img
                          src={avatar}
                          alt=""
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                      </div>
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.name}</h5>
                          <p className="mb-0">Id no: #{this.state.account_id}</p>
                          <p className="mb-1">{this.state.owner_name}</p>

                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <h4 className="card-title mb-4">Change Lab Name</h4>

            <Card>
              <CardBody>
              <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              owner_name:
                                (this.state && this.state.owner_name) || "",
                              phone: (this.state && this.state.phone) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              address: (this.state && this.state.address) || "",
                              city: (this.state && this.state.city) || "",
                              district:
                                (this.state && this.state.district) || "",
                              complaint_handling_email:
                                (this.state &&
                                  this.state.complaint_handling_email) ||
                                "",
                              complaint_handling_phone:
                                (this.state &&
                                  this.state.complaint_handling_phone) ||
                                "",
                              accept_credit_card_for_payment:
                                (this.state &&
                                  this.state.accept_credit_card_for_payment) ||
                                "No",
                              is_active:
                                (this.state &&
                                  this.state.is_active) ||
                                "Yes",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              owner_name: Yup.string()
                                .required("Please enter lab owner name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. +923123456789"
                                ),
                              landline: Yup.string()
                                .required("Please enter your landline no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani landline number"
                                ),
                              address: Yup.string()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              city: Yup.string()
                                .required("Please enter your city")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              district: Yup.string()
                                .required("Please enter your district")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              complaint_handling_email: Yup.string()
                                .required(
                                  "Please enter your complaint handling email"
                                )
                                .email("Please enter valid email")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              complaint_handling_phone: Yup.string()
                                .required(
                                  "Please enter your complaint handling phone no."
                                )
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. +923123456789"
                                ),
                            })}
                            onSubmit={values => {
                              this.props.editProfile(values);
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

                                {/* Owner name field */}
                                <div className="mb-3">
                                  <Label
                                    for="owner_name"
                                    className="form-label"
                                  >
                                    Owner name
                                  </Label>
                                  <Field
                                    id="owner_name"
                                    name="owner_name"
                                    placeholder="John Doe"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        owner_name: e.target.value,
                                      })
                                    }
                                    value={this.state.owner_name}
                                    className={
                                      "form-control" +
                                      (errors.owner_name && touched.owner_name
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="owner_name"
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

                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label for="landline" className="form-label">
                                    Landline
                                  </Label>
                                  <Field
                                    id="landline"
                                    name="landline"
                                    placeholder="+925712345678"
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

                                {/* Complaint Handling Email field */}
                                <div className="mb-3">
                                  <Label
                                    for="complaint_handling_email"
                                    className="form-label"
                                  >
                                    Complaint handling email
                                  </Label>
                                  <Field
                                    name="complaint_handling_email"
                                    placeholder="xyz@complaint.com"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        complaint_handling_email:
                                          e.target.value,
                                      })
                                    }
                                    value={this.state.complaint_handling_email}
                                    className={
                                      "form-control" +
                                      (errors.complaint_handling_email &&
                                      touched.complaint_handling_email
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="complaint_handling_email"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Complaint Handling Phone field */}
                                <div className="mb-3">
                                  <Label
                                    for="complaint_handling_phone"
                                    className="form-label"
                                  >
                                    Complaint handling phone
                                  </Label>
                                  <Field
                                    id="complaint_handling_phone"
                                    name="complaint_handling_phone"
                                    placeholder="+925712345678"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        complaint_handling_phone:
                                          e.target.value,
                                      })
                                    }
                                    value={this.state.complaint_handling_phone}
                                    className={
                                      "form-control" +
                                      (errors.complaint_handling_phone &&
                                      touched.complaint_handling_phone
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="complaint_handling_phone"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                {/* Accept Credit Card for Payment field */}
                                <div className="mb-3">
                                  <Label
                                    for="accept_credit_card_for_payment"
                                    className="form-label"
                                  >
                                    Do you accept credit card for payment?
                                  </Label>
                                  <Field
                                    name="accept_credit_card_for_payment"
                                    component="select"
                                    defaultValue="No"
                                    onChange={e =>
                                      this.setState({
                                        accept_credit_card_for_payment:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.accept_credit_card_for_payment
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>
                                {/* Is Active */}
                                <div className="mb-3">
                                  <Label
                                    for="is_active"
                                    className="form-label"
                                  >
                                    Are You Active?
                                  </Label>
                                  <Field
                                    name="is_active"
                                    component="select"
                                    defaultValue="No"
                                    onChange={e =>
                                      this.setState({
                                        is_active:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_active
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>
                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Update User Name
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

LabProfile.propTypes = {
  editProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  resetProfileFlag: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { editProfile, resetProfileFlag })(LabProfile)
);
