import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { Collapse } from "reactstrap";
import logo from "../../../assets/images/logo.svg";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";
import StarRatings from "react-star-ratings";

//i18n
import { withTranslation } from "react-i18next";
import "../../../components/HorizontalLayout/horizontal-navbar.scss";


// import ScrollButton from "components/Common/Scrollbutton";
import {
  Card,
  Button,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Alert,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";
import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { any } from "prop-types";

import { getOfferedTestsReferrel } from "store/offered-tests/actions";
import { addToCart } from "store/actions";

class TestsOffered extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
      user_type: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).account_type
      : "",
      patient_name: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).patient_name
      : "",
      position: "right",
      activeTab: "1",
      offeredTests: [],
      carts: [],
      cart: "",
      success: "",
      error: "",
      applied: true,
      page: 1,
      // count: 0,
      totalPage: 5, //replace this with total pages of data
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    const { ongetOfferedTestsReferrel } = this.props;
    if (this.state.applied) {
      ongetOfferedTestsReferrel();
      this.setState({ offeredTests: this.props.offeredTests });
    }

    const { onGetCarts } = this.props;
    onGetCarts(this.state.user_id);
    this.setState({ carts: this.props.carts });
  }
  // incrementCart = () =>{
  //   this.setState({count: this.state.count + 1})
  //    }

  // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // const { offeredTests } = this.props;
  //   // if (
  //   //   isEmpty(prevProps.offeredTests) &&
  //   //   !isEmpty(offeredTests) &&
  //   //   size(offeredTests) !== size(prevProps.offeredTests)
  //   // ) {
  //   //   this.setState({ offeredTests });
  //   // }
  //   // Timeout functions to hide alerts after sometime......
  //   // setTimeout(() => {
  //   //   this.setState({ success: "" });
  //   // }, 10000);
  //   // setTimeout(() => {
  //   //   this.setState({ error: "" });
  //   // }, 10000);
  // }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handlePageClick = page => {
    this.setState({ page });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
    });
  };

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openDescriptionModal = (e, arg) => {
    this.setState({
      DescriptionModal: true,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
      test_details: arg.test_details,
      test_name:arg.test_name,
    });
  };

  toggleDescriptionModal = () => {
    this.setState(prevState => ({
      DescriptionModal: !prevState.DescriptionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  handleAddToCart = cart => {
    const { onAddToCart } = this.props;

    if (!this.state.user_id) {
      // this.props.history.push("/login");
      this.setState({ guest_id: this.props.match.params.guest_id });
      cart.guest_id= this.props.match.params.guest_id
      onAddToCart(cart, cart.guest_id);

     console.log("uuid:", cart.guest_id, this.props.match.params.guest_id   ) 
    } 
    else {
      onAddToCart(cart, this.state.user_id);
    }
    setTimeout(() => {
      this.setState({ success: "Item added to the cart successfully.", });
      this.setState({ error: this.props.error });
    }, 1000);

  };
  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };
    handlePageClick = page => {
    this.setState({ page });
  };

  
  /**
   * Toggle sidebar
   */
  // toggleMenu() {
  //   this.props.openLeftMenuCallBack();
  // }

  /**
   * Toggles the sidebar
   */
  // toggleRightbar() {
  //   this.props.toggleRightSidebar();
  // }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  onUpdate = (render, handle, value) => {
    const { carts } = this.props;
    if (
      !isEmpty(carts) &&
      size(prevProps.carts) !== size(carts)
    ) {
      this.setState({ carts: {} });
    }
    this.setState({
      nearbyLabs: productsData.filter(
        nearbyLab =>
          nearbyLab.newPrice >= value[0] && nearbyLab.newPrice <= value[1]
      ),
    });
  };

  render() {
    const { page, totalPage } = this.state;
    const { offeredTests } = this.props.offeredTests;
    const { carts } = this.props;
    const offeredTest = this.state.offeredTest;

    return (
      <React.Fragment>
          <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {!this.state.user_id
              ? (
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

                     {/* <Link to="/nearby-tests" className="dropdown-item">
                       {this.props.t("Search by Tests")}
                     </Link> */}
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/nearby-tests/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/nearby-tests/${this.props.match.params.guest_id}`
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
                   <li className="nav-item">
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/nearby-radiology/${this.props.match.params.guest_id}`
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
                       <Link to="/nearby-tests" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}
 
                   {this.state.user_id && this.state.user_type == "patient" && (
                     <li className="nav-item">
                       <Link to={"/test-appointments"} className="dropdown-item">
                         {/* {this.props.t("My Appointments")} */}
                         <span className="pt-4 font-size-12">My Appointments</span>

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

              ): this.state.user_id ? (
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
                        ? `/nearby-labs/${this.props.match.params.uuid}`
                        : `/nearby-labs/`
                    }
                    className="dropdown-item"
                    >
                      <span className="pt-4 font-size-12">Labs</span>
                      {/* {this.props.t("Labs")} */}
                    </Link>
                  </li>

                  <li className="nav-item">
                    {/* <Link to="/nearby-tests" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                    <Link 
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-tests/${this.props.match.params.uuid}`
                        : `/nearby-tests/`
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
                      this.props.match.params.uuid
                        ? `/nearby-profiles/${this.props.match.params.uuid}`
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
                      this.props.match.params.uuid
                        ? `/nearby-packages/${this.props.match.params.uuid}`
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
                      this.props.match.params.uuid
                        ? `/nearby-radiology/${this.props.match.params.uuid}`
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
                      <Link to="/nearby-tests" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                  {this.state.user_id && this.state.user_type == "patient" && (
                    <li className="nav-item">
                      <Link to={"/test-appointments"} className="dropdown-item">
                        {/* {this.props.t("My Appointments")} */}
                        <span className="pt-4 font-size-12">My Appointments</span>

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
              ):null}
             
            </nav>
          </div>
        </div>
     
        <div className="page-content">
          <MetaTags>
            <title>Tests Offered | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Nearby Labs" breadcrumbItem="Tests Offered" />

            {this.state.success ? (
              window.location.reload()>
              <Alert color="success" className="col-md-4">
                {this.state.success}
              </Alert>
            ) : this.state.error ? (
              <Alert color="danger" className="col-md-5">
                {this.state.error}
              </Alert>
            ) : null}

            <Row>
              <Modal
                isOpen={this.state.DescriptionModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggleDescriptionModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-6">
                            <Label className="form-label">{this.state.test_name}</Label>
                              <br></br>
                              <Label className="form-label">English</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_english"
                                id="description_in_english"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_english}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">Urdu</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_urdu"
                                id="description_in_urdu"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_urdu}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={this.state.PatientModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.togglePatientModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">
                                Included Tests
                              </Label>
                            </div>
                            <textarea
                              name="test_details"
                              id="test_details"
                              rows="10"
                              cols="10"
                              value={this.state.test_details}
                              className="form-control"
                              readOnly={true}
                            />
                            {/* <div >
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.test_details
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>
             

              <Row>
                {!isEmpty(this.props.offeredTests) &&
                  this.props.offeredTests.map((offeredTest, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                "/media/" +
                                offeredTest.lab_logo
                              }
                              alt="Lab Logo"
                              style={{
                                width: "300px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                              className="img-fluid mx-auto d-block"
                            />
                          </div> */}

                          {/* <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {offeredTest.test_name}{" "}
                            </h5> */}
                          
                            {/* 
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-hand-holding-medical"></i>{" "}
                                {offeredTest.test_type}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                {offeredTest.price} Rs
                              </span>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                {offeredTest.discount} % Discount By Lab
                              </span>
                            </div>
                            {/* <div className="my-0">
                              <span className="text-muted me-2"> */}
                            {/* <i className="fas fa-money-bill"></i>{" "} */}
                            {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                            {/* {offeredTest.discount_by_labhazir} % Discount By LabHazir

                              </span>
                            </div> 

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-hand-holding-medical"></i>{" "}
                                Offered by {offeredTest.lab_name}
                              </span>
                            </div>

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {offeredTest.is_home_sampling_available}
                              </span>
                            </div> */}

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-medal"></i> EQA
                                Participation:{" "}
                                {offeredTest.is_eqa_participation}
                              </span>
                            </div> */}

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Test Performed:{" "}
                                {offeredTest.is_test_performed}
                              </span>
                          </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {offeredTest.duration_required}{" "}
                                {offeredTest.duration_type}
                              </span>
                            </div>

                            <div className="mt-3 text-center">
                              <Link
                                to="#"
                                onClick={e =>
                                  this.openDescriptionModal(e, offeredTest)
                                }
                              >
                                <span>Test Description</span>
                              </Link>
                            </div>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(offeredTest)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div> */}
                           <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {offeredTest.test_name}
                            </h5>
                            {offeredTest.test_type != "Test" && (
                              // <div className="mb-3">
                                <Link
                                  to="#"
                                  onClick={e =>
                                    this.openPatientModal(e, offeredTest)
                                  }
                                >
                                  <span>Included Tests</span>
                                </Link>
                              // </div>
                            )}
                            {offeredTest.test_type == "Test" && (
                              // <div className="mb-3">
                                <Link
                                  to="#"
                                  onClick={e =>
                                    this.openDescriptionModal(e, offeredTest)
                                  }
                                >
                                  <span>Test Description</span>
                                </Link>
                              // </div>
                            )}
                           
                            {/* </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                Rs {offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              </span>
                            </div>
                            {offeredTest.discount>=0.01 && (
                              <div className="my-0">
                              <span className="text-danger" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount: {(offeredTest.discount*100).toFixed()} % 
                              </span>
                            </div>
                            )}
                            <div className="my-0">
                              {" "}
                              {!this.state.user_id ? (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  {offeredTest.lab_name}{" "}
                                  
                                </span>
                              </Link>
                              ): this.state.user_id ? (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${offeredTest.lab_account_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  {offeredTest.lab_name}{" "}
                                  
                                </span>
                              </Link>
                              ):null}
                          
                              {/* <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Lab:{" "}
                                {offeredTest.lab_name}
                              </span> */}
                            </div>
                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {offeredTest.discount_by_labhazir} % Discount By Labhazir
                              </span>
                            </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {offeredTest.duration_required}{" "}
                                {offeredTest.duration_type}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {offeredTest.is_home_sampling_available}
                              </span>
                            </div>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(offeredTest)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.offeredTests) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry, no result found.
                        </h4>
                      </div>
                    </Col>
                  </Row>
                )}
              </Row>

              {/* <Row>
                <Col lg="12">
                  <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                    <PaginationItem disabled={page === 1}>
                      <PaginationLink
                        previous
                        href="#"
                        onClick={() => this.handlePageClick(page - 1)}
                      />
                    </PaginationItem>
                    {map(Array(totalPage), (item, i) => (
                      <PaginationItem active={i + 1 === page} key={i}>
                        <PaginationLink
                          onClick={() => this.handlePageClick(i + 1)}
                          href="#"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={page === totalPage}>
                      <PaginationLink
                        next
                        href="#"
                        onClick={() => this.handlePageClick(page + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </Col>
              </Row> */}
              {/* <ScrollButton /> */}
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

TestsOffered.propTypes = {
  match: PropTypes.object,
  history: any,
  location: PropTypes.any,
  offeredTests: PropTypes.array,
  ongetOfferedTestsReferrel: PropTypes.func,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
  className: PropTypes.any,
  carts: PropTypes.array,
  onGetCarts: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ offeredTests, carts }) => ({
  offeredTests: offeredTests.offeredTests,
  carts: carts.carts,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetOfferedTestsReferrel: () =>
    dispatch(getOfferedTestsReferrel(ownProps.match.params.lab_account_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetCarts: id => dispatch(getCarts(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsOffered));
