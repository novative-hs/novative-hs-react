import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";

// action
import {
  getTerritoriesList,
  addPatientInformation,
  addPatientInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class PatientInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      city_id: "",
      guest_id:"",
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
  }

  componentDidMount() {
    console.log("uuid", this.props.match.params.uuid)
    console.log("id", this.props.match.params.id)
    console.log("user type", this.state.user_type)
    this.props.addPatientInformationFailed("");
    this.props.getTerritoriesList();
    console.log("user id",this.state.user_id)
  }

  render() {

    // list of city from territories
        const cityList = [];
        for (let i = 0; i < this.props.territoriesList.length; i++) {
          cityList.push({
            label: this.props.territoriesList[i].city,
            value: this.props.territoriesList[i].id,
          });
        }
    // Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Patient Information | Lab Hazir</title>k{" "}
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

              <Col xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">
                            Patient account information - Step 2 of 2
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                        {this.props.patient && this.state.user_id ? (
  this.state.user_type === "b2bclient" || this.state.user_type === "CSR" ? (
    <Alert color="success" style={{ marginTop: "13px" }}>
      Account Registered Successfully.
    </Alert>
  ) : (
    <Alert color="success" style={{ marginTop: "13px" }}>
      Your Account Registered Successfully. Please log in to your account.
    </Alert>
  )
) : null}

                          {this.props.addPatientError &&
                          this.props.addPatientError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addPatientError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              phone: (this.state && this.state.phone) || "",
                              city_id: (this.state && this.state.city_id) || "",

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
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                            })}
                            onSubmit={values => {
                              this.props.addPatientInformation(
                                values,
                                this.props.match.params.id
                              );
                              window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                              // Redirecting back to the login page
                              setTimeout(() => {
                                if (this.props.patient &&
                                  !this.state.user_id) {
                                  console.log(this.props.match.params.uuid);
                                  this.props.history.push(
                                    this.props.match.params.uuid
                                      ? `/login/${this.props.match.params.uuid}`
                                      : `/login`
                                  );
                                } else if (
                                  this.props.patient &&
                                  this.state.user_id &&
                                  this.state.user_type === "b2bclient"
                                ) {
                                  console.log(this.props.match.params.uuid);
                                  this.props.history.push(
                                    this.props.match.params.uuid
                                      ? `/labs/${this.props.match.params.uuid}/${this.props.match.params.id}`
                                      : `/labs`
                                  );
                                }
                                else if (
                                  this.props.patient &&
                                  this.state.user_id &&
                                  this.state.user_type === "CSR"
                                ) {
                                  console.log(this.props.match.params.uuid);
                                  this.props.history.push(
                                    this.props.match.params.uuid
                                      ? `/labs/${this.props.match.params.uuid}/${this.props.match.params.id}`
                                      : `/labs/${this.props.match.params.id}`
                                  );
                                }
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
                                    placeholder="Please enter your name"
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

                                {/* Phone field */}
                                <div className="mb-3">
                                  <Label for="phone" className="form-label">
                                    Mobile No.
                                  </Label>
                                  <Field
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Please enter your mobile number"
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
                                               {/* city field */}
                        <div className="mb-3">


<Label for="city_id" className="form-label">
  City
</Label>
    <Select
      name="city_id"
      component="Select"
      onChange={selectedGroup =>
        this.setState({
          city_id: selectedGroup.value,
        })
      }
      className={
        "defautSelectParent" +
        (errors.city_id && touched.city_id
          ? " is-invalid"
          : "")
      }
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor:
            errors.city_id && touched.city_id
              ? "#f46a6a"
              : "#ced4da",
        }),
      }}
      options={
        cityList
      }
      defaultValue={{
        label:
        this.state.city,
        value:
        this.state.id,                                       
      }}
    
    />

    <ErrorMessage
      name="city_id"
      component="div"
      className="invalid-feedback"
    />
</div>


                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    {" "}
                                    Complete Registration{" "}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

PatientInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addPatientInformation: PropTypes.func,
  addPatientInformationFailed: PropTypes.any,
  addPatientError: PropTypes.any,
  patient: PropTypes.any,
  getTerritoriesList:PropTypes.func,
  territoriesList: PropTypes.array,
};


const mapStateToProps = state => {
  const { territoriesList } = state.PatientInformation;
  const { patient, addPatientError, loading } = state.PatientInformation;
  return { patient, addPatientError, loading, territoriesList };
  
};

export default connect(mapStateToProps, {
  getTerritoriesList,
  addPatientInformation,
  addPatientInformationFailed,
})(PatientInformation);