import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {
  FaHome,
  FaChartBar,
  FaNewspaper,
  FaUsers,
  FaHistory,
  FaQuestionCircle,
  FaUserEdit,
} from "react-icons/fa";
import Select from "react-select";
import { Container, Col, Row } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { gethomedata } from "store/home/actions";
import axios from "axios";
import "assets/scss/table.scss";
import { method } from "lodash";
import bgImage from "../../assets/images/newbg1.png";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization_name: "",
      schemes: [],
      purchased_schemes: [],
      payments: [],
      open_rounds: [],
      report_available_rounds: [],
      notifications: [],
      lab_name: "", // if you want to show lab name
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    console.log("USER ID from localStorage:", this.state.user_id);
  }

  componentDidMount() {
    const { user_id } = this.state;
    if (user_id) {
      this.props.gethomedata(user_id); // ✅ Dispatch Redux action
    }
    if (user_id) {
      this.props.gethomedata(user_id);
    }
    console.log("schemes", gethomedata);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.home !== this.props.home && this.props.home) {
      const {
        name,
        schemes,
        purchased_schemes,
        payment_details,
        open_rounds,
        report_available_rounds,
        news,
      } = this.props.home;

      this.setState({
        schemes: schemes || [],
        purchased_schemes: purchased_schemes || [],
        payments: payment_details?.payments || [],
        open_rounds: open_rounds || [],
        report_available_rounds: report_available_rounds || [],
        notifications: news || [],
        lab_name: name || "",
      });
    }
  }
  handleEnroll = schemeId => {
    // Example: Save selected scheme ID, or do nothing if not needed
    console.log("Enrolling in scheme ID:", schemeId);
    // Optionally store in localStorage or Redux if needed in the Pay page
  };
  formatDate = dateStr => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" }); // e.g., "July"
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of year
    return `${day}/${month}/${year}`;
  };

  render() {
    const { schemes } = this.state;
    const organization_name =
      localStorage.getItem("organization_name") || "default-org";

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Home Page | NEQAS</title>
          </MetaTags>
          <Container
            fluid
            className="d-flex justify-content-center align-items-center p-5 mt-5"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              overflow: "hidden",
              zIndex: "-1", // pushes background behind content
            }}
          >
            {/* Transparent white overlay around content */}
            <div
              className="w-100 h-100"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                maxHeight: "100vh", // ✅ prevent overflow
              }}
            >
              <Row className="w-100 h-100">
                {/* Left content */}
                <Col md={9} className="p-5 w-75 h-75 shadow-lg rounded-4 mt-3">
                  <div
                    className="d-flex shadow-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.7)", // light background
                      padding: "8px 16px",
                      borderRadius: "8px",
                    }}
                  >
                    <h4
                      className="text-primary"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "tahoma",
                        margin: 0,
                      }}
                    >
                      Welcome! {this.state.lab_name}
                    </h4>
                  </div>

                  {/* First Row */}
                  <Row className="mt-5">
                    <Col md={6}>
                      <div
                        className="p-4 bg-light shadow-lg rounded-4"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <h5
                          className="mb-3 text-primary"
                          style={{ fontWeight: "bold" }}
                        >
                          Schemes
                        </h5>
                        <table className="table table-sm table-bordered table-striped mb-0">
                          <thead className="table-light">
                            <tr>
                              <th
                                className="text-start"
                                style={{ fontWeight: "bold" }}
                              >
                                Scheme Name
                              </th>
                              <th
                                className="text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Enrollement
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-start">
                            {this.state.schemes.map((scheme, index) => {
                              const isPurchased =
                                this.state.purchased_schemes.some(
                                  ps =>
                                    ps.id === scheme.id ||
                                    ps.scheme_id === scheme.id
                                );

                              return (
                                <tr key={scheme.id || index}>
                                  <td style={{ fontWeight: 500 }}>
                                    {scheme.name}
                                  </td>
                                  <td className="text-center">
                                    {isPurchased ? (
                                      <span className="text-primary">
                                        Enrolled
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Col>

                    <Col>
                      <div
                        className="p-4 bg-light shadow-lg rounded-4 h-100"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <h5
                          className="mb-3 text-primary"
                          style={{ fontWeight: "bold" }}
                        >
                          Open Rounds
                        </h5>
                        <table className="table table-sm table-bordered table-striped mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start">Round</th>
                              {/* <th className="text-start">Start Date</th> */}
                              <th className="text-start">Closing Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.open_rounds.map(round => (
                              <tr key={round.id}>
                                <td className="text-start">
                                  {round.rounds} - {round.scheme_name}
                                </td>

                                <td className="text-start">
                                  {this.formatDate(round.closing_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>

                  {/* Second Row */}
                  <Row className="mt-5 align-items-stretch">
                    <Col>
                      <div
                        className="p-4 bg-light shadow-lg rounded-4 h-100 d-flex flex-column"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <h5
                          className="mb-3 text-primary"
                          style={{ fontWeight: "bold" }}
                        >
                          Reports
                        </h5>
                        <table className="table table-sm table-bordered table-striped mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start">Scheme Name</th>
                              <th className="text-start">Round Code</th>
                              <th className="text-start">Closing Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.report_available_rounds.map(
                              (round, index) => (
                                <tr key={index}>
                                  <td className="text-start">
                                    {round.scheme_name}
                                  </td>
                                  <td className="text-start">{round.rounds}</td>
                                  {/* <td className="text-start">
                                    {round.status === "Report Available" && (
                                      <Tooltip title="View Report">
                                        {round.scheme_type ===
                                        "Quantitative" ? (
                                          <Link
                                            to={`/${organization_name}/${round.id}/${round.lab_id}/report1_view`}
                                            className="fas fa-file-alt text-primary font-size-18"
                                          />
                                        ) : (
                                          <Link
                                            to={`/${organization_name}/${round.id}/${round.lab_id}/qualitative_report_view`}
                                            className="fas fa-file-alt text-success font-size-18"
                                          />
                                        )}
                                      </Tooltip>
                                    )}
                                  </td> */}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Col>

                    <Col>
                      <div
                        className="p-4 bg-light shadow-lg rounded-4 h-100 d-flex flex-column"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <h5
                          className="mb-3 text-primary"
                          style={{ fontWeight: "bold" }}
                        >
                          Payments
                        </h5>
                        <table className="table table-sm table-bordered table-striped mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-center">Date</th>
                              <th className="text-center">Settlement</th>
                              <th className="text-center">Paid (Rs)</th>
                              <th className="text-center">Remaining (Rs)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.payments.map((payment, idx) => (
                              <tr key={idx}>
                                <td className="text-start">
                                  {this.formatDate(payment.paydate) || "—"}
                                </td>
                                <td className="text-center">
                                  {payment.payment_settlement || "—"}
                                </td>
                                <td className="text-end">
                                  {payment.price
                                    ? `${parseInt(
                                        payment.price
                                          .toString()
                                          .replace(/,/g, ""),
                                        10
                                      ).toLocaleString()}`
                                    : "-"}
                                </td>

                                <td className="text-end">
                                  {payment.remaining_amount ?? "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col
                  md={3}
                  className="w-25 p-4 mt-4"
                  style={{ marginBottom: "70px" }} // ✅ margin from bottom
                >
                  <div className="bg-light p-4 shadow-lg h-100 rounded-4 d-flex flex-column">
                    <h5
                      className="text-primary mb-2"
                      style={{ fontWeight: "bold" }}
                    >
                      Notifications
                    </h5>
                    <ul
                      className="list-unstyled flex-grow-1"
                      style={{ overflowY: "auto" }}
                    >
                      {this.state.notifications.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="mb-2">
                          <strong>{item.title}</strong>
                          <br />
                          <small>{item.date}</small>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-2 border-top text-end">
                      <Link
                        to={`/${this.state.organization_name}/newspage`}
                        className="text-primary text-decoration-none"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,
  gethomedata: PropTypes.func,
  home: PropTypes.array,
};

const mapStateToProps = state => ({
  home: state.home.home,
  // organization_name: state.auth.organization_name,
});

const mapDispatchToProps = dispatch => ({
  gethomedata: id => dispatch(gethomedata(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
