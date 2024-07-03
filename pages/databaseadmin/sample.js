import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import { Card, CardBody, Col, Container, Row, Label, Button } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getAnalytelist } from "store/databaseofunits/actions";
import { getSample, addSample } from "store/sample/actions";

class SampleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListUnit: [],
      SampleList: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { onGetSample, onGetAnalyte } = this.props;
    onGetSample(this.state.user_id);
    onGetAnalyte(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ListUnit !== this.props.ListUnit) {
      this.setState({ ListUnit: this.props.ListUnit });
      console.log("Analyte list updated:", this.props.ListUnit);
    }

    if (prevProps.sample !== this.props.sample) {
      this.setState({ SampleList: this.props.sample });
      console.log("Sample list updated:", this.props.sample);
    }
  }

  render() {
    const { ListUnit, SampleList } = this.state;
    const listUnitOptions = ListUnit.map(unit => ({
      label: unit.name,
      value: unit.id,
    }));
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Sample</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Sample" breadcrumbItem="Sample List" />
            <Row className="mb-2 d-flex justify-content-center">
              <Col lg="8">
                <Card>
                  <CardBody>
                    {SampleList.map((item, key) => (
                      <Card key={key} className="mb-2">
                        <CardBody>
                          <h5>{item.sampleno}</h5>
                          <p>{item.details}</p>
                          <p>{item.notes}</p>
                          <p>{item.scheme}</p>
                          <p>
                            <b>Added by:</b> {item.added_by} <br />
                            <b>Date:</b> {moment(item.date_of_addition).format("DD MMM YYYY, h:mm A")}
                          </p>
                        </CardBody>
                      </Card>
                    ))}

                    <Formik
                      initialValues={{
                        sampleno: "",
                        details: "",
                        notes: "",
                        scheme: ""
                      }}
                      validationSchema={Yup.object().shape({
                        sampleno: Yup.string().required("Sample No is required"),
                        details: Yup.string().required("Details required"),
                        scheme: Yup.string().required("Scheme is required"),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        const userId = localStorage.getItem("authUser")
                          ? JSON.parse(localStorage.getItem("authUser")).user_id
                          : "";
                        const newSample = {
                          sampleno: values.sampleno,
                          details: values.details,
                          notes: values.notes,
                          scheme: values.scheme,
                          added_by: userId,
                        };
                        console.log('Submitting newSample:', newSample);
                        this.props.onAddSample(newSample);
                        resetForm();
                      }}
                    >
                      {({ errors, touched }) => (
                        <Card style={{ backgroundColor: '#E8E7E7' }}>
                          <CardBody>
                            <Form>
                              <Row>
                                <Col className="col-12">
                                  <div className="mb-3">
                                    <Label className="form-label">Sample No</Label>
                                    <Field
                                      name="sampleno"
                                      type="number"
                                      className={"form-control" + (errors.sampleno && touched.sampleno ? " is-invalid" : "")}
                                    />
                                    <ErrorMessage name="sampleno" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="mb-3">
                                    <Label className="form-label">Details</Label>
                                    <Field
                                      name="details"
                                      as="textarea"
                                      rows="3"
                                      className={"form-control" + (errors.details && touched.details ? " is-invalid" : "")}
                                    />
                                    <ErrorMessage name="details" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="mb-3">
                                    <Label className="form-label">Notes</Label>
                                    <Field
                                      name="notes"
                                      as="textarea"
                                      rows="3"
                                      className={"form-control" + (errors.notes && touched.notes ? " is-invalid" : "")}
                                    />
                                    <ErrorMessage name="notes" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="mb-3">
                                    <Label className="form-label">Use Scheme Analytes</Label>
                                    <Field
                                      name="scheme"
                                      as="select"
                                      className={"form-control" + (errors.scheme && touched.scheme ? " is-invalid" : "")}
                                      multiple={false}
                                    >
                                      <option value="">Select Scheme Type</option>
                                      {listUnitOptions.map(scheme => (
                                        <option key={scheme.value} value={scheme.value}>
                                          {scheme.label}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage name="scheme" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="text-end">
                                    <button type="submit" className="btn btn-success save-user" style={{ backgroundColor: '#0000CD', borderColor: '#0000CD' }}>
                                      Post
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Card>
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

SampleList.propTypes = {
  sample: PropTypes.array,
  onGetSample: PropTypes.func.isRequired,
  onGetAnalyte: PropTypes.func,
  ListUnit: PropTypes.array,
  onAddSample: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  sample: state.sample.sample || [], // Ensure this is an array
  ListUnit: state.ListUnit.ListUnit || [], // Ensure this is an array
});

const mapDispatchToProps = (dispatch) => ({
  onGetSample: (id) => dispatch(getSample(id)),
  onGetAnalyte: (id) => dispatch(getAnalytelist(id)),
  onAddSample: (sample) => dispatch(addSample(sample)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SampleList));
