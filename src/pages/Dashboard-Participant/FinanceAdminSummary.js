import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import backgroundImage from "../../assets/images/participant-Background.jpg.jpg";

// actions
import { getLabProfile } from "store/auth/labprofile/actions";

class LabSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      logo: "",
      completedAppointments: "",
      inProcessAppointments: "",
      monthlyRevenue: "",
      annualRevenue: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getLabProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        address: this.props.success.address,
        logo: process.env.REACT_APP_BACKENDURL + this.props.success.logo,
        completedAppointments: this.props.success.completed_appointments,
        inProcessAppointments: this.props.success.inprocess_appointments,
        monthlyRevenue: this.props.success.monthly_revenue,
        annualRevenue: this.props.success.annual_revenue,
      });
    }, 1500);
  }

  handleProfileClick = () => {
    this.props.history.push("/lab-profile");
  };
  render() {
    const styles = {
      pageWrapper: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        position: "relative",
      },
      cardContainer: {
        maxWidth: "600px",
        borderRadius: "12px",
        padding: "30px 20px",
        backgroundColor: "#0055e9",
        opacity: 0.95,
      },
      heading: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "38px",
        marginBottom: "20px",
        textTransform: "uppercase",
      },
      paragraph: {
        color: "#cbd6e6",
        fontSize: "16px",
        marginBottom: "40px",
        lineHeight: "1.6",
        maxWidth: "500px",
        margin: "0 auto",
      },
      button: {
        backgroundColor: "#022e4b",
        borderColor: "#022e4b",
        fontSize: "18px",
        padding: "12px 30px",
        borderRadius: "8px",
      },
      semiCircle: {
        width: "120px",
        height: "60px",
        backgroundColor: "#022e4b",
        borderTopLeftRadius: "120px",
        borderTopRightRadius: "120px",
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
      },
    };

    return (
      <React.Fragment>
        <div style={styles.pageWrapper}>
          <Row className="justify-content-center">
            <Col>
              <Card style={styles.cardContainer}>
                <CardBody className="text-white">
                  <h3>
                    <p style={styles.paragraph}>
                      Welcome to the New NHS-NEQAS Participant Portal!
                      <br />
                      <br />
                      You are now accessing our upgraded platform, powered by
                      Latest Technology for faster, smarter, and more secure
                      performance. Thank you for being a valued part of the
                      NHS-NEQAS network – together, we raise the standards of
                      laboratory quality!
                    </p>
                  </h3>
                  <br />
                  <Button
                    style={styles.button}
                    onClick={this.handleProfileClick}
                  >
                    View Profile
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <div style={styles.semiCircle}></div>
        </div>
      </React.Fragment>
    );
  }
}

LabSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.LabProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getLabProfile })(withTranslation()(LabSummary))
);
