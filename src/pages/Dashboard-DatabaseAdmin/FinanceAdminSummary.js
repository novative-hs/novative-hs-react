import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

// actions
import { getStaffProfile } from "store/auth/staffprofile/actions";

class FinanceAdminSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getStaffProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        email: this.props.success.email,
        approvedLabs: this.props.success.approved_labs,
        pendingLabs: this.props.success.pending_labs,
      });
    }, 1500);
  }

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
        backgroundColor: "#0176b5",
        borderColor: "#0176b5",
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
                  <h1 style={styles.heading}>{this.state.name}, Welcome to Login</h1>
                  <p style={styles.paragraph}>
                  Your role belongs to Database Admin,
                  in which you can enter and maintain your organization&apos;s data.
                  You can create and update scheme, cycle, and Sample.
                  <b>To know more</b>, please visit Upper <b>Navbar/Menubar.</b>
                  </p>
                  {/* <Button style={styles.button}>Get Started</Button> */}
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

FinanceAdminSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getStaffProfile: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { error, success } = state.StaffProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getStaffProfile })(
    withTranslation()(FinanceAdminSummary)
  )
);
