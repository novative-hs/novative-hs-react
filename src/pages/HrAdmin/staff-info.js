import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Label, Input } from "reactstrap";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// import {
//   getTerritoriesList
//   } from "store/territories-list/actions";
  
import { addStaff } from "store/staff/actions";

class StaffInfo extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      staff: [],
      staff: "",
      // territoriesList: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    // const { territoriesList, onGetTerritoriesList } = this.props;
    // if (territoriesList && !territoriesList.length) {
    //   console.log(onGetTerritoriesList(this.state.user_id));
    // }
  }

  render() {

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
            <Breadcrumbs title="Staff" breadcrumbItem="Register - Step 2" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        name: (staff && staff.name) || "",
                        cnic: (staff && staff.cnic) || "",
                        phone: (staff && staff.phone) || "",
                        territory_office: (staff && staff.territory_office) || "",
                        roles: (staff && staff.roles) || "",
                        city: (staff && staff.city) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        hiddentEditFlag: Yup.boolean(),
                        name: Yup.string()
                          .trim()
                          .matches(
                            /^[a-zA-Z][a-zA-Z ]+$/,
                            "Please enter only alphabets and spaces"
                          )
                          .required("Please enter name"),
                        cnic: Yup.string()
                          .required("Please enter your CNIC")
                          .matches(
                            /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                            "Please enter a valid CNIC e.g. 37106-8234782-3"
                          ),
                        phone: Yup.string()
                          .required("Please enter phone")
                          .matches(
                            /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                            "Please enter a valid Pakistani phone number e.g. 03123456789"
                          ),
                        roles: Yup.string()
                          .trim()
                          .required("Please enter roles"),
                        territory_office: Yup.string()
                          .trim()
                          .required("Please territory office"),
                      })}
                      onSubmit={values => {
                        const newStaff = {
                          name: values.name,
                          cnic: values.cnic,
                          phone: values.phone,
                          territory_office: values.territory_office,
                          roles: values.roles,
                          city: values.city,
                        };

                        // save new Staff
                        onAddStaff(newStaff, this.props.match.params.id);

                        // if (this.props.staff.length != 0) {
                        //   this.props.history.push("/add-")
                        // }

                        setTimeout(() => {
                          console.log(this.props.staff);
                          console.log(this.props.staff[0].staff_type);
                          if (
                            this.props.staff &&
                            this.props.staff[0].staff_type == "CSR"
                          ) {
                            this.props.history.push("/csr-list");
                          } else if (
                            this.props.staff &&
                            this.props.staff[0].staff_type == "auditor"
                          ) {
                            this.props.history.push("/auditor-list");
                          } else if (
                            this.props.staff &&
                            this.props.staff[0].staff_type == "finance-officer"
                            
                          ) {
                            this.props.history.push("/finance-officer-list");
                          } else if (
                            this.props.staff &&
                            this.props.staff[0].staff_type == "marketer-admin"
                            
                          ) {
                            this.props.history.push("/marketer-admin-list");
                          }
                        }, 1000);
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
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        territory_office: staff.territory_office,
                                        roles: staff.roles,
                                        city: staff.city,
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
                                        cnic: e.target.value,
                                        phone: staff.phone,
                                        territory_office: staff.territory_office,
                                        roles: staff.roles,
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
                                        cnic: staff.cnic,
                                        phone: e.target.value,
                                        territory_office: staff.territory_office,
                                        roles: staff.roles,
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

                                     {/* territory_office field */}
                                                 
                                     <div className="mb-3">
                                                    <Label className="form-label">
                                                      Territory Office
                                                    </Label>
                                                    <Field
                                                      name="territory_office"
                                                      as="select"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            name: staff.name,
                                                            cnic: staff.cnic,
                                                            phone: staff.phone,
                                                            territory_office: e.target.value,
                                                            roles: staff.roles,
                                                            city: staff.city,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state.territory_office
                                                      }
                                                    >
                                                    <option value="">
                                                      ---Select Office---
                                                      </option>
                                                      <option value="Central Office">
                                                      Central Office
                                                      </option>
                                                      <option value="South Office">
                                                      South Office
                                                      </option>
                                                      <option value="North Office">
                                                      North Office
                                                      </option>
                                                   
                                                    </Field>
                                                  </div>

                              <div className="mb-3">
                                <Label className="form-label">Role</Label>
                                <Field
                                  name="roles"
                                  type="text"
                                  placeholder="Enter roles"
                                  value={this.state.staff.roles}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        territory_office: staff.territory_office,
                                        roles: e.target.value,
                                        city: staff.city,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.roles && touched.roles
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="roles"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                                {/* city field */}
                                <div className="mb-3">


                                <Label for="city" className="form-label">
                                  City
                                </Label>
                                    <Select
                                      name="city"
                                      component="Select"
                                      onChange={selectedGroup =>
                                        this.setState({
                                          city: selectedGroup.value,
                                        })
                                      }
                                      className={
                                        "defautSelectParent" +
                                        (errors.city && touched.city
                                          ? " is-invalid"
                                          : "")
                                      }
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          borderColor:
                                            errors.city && touched.city
                                              ? "#f46a6a"
                                              : "#ced4da",
                                        }),
                                      }}
                                      options={CITIES}
                                      placeholder="Select City..."
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

StaffInfo.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  staff: PropTypes.any,
  className: PropTypes.any,
  onAddStaff: PropTypes.func,
  // onGetTerritoriesList: PropTypes.func,
  // territoriesList: PropTypes.array,
};

const mapStateToProps = ({ staff , territoriesList}) => ({
  staff: staff.staff,
  // territoriesList:territoriesList.territoriesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddStaff: (staff, id) => dispatch(addStaff(staff, id)),
  // onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StaffInfo));
