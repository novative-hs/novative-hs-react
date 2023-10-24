import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getSampleCollectorProfile } from "store/auth/samplecollectorprofile/actions";

class SampleCollectorSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      photo:"",
      samplesCollected: "",
      samplesInprocess: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getSampleCollectorProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        // name: this.props.success.name,
        // phone: this.props.success.phone,
        // photo: process.env.REACT_APP_BACKENDURL + this.props.success.photo,
        // samplesCollected: this.props.success.samples_collected,
        // samplesInprocess: this.props.success.samples_inprocess,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        {/* Welcome profile */}
        <Col xl="4">
          <Card className="overflow-hidden">
            <div className="bg-primary bg-soft">
              <Row>
                <Col xs="7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>Lab Hazir Dashboard</p>
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img src={profileImg} alt="" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody className="pt-4">
              <Row>
                <Col sm="12">
                  <div className="pt-4">
                    <Row>
                      <Col xs="6">
                      <div className="avatar-md profile-user-wid mb-4">
                  <img
                    src={this.state.photo}
                    alt=""
                    className="img-thumbnail rounded-circle"
                  />
                </div>
                        <h5 className="font-size-15 text-truncate">
                          {this.state.name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.phone}
                        </p>
                      </Col>
                      <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={"/sample-collector-profile"}
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* Revenue and Appointment Details */}
        <Col xl="8">
          <Row>
            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Samples Inprocess</p>
                      <h4 className="mb-0">{this.state.samplesInprocess}</h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-list-ul font-size-24"} />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Samples Collected</p>
                      <h4 className="mb-0">{this.state.samplesCollected}</h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-list-check font-size-24"} />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

SampleCollectorSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getSampleCollectorProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.SampleCollectorProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getSampleCollectorProfile })(
    withTranslation()(SampleCollectorSummary)
  )
);
