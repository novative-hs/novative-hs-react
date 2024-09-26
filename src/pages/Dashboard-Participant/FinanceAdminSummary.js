import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

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
      inProcessAppointments: "",
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
    this.props.history.push("/lab-profile"); // Redirect to /lab-profile
  };

  render() {
    // Inline styles with more circles
    const styles = {
      pageWrapper: {
        backgroundColor: "#92c1e4", // Dark teal background
        height: "100vh", // Full height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center", // Center align text
        padding: "20px",
        position: "relative", // For absolute positioning of elements
      },
      cardContainer: {
        maxWidth: "600px",
        borderRadius: "12px", // Rounded corners
        padding: "30px 20px", // More padding for cleaner look
        backgroundColor: "#0055e9", // Dark blue card background
      },
      heading: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "38px",
        marginBottom: "20px",
        textTransform: "uppercase",
      },
      subheading: {
        color: "#ffffff",
        fontSize: "22px",
        marginBottom: "30px",
      },
      paragraph: {
        color: "#cbd6e6",
        fontSize: "16px",
        marginBottom: "40px",
        lineHeight: "1.6",
        maxWidth: "500px",
        margin: "0 auto", // Center text
      },
      button: {
        backgroundColor: "#022e4b",
        borderColor: "#022e4b",
        fontSize: "18px",
        padding: "12px 30px",
        borderRadius: "8px",
      },
      // Adjusting the circle sizes and adding more circles
      smallCircle: {
        width: "60px", // Small circle
        height: "60px",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
      },
      largeCircle: {
        width: "100px", // Larger circle
        height: "100px",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        position: "absolute",
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
        {/* Welcome Page */}
        <div style={styles.pageWrapper}>
          {/* Adding more circles */}
          <div style={{ ...styles.smallCircle, top: "20%", left: "10%" }}></div>
          <div style={{ ...styles.largeCircle, top: "30%", right: "10%" }}></div>
          <div style={{ ...styles.smallCircle, top: "50%", left: "30%" }}></div>
          <div style={{ ...styles.largeCircle, top: "60%", right: "20%" }}></div>
          <div style={{ ...styles.smallCircle, top: "10%", right: "30%" }}></div>
          <div style={{ ...styles.largeCircle, bottom: "20%", left: "40%" }}></div>

          <Row className="justify-content-center">
            <Col>
              <Card style={styles.cardContainer}>
                <CardBody>
                  <h1 style={styles.heading}>{this.state.name}, Welcome to Login Dashboard</h1>
                  <p style={styles.paragraph}>
                  {/* Your role belongs to Registration Admin, */}
                  In which you can See Round List, Performance, Reports, and also you can enter Your Active Analyte Results.
                  You can see Latest News. 
                  <b>To know more</b>, please visit Upper <b>Navbar/Menubar.</b>
                  </p>
                  <br></br>

                  <Button style={styles.button} onClick={this.handleProfileClick}>
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
