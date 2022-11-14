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
  updateCorporateProfile,
  getCorporateProfile,
  getCorporateProfileSuccess,
} from "../../store/actions";

class CorporateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      owner_name: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city: "",
      district: "",
      isProfileUpdated: false,
    };
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  componentDidMount() {
    this.props.getCorporateProfile(this.props.match.params.id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        logo: process.env.REACT_APP_BACKENDURL + this.props.success.logo,
        owner_name: this.props.success.owner_name,
        email: this.props.success.email,
        phone: this.props.success.phone,
        landline: this.props.success.landline,
        address: this.props.success.address,
        city: this.props.success.city,
        district: this.props.success.district,
      });
    }, 1000);
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
                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="me-3">
                        <img
                          src={this.state.logo}
                          alt=""
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                      </div>
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

            <h4 className="card-title mb-4">Update Corporate Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    logo: (this.state && this.state.logo) || "",
                    owner_name: (this.state && this.state.owner_name) || "",
                    email: (this.state && this.state.email) || "",
                    phone: (this.state && this.state.phone) || "",
                    landline: (this.state && this.state.landline) || "",
                    address: (this.state && this.state.address) || "",
                    city: (this.state && this.state.city) || "",
                    district: (this.state && this.state.district) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                    logo: Yup.mixed().required("Please upload your lab logo"),
                    owner_name: Yup.string()
                      .trim()
                      .required("Please enter lab owner name")
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
                    phone: Yup.string()
                      .required("Please enter your phone no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                        "Please enter a valid Pakistani phone number e.g. 03123456789"
                      ),
                    landline: Yup.string()
                      .required("Please enter your landline no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                        "Please enter a valid Pakistani landline number"
                      ),
                    address: Yup.string()
                      .trim()
                      .required("Please enter your full address")
                      .max(255, "Please enter maximum 255 characters"),
                    city: Yup.string()
                      .trim()
                      .required("Please enter your city")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                    district: Yup.string()
                      .trim()
                      .required("Please enter your district")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                  })}
                  onSubmit={values => {
                    // if no file was selected for logo then get current image from url and convert to file
                    if (typeof values.logo == "string") {
                      this.toDataURL(values.logo).then(dataUrl => {
                        var fileData = this.dataURLtoFile(
                          dataUrl,
                          values.logo.split("/").at(-1)
                        );
                        values.logo = fileData;

                        this.props.updateCorporateProfile(
                          values,
                          this.props.match.params.id
                        );
                      });
                    }

                    // Otherwise just call update method
                    else {
                      this.props.updateCorporateProfile(
                        values,
                        this.props.match.params.id
                      );
                    }

                    // To show success message of update
                    this.setState({ isProfileUpdated: true });

                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getCorporateProfile(
                        this.props.match.params.id
                      );
                    }, 1000);

                    // To display updated logo
                    setTimeout(() => {
                      this.setState({
                        logo:
                          process.env.REACT_APP_BACKENDURL +
                          this.props.success.logo,
                      });
                    }, 2000);

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
                      {/* Logo field */}
                      <div className="mb-3">
                        <Label for="name" className="form-label">
                          Logo
                        </Label>
                        <Input
                          id="formFile"
                          name="logo"
                          type="file"
                          multiple={false}
                          accept=".jpg,.jpeg,.png"
                          onChange={e =>
                            this.setState({ logo: e.target.files[0] })
                          }
                          className={
                            "form-control" +
                            (errors.logo && touched.logo ? " is-invalid" : "")
                          }
                        />

                        <ErrorMessage
                          name="logo"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Owner name field */}
                      <div className="mb-3">
                        <Label for="owner_name" className="form-label">
                          Owner name
                        </Label>
                        <Field
                          id="owner_name"
                          name="owner_name"
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

                      {/* Phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Phone
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
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
                        <Label for="address" className="form-label">
                          Complete Address
                        </Label>
                        <Field
                          id="address"
                          name="address"
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

CorporateProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateCorporateProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getCorporateProfile: PropTypes.func,
  getCorporateProfileSuccess: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.CorporateProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateCorporateProfile,
    getCorporateProfile,
    getCorporateProfileSuccess,
  })(CorporateProfile)
);
