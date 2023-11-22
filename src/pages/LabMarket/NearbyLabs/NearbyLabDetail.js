import React, { Component } from "react";
import PropTypes, { number, string } from "prop-types";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { Collapse } from "reactstrap";

import * as Yup from "yup";

import { connect } from "react-redux";
import { Media } from "reactstrap";
import { map } from "lodash";

import FeedbackDetail from "pages/Feedbacks-List/FeedbackDetail";

import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./nearbylabs.scss";
//Import Star Ratings
import StarRatings from "react-star-ratings";

import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getLabProfile } from "store/auth/labprofile/actions";

class NearbyLabDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      // guest_id: localStorage.getItem("guest_id")
      // ? JSON.parse(localStorage.getItem("guest_id")).guest_id
      // : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      activeTab: "1",
      logo: "",
      name: "",
      rating: undefined,
      address: "",
      city: "",
      phone: "",
      email: "",
      offered_tests: "",
      offered_profiles: "",
      offered_packages: "",
      offered_radiologies: "",
      pathologists: "",
      quality_certificates: "",
      sample_collectors: "",
    };
  }
  componentDidMount() {
    this.props.getLabProfile(this.props.match.params.lab_account_id);
    console.log("hehe gid", this.props.match.params.guest_id);
    console.log("hehe uid", this.props.match.params.uuid);
    console.log("hehe fid", this.props.match.params.filnalurl);
  }

  render() {
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.user_id &&
              this.state.user_type === "CSR" &&
              this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.state.isMenuOpened}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}`
                            : `/nearby-test`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}`
                            : `/nearby-profiles`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}`
                            : `/nearby-packages`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
              {!this.state.user_id ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/labs/${this.props.match.params.guest_id}`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      {/* <Link to="/nearby-test" className="dropdown-item">
                       {this.props.t("Search by Tests")}
                     </Link> */}
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-test/${this.props.match.params.guest_id}`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-profiles/${this.props.match.params.guest_id}`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-packages/${this.props.match.params.guest_id}`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    {/* <li className="nav-item dropdown">
                     <Link
                       to="/#"
                       onClick={e => {
                         e.preventDefault();
                         this.setState({ appState: !this.state.appState });
                       }}
                       className="nav-link dropdown-toggle arrow-none"
                     >
                       <i className="bx bx-store me-2" />
                       {this.props.t("Lab Marketplace")}{" "}
                       <div className="arrow-down" />
                     </Link>
                     <div
                       className={classname("dropdown-menu", {
                         show: this.state.appState,
                       })}
                     >
                       <Link to="/nearby-labs" className="dropdown-item">
                         {this.props.t("Nearby Labs")}
                       </Link>
                       <Link to="/nearby-test" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                      /* <li className="nav-item dropdown">
                        <Link
                         to="/#"
                         onClick={e => {
                           e.preventDefault();
                           this.setState({ appState: !this.state.appState });
                         }}
                         className="nav-link dropdown-toggle arrow-none"
                       >
                         <i className="bx bx-test-tube me-2" />
                         {this.props.t("Appointments")}{" "}
                         <div className="arrow-down" />
                       </Link>
                       <div
                         className={classname("dropdown-menu", {
                           show: this.state.appState,
                         })}
                       >
                         <Link
                           to={"/test-appointments"}
                           className="dropdown-item"
                         >
                           {this.props.t("Test Appointments")}
                         </Link>
                       </div>
                       </li> */
                    )}
                  </ul>
                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                        {/* {this.props.t("Labs")} */}
                      </Link>
                    </li>

                    <li className="nav-item">
                      {/* <Link to="/nearby-test" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}`
                            : `/nearby-test/`
                        }
                        className="dropdown-item"
                      >
                        {/* {this.props.t("Tests")} */}
                        <span className="pt-4 font-size-12">Tests</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}`
                            : `/nearby-profiles/`
                        }
                        className="dropdown-item"
                      >
                        {/* {this.props.t("Profiles")} */}
                        <span className="pt-4 font-size-12">Profiles</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}`
                            : `/nearby-packages/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}`
                            : `/nearby-radiology/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    {/* <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ appState: !this.state.appState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-store me-2" />
                      {this.props.t("Lab Marketplace")}{" "}
                      <div className="arrow-down" />
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.appState,
                      })}
                    >
                      <Link to="/nearby-labs" className="dropdown-item">
                        {this.props.t("Nearby Labs")}
                      </Link>
                      <Link to="/nearby-test" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                      /* <li className="nav-item dropdown">
                           <Link
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              this.setState({ appState: !this.state.appState });
                            }}
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bx-test-tube me-2" />
                            {this.props.t("Appointments")}{" "}
                            <div className="arrow-down" />
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.appState,
                            })}
                          >
                            <Link
                              to={"/test-appointments"}
                              className="dropdown-item"
                            >
                              {this.props.t("Test Appointments")}
                            </Link>
                          </div>
                          </li> */
                    )}
                  </ul>
                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type === "b2bclient" ? (
                <Collapse
                  isOpen={this.state.isMenuOpened}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-test`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-profiles`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-packages`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
            </nav>
          </div>
        </div>
        <div className="page-content">
          <MetaTags>
            <title>Nearby Lab Detail | Lab Hazir - Dashboard</title>
          </MetaTags>

          {this.props.success ? (
            <Container fluid>
              <Breadcrumbs
                title="Lab Marketplace"
                breadcrumbItem="Nearby Lab Details"
              />

              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <div className="product-detai-imgs">
                        <Row>
                          <Col lx="5">
                            <div className="me-3">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  this.props.success.logo
                                }
                                alt=""
                                className="img-thumbnail mx-auto d-block rounded"
                              />
                            </div>
                            <div className="text-center">
                                  {!this.state.user_id && (
                                    <Link
                                      to={
                                        this.props.match.params.uuid
                                          ? `/nearby-labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                          : `/nearby-labs/${this.props.match.params.guest_id}`
                                      }
                                      className="btn btn-secondary mt-2 me-1"
                                    >
                                      <i className="bx bxs-shopping-bags" />{" "}
                                      Continue Browsing{" "}
                                    </Link>
                                  )}
                                  {this.state.user_id &&
                                    this.state.user_type !== "CSR" &&
                                    this.state.user_type !== "b2bclient" && (
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-labs/${this.props.match.params.guest_id}`
                                            : `/nearby-labs/`
                                        }
                                        className="btn btn-secondary mt-2 me-1"
                                      >
                                        <i className="bx bxs-shopping-bags" />{" "}
                                        Continue Browsing{" "}
                                      </Link>
                                    )}
                                  {this.state.user_id &&
                                    this.state.user_type === "CSR" &&
                                    this.state.user_type !== "b2bclient" && (
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-labs/${this.props.match.params.guest_id}`
                                            : `/nearby-labs`
                                        }
                                        className="btn btn-secondary mt-2 me-1"
                                      >
                                        <i className="bx bxs-shopping-bags" />{" "}
                                        Continue Browsing{" "}
                                      </Link>
                                    )}
                                  {this.state.user_id &&
                                    this.state.user_type !== "CSR" &&
                                    this.state.user_type === "b2bclient" && (
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-labs`
                                        }
                                        className="btn btn-secondary mt-2 me-1"
                                      >
                                        <i className="bx bxs-shopping-bags" />{" "}
                                        Continue Browsing{" "}
                                      </Link>
                                    )}
                                  <Link
                                    to={{
                                      pathname: `http://maps.google.com/?q=${this.props.success.address}`,
                                    }}
                                    className="btn btn-success ml-1 btn  mt-2"
                                    target="_blank"
                                  >
                                    <i className="bx bxs-navigation" /> Navigate
                                    to the Lab
                                  </Link>
                                  {/* {(this.props.success.complaint_handling_email ||
                                  this.props.success
                                    .complaint_handling_phone) && (
                                  <div className="text-muted float-start ms-3 mt-3">
                                    <h5>Help & Support</h5>
                                    {this.props.success
                                      .complaint_handling_email && (
                                      <p>
                                        <i className="bx bx-mail-send me-1 mt-3" />
                                        {
                                          this.props.success
                                            .complaint_handling_email
                                        }
                                      </p>
                                    )}

                                    {this.props.success
                                      .complaint_handling_phone && (
                                      <p>
                                        <i className="bx bx-phone-call me-1" />
                                        {
                                          this.props.success
                                            .complaint_handling_phone
                                        }
                                      </p>
                                    )}
                                  </div>
                                )} */}
                            {/* <div className="mb-3"> */}
                                </div>
                          </Col>
                          <Col lx="3">
                            <h2>{this.props.success.name}</h2>
                            {this.props.success ? (
                              <div className="text-muted float-start me-3">
                                <StarRatings
                                  rating={this.props.success.rating}
                                  starRatedColor="#F1B44C"
                                  starEmptyColor="#2D363F"
                                  numberOfStars={5}
                                  name="rating"
                                  starDimension="14px"
                                  starSpacing="3px"
                                />
                              </div>
                            ) : null}

                            <p className="font-size-16">
                              {this.props.success.rating}
                            </p>
                            <div className="text-muted float-start">
                              <p>
                                <i className="bx bxs-home-circle me-1" />
                                {this.props.success.address}
                              </p>
                              <p>
                                <i className="bx bxs-buildings me-1" />{" "}
                                {this.props.success.city}
                              </p>
                              <p>
                                <i className="bx bxs-phone-call me-1" />
                                {this.props.success.landline}
                              </p>
                              <p>
                                <i className="mdi mdi-email me-1" />
                                {this.props.success.email}
                              </p>
                              <p>
                                <i className="bx bxs-badge-check me-1" />
                                We have {this.props.success.lab_experience}{" "}
                                years of experience in the market
                              </p>
                              <div className="product-color">
                              {!this.state.user_id ? (
                          <Row className="mt-4">
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_tests === true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Tests{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_tests === false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right " />{" "}
                                    Offered Tests{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_profiles ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_profiles ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_packages ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Packages
                                  </Link>
                                )}
                                {this.props.success.offered_packages ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Packages{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_radiologies ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_radiologies ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.sample_collectors ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                                {this.props.success.sample_collectors ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className=" linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.pathologists === true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                                {this.props.success.pathologists === false && (
                                  <Link
                                    to="#"
                                    // className=" linklist btn btn-secondary btn-md"
                                    style={{ color: 'grey' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <Col sm="6" className="mx-auto">
                              {this.props.success.quality_certificates ===
                                true && (
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}`
                                  }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                              {this.props.success.quality_certificates ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className=" linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                            </Col>
                          </Row>
                        ) : null}
                        {this.state.user_id &&
                        this.state.user_type !== "CSR" &&
                        this.state.user_type !== "b2bclient" ? (
                          <Row className="mt-4">
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_tests === true && (
                                  <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/offered-test-by-lab`
                                  }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Tests{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_tests === false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right " />{" "}
                                    Offered Tests{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_profiles ===
                                  true && (
                                  <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/offered-profile-by-lab`
                                  }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_profiles ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_packages ===
                                  true && (
                                  <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/offered-package-by-lab`
                                  }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Packages
                                  </Link>
                                )}
                                {this.props.success.offered_packages ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Packages{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_radiologies ===
                                  true && (
                                  <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab`
                                  }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_radiologies ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.sample_collectors ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-sample-collectors`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                                {this.props.success.sample_collectors ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className=" linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.pathologists === true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-pathologists`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                                {this.props.success.pathologists === false && (
                                  <Link
                                    to="#"
                                    // className=" linklist btn btn-secondary btn-md"
                                    style={{ color: 'grey' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <Col sm="6" className="mx-auto">
                              {this.props.success.quality_certificates ===
                                true && (
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-quality-certificates`
                                  }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                              {this.props.success.quality_certificates ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className=" linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                            </Col>
                          </Row>
                        ) : null}
                        {this.state.user_id &&
                        this.state.user_type === "CSR" &&
                        this.state.user_type !== "b2bclient" ? (
                          <Row className="mt-4">
                          <div className="mb-2 row">
                            <Col sm="6">
                              {this.props.success.offered_tests === true && (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}`
                                }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />
                                  Offered Tests{" "}
                                </Link>
                              )}
                              {this.props.success.offered_tests === false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className="linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right " />{" "}
                                  Offered Tests{" "}
                                </Link>
                              )}
                            </Col>
                            <Col sm="6">
                              {this.props.success.offered_profiles ===
                                true && (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}`
                                }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />
                                  Offered Profiles{" "}
                                </Link>
                              )}
                              {this.props.success.offered_profiles ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className="linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />
                                  Offered Profiles{" "}
                                </Link>
                              )}
                            </Col>
                          </div>
                          <div className="mb-2 row">
                            <Col sm="6">
                              {this.props.success.offered_packages ===
                                true && (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}`
                                }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />
                                  Offered Packages
                                </Link>
                              )}
                              {this.props.success.offered_packages ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className="linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Offered Packages{" "}
                                </Link>
                              )}
                            </Col>
                            <Col sm="6">
                              {this.props.success.offered_radiologies ===
                                true && (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}`
                                }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />
                                  Offered Radiology{" "}
                                </Link>
                              )}
                              {this.props.success.offered_radiologies ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className="linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Offered Radiology{" "}
                                </Link>
                              )}
                            </Col>
                          </div>
                          <div className="mb-2 row">
                            <Col sm="6">
                              {this.props.success.sample_collectors ===
                                true && (
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}`
                                  }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Sample-Collectors{" "}
                                </Link>
                              )}
                              {this.props.success.sample_collectors ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className=" linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Sample-Collectors{" "}
                                </Link>
                              )}
                            </Col>
                            <Col sm="6">
                              {this.props.success.pathologists === true && (
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}`
                                  }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Pathologists{" "}
                                </Link>
                              )}
                              {this.props.success.pathologists === false && (
                                <Link
                                  to="#"
                                  // className=" linklist btn btn-secondary btn-md"
                                  style={{ color: 'grey' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Pathologists{" "}
                                </Link>
                              )}
                            </Col>
                          </div>
                          <Col sm="6" className="mx-auto">
                            {this.props.success.quality_certificates ===
                              true && (
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}`
                                }
                                // className="linklist btn btn-primary btn-md"
                                style={{ color: 'blue' }}
                              >
                                <i className="mdi mdi-arrow-right btn-block" />{" "}
                                Quality-Certificates{" "}
                              </Link>
                            )}
                            {this.props.success.quality_certificates ===
                              false && (
                              <Link
                                to="#"
                                style={{ color: 'grey' }}
                                // className=" linklist btn btn-secondary btn-md"
                              >
                                <i className="mdi mdi-arrow-right btn-block" />{" "}
                                Quality-Certificates{" "}
                              </Link>
                            )}
                          </Col>
                        </Row>
                        ) : null}
                        {this.state.user_id &&
                        this.state.user_type !== "CSR" &&
                        this.state.user_type === "b2bclient" ? (
                          <Row className="mt-4">
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_tests === true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Tests{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_tests === false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right " />{" "}
                                    Offered Tests{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_profiles ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-profile-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_profiles ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Profiles{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.offered_packages ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-package-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Packages
                                  </Link>
                                )}
                                {this.props.success.offered_packages ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Packages{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.offered_radiologies ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/offered-radiology-by-lab/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                                {this.props.success.offered_radiologies ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className="linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Offered Radiology{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <div className="mb-2 row">
                              <Col sm="6">
                                {this.props.success.sample_collectors ===
                                  true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                                {this.props.success.sample_collectors ===
                                  false && (
                                  <Link
                                    to="#"
                                    style={{ color: 'grey' }}
                                    // className=" linklist btn btn-secondary btn-md"
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Sample-Collectors{" "}
                                  </Link>
                                )}
                              </Col>
                              <Col sm="6">
                                {this.props.success.pathologists === true && (
                                  <Link
                                    to={
                                      this.props.match.params.uuid
                                        ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}`
                                    }
                                    // className="linklist btn btn-primary btn-md"
                                    style={{ color: 'blue' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                                {this.props.success.pathologists === false && (
                                  <Link
                                    to="#"
                                    // className=" linklist btn btn-secondary btn-md"
                                    style={{ color: 'grey' }}
                                  >
                                    <i className="mdi mdi-arrow-right btn-block" />{" "}
                                    Pathologists{" "}
                                  </Link>
                                )}
                              </Col>
                            </div>
                            <Col sm="6" className="mx-auto">
                              {this.props.success.quality_certificates ===
                                true && (
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}`
                                  }
                                  // className="linklist btn btn-primary btn-md"
                                  style={{ color: 'blue' }}
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                              {this.props.success.quality_certificates ===
                                false && (
                                <Link
                                  to="#"
                                  style={{ color: 'grey' }}
                                  // className=" linklist btn btn-secondary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              )}
                            </Col>
                          </Row>
                        ) : null}
                            </div>
                            </div>
                            
                          </Col>
                        </Row>
                        
                      </div>
                    </CardBody>
                  </Card>

                  {/* Insert Review Section */}
                  <FeedbackDetail />
                </Col>
              </Row>
            </Container>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.object,
  className: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
  onGetProductDetail: PropTypes.func,
  comments: PropTypes.array,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = state => {
  const { error, success } = state.LabProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getLabProfile })(
    withTranslation()(NearbyLabDetail)
  )
);
