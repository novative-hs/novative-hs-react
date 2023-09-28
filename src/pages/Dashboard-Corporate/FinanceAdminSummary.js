import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getStaffProfile } from "store/auth/staffprofile/actions";

class FinanceAdminSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      // approvedLabs: "",
      // pendingLabs: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getStaffProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        // name: this.props.success.name,
        // email: this.props.success.email,
        // approvedLabs: this.props.success.approved_labs,
        // pendingLabs: this.props.success.pending_labs,
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
          </Card>
        </Col>

      </React.Fragment>
    );
  }
}

FinanceAdminSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getStaffProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.StaffProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getStaffProfile })(
    withTranslation()(FinanceAdminSummary)
  )
);
