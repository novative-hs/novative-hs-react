import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { Alert, Col, Container, Row, Label, Card, CardBody } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

class CSRCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guest_id:"",
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>CSR Checkout | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Checkout"
              breadcrumbItem="CSR Checkout"
            />
            <Card>
              <CardBody>
                <Row className="g-0">
                  <div className="p-5">
                    <div className="w-100">
                      <h4>Please Select</h4>
                      <div className="mt-3 text-center">
                                  <p>
                                    Do not have an account?{" "}{" "}{" "}
                                    <Link
                                      // to={{ pathname: "/register" }}
                                      to={
                                        this.props.match.params.guest_id
                                          ? `/register/${this.props.match.params.guest_id}`
                                          : `/register`
                                      }
                                      className="fw-medium text-primary"
                                    >
                                      {" "}
                                      Register
                                    </Link>{" "}
                                  </p>
                                </div>
                                <div className="mt-3 text-center">
                                  <p>
                                   Already have an account?{" "}{" "}{" "}
                                    <Link
                                      // to={{ pathname: "/register" }}
                                      to={
                                        this.props.match.params.guest_id
                                          ? `/patients-list/${this.props.match.params.guest_id}`
                                          : `/patients-list`
                                      }
                                      className="fw-medium text-primary"
                                    >
                                      {" "}
                                      Proceed
                                    </Link>{" "}
                                  </p>
                                </div>
                      {/* <div>
                        <Link
                          className="btn btn-primary"
                          to={{
                            pathname:
                              process.env.REACT_APP_BACKENDURL +
                              "/media/public/medical-test-list.xlsx",
                          }}
                          target="_blank"
                        >
                          <i className="mdi mdi-download me-1" />
                          Download
                        </Link>{" "}
                      </div> */}
                    </div>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

CSRCheckout.propTypes = {
  match: PropTypes.object,

};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(CSRCheckout));
