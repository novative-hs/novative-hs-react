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
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateLabSettings, getLabSettings } from "../../store/actions";

class LabSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_247_opened: "",
      phone: "",
      opening_time: "",
      closing_time: "",
      home_sampling_charges: "",
      health_dept_certified: "",
      health_dept_certificate: "",
      registration_no: "",
      license_no: "",
      complaint_handling_email: "",
      complaint_handling_phone: "",
      is_digital_payment_accepted: "",
      is_active: "",
      isSettingsUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
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
    this.props.getLabSettings(this.state.user_id);

    setTimeout(() => {
      if (
        typeof this.props.success.health_dept_certified === "string" &&
        this.props.success.health_dept_certified !== ""
      ) {
        this.setState({
          health_dept_certificate:
            process.env.REACT_APP_BACKENDURL +
            this.props.success.health_dept_certificate,
        });
      }

      if (this.props.success.is_247_opened == true) {
        this.props.success.is_247_opened = "Yes";
      } else {
        this.props.success.is_247_opened = "No";
      }

      this.setState({
        home_sampling_charges: this.props.success.home_sampling_charges,
        is_247_opened: this.props.success.is_247_opened,
        opening_time: this.props.success.opening_time,
        closing_time: this.props.success.closing_time,
        phone: this.props.success.phone,
        complaint_handling_email: this.props.success.complaint_handling_email,
        complaint_handling_phone: this.props.success.complaint_handling_phone,
        registration_no: this.props.success.registration_no,
        license_no: this.props.success.license_no,
        health_dept_certified: this.props.success.health_dept_certified,
        // is_iso_15189_certified: this.props.success.is_iso_15189_certified,
        // is_iso_9001_certified: this.props.success.is_iso_9001_certified,
        is_digital_payment_accepted:
          this.props.success.is_digital_payment_accepted,
        is_active: this.props.success.is_active,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Lab" breadcrumbItem="Settings" />

            {this.state.isSettingsUpdated && this.state.isSettingsUpdated ? (
              <Alert color="success">Your settings are updated.</Alert>
            ) : null}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    is_247_opened:
                      (this.state && this.state.is_247_opened) || "Yes",
                    opening_time: (this.state && this.state.opening_time) || "",
                    closing_time: (this.state && this.state.closing_time) || "",
                    health_dept_certified:
                      (this.state && this.state.health_dept_certified) || "",
                    home_sampling_charges:
                      (this.state && this.state.home_sampling_charges) || "",
                    registration_no:
                      (this.state && this.state.registration_no) || "",
                    license_no: (this.state && this.state.license_no) || "",
                    phone: (this.state && this.state.phone) || "",
                    complaint_handling_email:
                      (this.state && this.state.complaint_handling_email) || "",
                    complaint_handling_phone:
                      (this.state && this.state.complaint_handling_phone) || "",
                    is_digital_payment_accepted:
                      (this.state && this.state.is_digital_payment_accepted) ||
                      "No",
                    is_active: (this.state && this.state.is_active) || "Yes",
                  }}
                  validationSchema={Yup.object().shape({
                    home_sampling_charges: Yup.number(
                      "Please enter number only"
                    )
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      )
                      .max(
                        5000,
                        "Please enter a number less than or equal to 150"
                      ),
                    complaint_handling_email: Yup.string()
                      // .required("Please enter your complaint handling email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    complaint_handling_phone: Yup.string()
                      // .required(
                      //   "Please enter your complaint handling phone no."
                      // )
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                        "Please enter a valid Pakistani landline number e.g. 0512345678"
                      ),
                  })}
                  onSubmit={values => {
                    values.health_dept_certified =
                      this.state.health_dept_certificate;

                    // If health dept certified is selected and certificate is uploaded
                    if (
                      (this.state.health_dept_certified.length > 0 &&
                        this.state.health_dept_certificate) ||
                      this.state.health_dept_certified.length == 0
                    ) {
                      if (typeof values.health_dept_certificate == "string") {
                        // if no file was selected for logo then get current image from url and convert to file
                        this.toDataURL(this.state.health_dept_certificate).then(
                          dataUrl => {
                            values.health_dept_certificate = this.dataURLtoFile(
                              dataUrl,
                              this.state.health_dept_certificate
                                .split("/")
                                .at(-1)
                            );
                          }
                        );

                        values.health_dept_certificate = "";
                      }

                      // Check if the lab is open for 24/7 then set opening and closing time to 00:00:00
                      if (values.is_247_opened == "Yes") {
                        values.opening_time = "00:00:00";
                        values.closing_time = "00:00:00";
                      }

                      // To show success message of update
                      this.setState({ isSettingsUpdated: true });

                      setTimeout(() => {
                        this.props.updateLabSettings(
                          values,
                          this.state.user_id
                        );

                        // To get updated settings again
                        setTimeout(() => {
                          this.props.getLabSettings(this.state.user_id);
                        }, 1000);

                        // To make success message disappear after sometime
                        setTimeout(() => {
                          this.setState({
                            isSettingsUpdated: false,
                          });
                        }, 5000);
                      }, 2000);
                    }
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      <p>{errors.health_dept_certificate}</p>
                      {/* Operational Hours Fields */}
                      {/* Health Dept Certified */}
                      <div className="mb-3">
                        <Label for="is_247_opened" className="form-label">
                          Are you open for 24 hours?
                        </Label>
                        <Field
                          name="is_247_opened"
                          component="select"
                          onChange={e =>
                            this.setState({
                              is_247_opened: e.target.value,
                            })
                          }
                          value={this.state.is_247_opened}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>

                      {this.state.is_247_opened == "No" && (
                        <Row>
                          <Col md={6} lg={6}>
                            <div className="mb-3 row">
                              <label
                                htmlFor="opening_time"
                                className="col-md-3 col-form-label"
                              >
                                Opening Time
                              </label>
                              <div className="col-md-9">
                                <input
                                  className="form-control"
                                  type="time"
                                  id="opening_time"
                                  name="opening_time"
                                  onChange={e => {
                                    this.setState({
                                      opening_time: e.target.value, // Concatenating seconds for handling on Django side
                                    });
                                  }}
                                  defaultValue={this.state.opening_time}
                                />
                              </div>
                            </div>
                          </Col>

                          <Col md={6} lg={6}>
                            <div className="mb-4 row">
                              <label
                                htmlFor="closing_time"
                                className="col-md-3 col-form-label"
                              >
                                Closing Time
                              </label>
                              <div className="col-md-9">
                                <input
                                  className="form-control"
                                  type="time"
                                  id="closing_time"
                                  name="closing_time"
                                  onChange={e => {
                                    this.setState({
                                      closing_time: e.target.value, // Concatenating seconds for handling on Django side
                                    });
                                  }}
                                  defaultValue={this.state.closing_time}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}

                      {/* Health Dept Certified */}
                      <div className="mb-3">
                        <Label
                          for="health_dept_certified"
                          className="form-label"
                        >
                          Certified Health Department
                        </Label>
                        <Field
                          name="health_dept_certified"
                          component="select"
                          onChange={e =>
                            this.setState({
                              health_dept_certified: e.target.value,
                            })
                          }
                          value={this.state.health_dept_certified}
                          className="form-select"
                        >
                          <option
                            value=""
                            selected={
                              this.props.success.health_dept_certified === ""
                            }
                          >
                            --- Please select the certified health department
                            ---
                          </option>
                          <option value="Islamabad Health Regulatory Authority">
                            Islamabad Health Regulatory Authority
                          </option>
                          <option value="Punjab Healthcare Comission">
                            Punjab Healthcare Comission
                          </option>
                          <option value="Sindh Healthcare Comission">
                            Sindh Healthcare Comission
                          </option>
                          <option value="Balochistan Healthcare Comission">
                            Balochistan Healthcare Comission
                          </option>
                          <option value="KPK Healthcare Comission">
                            KPK Healthcare Comission
                          </option>
                          <option value="AJ&K Healthcare Comission">
                            AJ&K Healthcare Comission
                          </option>
                          <option value="Gilgit Baltistan Health Department">
                            Gilgit Baltistan Health Department
                          </option>
                        </Field>
                      </div>

                      {this.state.health_dept_certified && (
                        <div>
                          {/* Health Dept Certificate field */}
                          <div className="mb-3">
                            <Label for="name" className="form-label">
                              Health Dept Certificate (Choose file only if you
                              want to change health dept certificate)
                            </Label>
                            <Row>
                              <Col md={8} lg={8}>
                                <Input
                                  id="formFile"
                                  name="health_dept_certificate"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={e => {
                                    this.setState({
                                      health_dept_certificate:
                                        e.target.files[0],
                                    });
                                  }}
                                  // className="form-control is-invalid"
                                  className={
                                    "form-control" +
                                    (this.state.health_dept_certified.length >
                                      0 && !this.state.health_dept_certificate
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <div className="invalid-feedback">
                                  Please upload health dept certificate
                                </div>
                              </Col>

                              <Col md={4} lg={4}>
                                {typeof this.props.success
                                  .health_dept_certified === "string" &&
                                  this.props.success.health_dept_certified !==
                                    "" && (
                                    <div className="mt-2">
                                      <strong>Currently: </strong>{" "}
                                      <Link
                                        to={{
                                          pathname:
                                            process.env.REACT_APP_BACKENDURL +
                                            this.props.success
                                              .health_dept_certificate,
                                        }}
                                        target="_blank"
                                      >
                                        Health Dept Certificate
                                      </Link>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          {/* Registration No. field */}
                          <div className="mb-3">
                            <Label for="registration_no" className="form-label">
                              Registration No. (optional)
                            </Label>
                            <Field
                              id="registration_no"
                              name="registration_no"
                              type="text"
                              onChange={e =>
                                this.setState({
                                  registration_no: e.target.value,
                                })
                              }
                              value={this.state.registration_no}
                              className={
                                "form-control" +
                                (errors.registration_no &&
                                touched.registration_no
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="registration_no"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>

                          {/* License No. field */}
                          <div className="mb-3">
                            <Label for="license_no" className="form-label">
                              License No. (optional)
                            </Label>
                            <Field
                              id="license_no"
                              name="license_no"
                              type="text"
                              onChange={e =>
                                this.setState({
                                  license_no: e.target.value,
                                })
                              }
                              value={this.state.license_no}
                              className={
                                "form-control" +
                                (errors.license_no && touched.license_no
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="license_no"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                      )}

                      {/* Phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Lab Mobile No. (if any)
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          onChange={e =>
                            this.setState({ phone: e.target.value })
                          }
                          value={this.state.phone}
                          className="form-control"
                        />
                      </div>

                      {/* Complaint Handling Email field */}
                      <div className="mb-3">
                        <Label
                          for="complaint_handling_email"
                          className="form-label"
                        >
                          Help & Support Email
                        </Label>
                        <Field
                          name="complaint_handling_email"
                          type="text"
                          onChange={e =>
                            this.setState({
                              complaint_handling_email: e.target.value,
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
                          Help & Support Phone No.
                        </Label>
                        <Field
                          id="complaint_handling_phone"
                          name="complaint_handling_phone"
                          type="text"
                          onChange={e =>
                            this.setState({
                              complaint_handling_phone: e.target.value,
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

                      {/* Home Sampling Charges field */}
                      <div className="mb-3">
                        <Label
                          for="home_sampling_charges"
                          className="form-label"
                        >
                          Home Sampling Charges
                        </Label>
                        <Field
                          id="home_sampling_charges"
                          name="home_sampling_charges"
                          type="number"
                          onChange={e =>
                            this.setState({
                              home_sampling_charges: e.target.value,
                            })
                          }
                          value={this.state.home_sampling_charges}
                          className={
                            "form-control" +
                            (errors.home_sampling_charges &&
                            touched.home_sampling_charges
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="home_sampling_charges"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Accept Credit Card for Payment field */}
                      <div className="mb-3">
                        <Label
                          for="is_digital_payment_accepted"
                          className="form-label"
                        >
                          Do you accept digital payments?
                        </Label>
                        <Field
                          name="is_digital_payment_accepted"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_digital_payment_accepted: e.target.value,
                            })
                          }
                          value={this.state.is_digital_payment_accepted}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>

                      {/* Is Active */}
                      <div className="mb-3">
                        <Label for="is_active" className="form-label">
                          Are you active for providing services?
                        </Label>
                        <Field
                          name="is_active"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_active: e.target.value,
                            })
                          }
                          value={this.state.is_active}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>
                      <div className="text-center mt-4">
                        <Button
                          type="submit"
                          color="danger"
                          disabled={this.state.isSettingsUpdated}
                        >
                          Update Settings
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

LabSettings.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateLabSettings: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabSettings: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.LabSettings;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateLabSettings,
    getLabSettings,
  })(LabSettings)
);