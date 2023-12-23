import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Select from "react-select";
import { Collapse } from "reactstrap";
import { any } from "prop-types";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  Label,
  Input,
} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { isEmpty, map, size } from "lodash";
import { addToCart } from "store/actions";
import StarRatings from "react-star-ratings";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { onlyMedicalTestList } from "store/only-medical-tests-list/actions";
import { getTerritoriesList } from "store/territories-list/actions";
import { getQuotes } from "store/quotes/actions";

import "assets/scss/table.scss";
import quotes from "store/quotes/reducer";

class MedicalTestList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      territoriesList: [],
      onlyMedicalTestList: [],
      test_name: [], // Use an array to store multiple selections
      quotes: [],
      quote: "",
      id: "",
      searchQuery: "", // New state property for search query
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      onlyMedicalTestList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      loading: true, // Add loading state proper
      page: "1",
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { onlyMedicalTestList, onGetonlyMedicalTestList } = this.props;
    onGetonlyMedicalTestList(this.state.user_id);
    this.setState({ onlyMedicalTestList });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000); // Set loading state to false after 7 seconds
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  onchangename = selectedOptions => {
    const selectedValues = selectedOptions.map(option => option.value);
    this.setState({
      test_name: selectedValues,
    });
  };
  handleAddToCart = cart => {
    console.log("1stttt", cart);
    const { onAddToCart } = this.props;
    const { offered_tests } = cart;
    console.log("2nd", offered_tests);
    // Check if there are offered tests in the nearbyTest
    if (offered_tests && offered_tests.length > 0) {
      offered_tests.forEach(offeredTest => {
        console.log("3rddd", offeredTest);
        // const { id:id } = offeredTest;
        if (!this.state.user_id) {
          // Check if the item is already in the cart
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          this.setState({ guest_id: this.props.match.params.guest_id });
          offeredTest.guest_id = this.props.match.params.guest_id;
          onAddToCart(offeredTest, offeredTest.guest_id);

          console.log(
            "uuid:",
            offeredTest.guest_id,
            this.props.match.params.guest_id
          );
        } else if (
          this.state.user_type !== "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the cart
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.state.user_id);
        } else if (
          this.state.user_type === "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.guest_id);
        } else if (
          this.state.user_type === "b2bclient" &&
          this.state.user_type !== "CSR"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.uuid);
        }
      });
      this.showSuccessMessage("Item added Successfully");
    } else {
      // Show error message if there are no offered tests
      this.showErrorMessage("No offered tests to add to the cart");
    }
  };
  showErrorMessage = message => {
    this.showPopup(message, "red");
  };

  showSuccessMessage = message => {
    this.showPopup(message, "green");
  };
  showPopup = (message, textColor) => {
    // Create and style the popup
    const popup = document.createElement("div");
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";

    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.top = "50%";
    popupContent.style.left = "50%";
    popupContent.style.transform = "translate(-50%, -50%)";
    popupContent.style.background = "#fff";
    popupContent.style.padding = "20px";
    popupContent.style.borderRadius = "5px";
    popupContent.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

    const messageElement = document.createElement("div");
    messageElement.style.fontSize = "18px";
    messageElement.style.textAlign = "center";
    messageElement.style.color = textColor; // Set the text color

    // Set the message
    messageElement.textContent = message;

    // Append elements to the DOM
    popupContent.appendChild(messageElement);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    // Show the popup
    popup.style.display = "block";

    // Hide the popup after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000); // 3000 milliseconds = 3 seconds
  };
  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  shouldHighlightTestsLink() {
    const { location } = this.props;
    const currentURL = location.pathname;

    // Check if the URL contains "nearby-test"
    return currentURL.includes("/tests-offered-labhazir/");
  }
  render() {
    const { SearchBar } = Search;
    const { loading } = this.state;
    const isTestsLinkHighlighted = this.shouldHighlightTestsLink();
    const linkStyles = {
      color: isTestsLinkHighlighted ? "black" : "black", // Text color
      // backgroundColor: isTestsLinkHighlighted ? '#ffcc00' : 'transparent', // Background color
      fontWeight: isTestsLinkHighlighted ? "bold" : "normal",
    };

    const { onlyMedicalTestList, quotes } = this.props;
    const { onGetonlyMedicalTestList, onGetQuotes } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: onlyMedicalTestList.length, // replace later with size(onlyMedicalTestList),
      custom: true,
    };
    const { searchQuery } = this.state;
    // const filteredTests = this.props.onlyMedicalTestList.filter(test =>
    //   test.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    const testList = [];
    for (let i = 0; i < this.props.onlyMedicalTestList.length; i++) {
      testList.push({
        label: this.props.onlyMedicalTestList[i].name,
        value: this.props.onlyMedicalTestList[i].id,
      });
    }

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

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
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                            : `/tests-offered-labhazir`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
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
                    {this.props.match.params.filnalurl ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    ) : (
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
                    )}

                    {this.props.match.params.filnalurl &&
                    this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Tests</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-test/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Tests</span>
                        </Link>
                      </li>
                    ) : null}
                    {this.props.match.params.filnalurl &&
                    this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Profiles</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                        </Link>
                      </li>
                    ) : null}

                    {this.props.match.params.filnalurl &&
                    this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Packages</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                        </Link>
                      </li>
                    ) : null}

                    {this.props.match.params.filnalurl &&
                    this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                        </Link>
                      </li>
                    ) : null}
                    {this.props.match.params.filnalurl &&
                    this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Book a Test
                          </span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Book a Test
                          </span>
                        </Link>
                      </li>
                    ) : null}

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
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                            : `/tests-offered-labhazir/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
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
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/tests-offered-labhazir`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
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
            {/* <title>Approved Donors | Lab Hazir</title> */}
          </MetaTags>
          <Container fluid>
            <Row>
              <Col xs="4" sm="4" md="2" lg="2">
                <div className="mb-3">
                  <Label for="city" className="form-label">
                    Select City
                  </Label>
                  <Select
                    name="city"
                    component="Select"
                    onChange={selectedGroup => {
                      const selectedCityId = selectedGroup.value;
                      this.setState({ city_id: selectedCityId });

                      // Check if both city and test name are selected before making the API call
                      if (selectedCityId && this.state.test_id) {
                        // Call your API here
                        console.log(
                          "Calling API with City:",
                          selectedCityId,
                          "and Test ID:",
                          this.state.test_id
                        );
                        const { onGetQuotes } = this.props;
                        onGetQuotes(selectedCityId, this.state.test_id);

                        // Set loading state
                        this.setState({ loading: true });

                        // Clear previous quotes
                        this.setState({ quotes: [] });

                        // Set loading state to false after 7 seconds
                        setTimeout(() => {
                          this.setState({ loading: false });
                        }, 7000);
                      } else {
                        console.log(
                          "City or Test ID not selected. API call not made."
                        );
                      }
                    }}
                    className="defautSelectParent"
                    options={cityList}
                    defaultValue={{
                      label: "Select City...",
                      value: this.state.id,
                    }}
                  />
                </div>
              </Col>

              <Col xs="4" sm="4" md="2" lg="2">
                <div className="mb-3">
                  <Label for="test_id" className="form-label">
                    Select Test Names
                  </Label>
                  <Select
                    name="test"
                    component="Select"
                    onChange={selectedTests => {
                      const selectedTestIds = selectedTests.map(
                        test => test.value
                      );
                      this.setState({ test_id: selectedTestIds });

                      // Check if both city and test name are selected before making the API call
                      if (this.state.city_id && selectedTestIds.length > 0) {
                        // Call your API here
                        console.log(
                          "Calling API with City:",
                          this.state.city_id,
                          "and Test IDs:",
                          selectedTestIds
                        );
                        const { onGetQuotes } = this.props;
                        onGetQuotes(this.state.city_id, selectedTestIds);

                        // Set loading state
                        this.setState({ loading: true });

                        // Clear previous quotes
                        this.setState({ quotes: [] });

                        // Set loading state to false after 7 seconds
                        setTimeout(() => {
                          this.setState({ loading: false });
                        }, 7000);
                      } else {
                        console.log(
                          "City or Test IDs not selected. API call not made."
                        );
                      }
                    }}
                    // value={testList.filter((item) => this.state.test_id.includes(item.value))}
                    isMulti={true}
                    className="defautSelectParent"
                    options={testList}
                  />
                </div>
              </Col>

              <div className="table-responsive">
                <Table className="table-nowrap">
                  <thead>
                    <tr>
                      <th className="text-start">Lab Name</th>
                      <th className="text-start">Test Name</th>
                      <th className="text-start">Price</th>
                      {/* <th className="text-center"> Total Price</th> */}
                      <th className="text-center"> Discount</th>
                      <th className="text-center"> Price after Discount</th>
                      <th className="text-center">
                        Total Price after Discount
                      </th>
                    </tr>
                  </thead>
                  {!isEmpty(quotes) &&
                    Array.isArray(quotes.top_lab_details_with_tests) &&
                    quotes.top_lab_details_with_tests.map(
                      (referrelFeeLab, key) => (
                        // console.log(
                        //   "hhshshhshshsh22222222",
                        //   quotes,
                        //   this.props.quotes
                        // ),
                        <tr
                          key={"_row_" + key}
                          style={{
                            backgroundColor:
                              key % 4 === 1
                                ? "#f2f2f2"
                                : key % 4 === 3
                                ? "#dcdcdc"
                                : "transparent",
                          }}
                        >
                          <td className="text-start py-2 pl-3 pr-4">
                            <div style={{ whiteSpace: 'normal' }}>
                              {/* <b>{referrelFeeLab.name}</b> */}
                            {!this.state.user_id ? (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  <b>{referrelFeeLab.name}</b>{" "}
                                  
                                </span>
                              </Link>
                              ):null}
                              {(this.state.user_id) && (this.state.user_type ==="CSR") && (this.state.user_type !=="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.guest_id
                           ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                           : `/nearby-lab-detail/${referrelFeeLab.account_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         <b>{referrelFeeLab.name}</b>{" "}

                       </span>
                     </Link>
                      )}
                            {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type !=="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.guest_id
                           ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                           : `/nearby-lab-detail/${referrelFeeLab.account_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         <b>{referrelFeeLab.name}</b>{" "}

                       </span>
                     </Link>
                      )}
                      {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type ==="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.guest_id
                           ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                           : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         <b>{referrelFeeLab.name}</b>{" "}

                       </span>
                     </Link>
                      )}
                      </div>
                            <div className="mt-1">
                              <StarRatings
                                rating={referrelFeeLab.rating}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="14px"
                                starSpacing="3px"
                              />
                            </div>
                          </td>
                          <td
                            className="text-start py-2 pl-3 pr-4"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {!isEmpty(referrelFeeLab.offered_tests) &&
                              referrelFeeLab.offered_tests.map(
                                (offeredTest, index) => (
                                  <div key={index}>{offeredTest.test_name}</div>
                                )
                              )}
                          </td>
                          <td className="text-end py-2 pl-3 pr-4">
                            {!isEmpty(referrelFeeLab.offered_tests) &&
                              referrelFeeLab.offered_tests.map(
                                (offeredTest, index) => (
                                  <div key={index}>
                                    {" "}
                                    {offeredTest.price
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </div>
                                )
                              )}
                          </td>
                          {/* <td className="text-center py-2 pl-3 pr-4">
                            {" "}
                            {referrelFeeLab.offered_tests
                              .reduce(
                                (total, offeredTest) =>
                                  total + offeredTest.price,
                                0
                              )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td> */}
                          <td className="text-end py-2 pl-3 pr-4">
                            {!isEmpty(referrelFeeLab.offered_tests) &&
                              referrelFeeLab.offered_tests.map(
                                (offeredTest, index) => (
                                  <div key={index}>
                                    {(
                                      offeredTest.discount +
                                      (offeredTest.discount_by_labhazir || 0)
                                    ).toFixed(2)}
                                  </div>
                                )
                              )}
                          </td>
                          <td className="text-end py-2 pl-3 pr-4">
                            {referrelFeeLab.offered_tests.map(
                              (offeredTest, index) => {
                                const discountByTest =
                                  offeredTest.discount || 0;
                                const discountByLabhazir =
                                  offeredTest.discount_by_labhazir || 0;
                                const totalDiscount =
                                  discountByTest + discountByLabhazir;
                                const discountedPrice = (
                                  offeredTest.price -
                                  (offeredTest.price * (totalDiscount * 100)) /
                                    100
                                )
                                  .toFixed()
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                return (
                                  <div key={index}> {discountedPrice}</div>
                                );
                              }
                            )}
                          </td>
                          <td className="text-end py-2 pl-3 pr-4">
                            {/* Calculate the price after applying multiple discounts for each test */}
                            {/* {referrelFeeLab.offered_tests.map(
                              (offeredTest, index) => {
                                const discountByTest =
                                  offeredTest.discount || 0;
                                const discountByLabhazir =
                                  offeredTest.discount_by_labhazir || 0;
                                  const totalDiscount =
                                  discountByTest + discountByLabhazir;
                                const discountedPrice = (
                                  offeredTest.price -
                                  (offeredTest.price * (totalDiscount * 100)) /
                                    100
                                ).toFixed(2);

                                return (
                                  <div key={index}>
                                    Test {index + 1}: {" "}
                                    {discountedPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </div>
                                );
                              }
                            )} */}

                            {/* Display the total of discounted prices */}
                            <div>
                              {" "}
                              {referrelFeeLab.offered_tests
                                .reduce((total, offeredTest) => {
                                  const discountByTest =
                                    offeredTest.discount || 0;
                                  const discountByLabhazir =
                                    offeredTest.discount_by_labhazir || 0;
                                  const totalDiscount =
                                  discountByTest + discountByLabhazir;
                                const discountedPrice = (
                                  offeredTest.price -
                                  (offeredTest.price * (totalDiscount * 100)) /
                                    100
                                );
                                  return total + Number(discountedPrice);
                                }, 0)
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                          </td>

                          <td>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1 text-white bg-primary btn-outline-primary"
                              onClick={() => {
                                this.handleAddToCart(referrelFeeLab);
                              }}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  {isEmpty(quotes) && (
                    <Row>
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry no result found.
                        </h4>
                      </div>
                    </Row>
                  )}
                </Table>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MedicalTestList.propTypes = {
  match: PropTypes.object,
  location: any,
  onlyMedicalTestList: PropTypes.array,
  className: PropTypes.any,
  menuOpen: PropTypes.any,
  quotes: PropTypes.array,
  onGetQuotes: PropTypes.func,
  onGetonlyMedicalTestList: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({
  onlyMedicalTestList,
  territoriesList,
  quotes,
  carts,
}) => ({
  onlyMedicalTestList: onlyMedicalTestList.onlyMedicalTestList,
  territoriesList: territoriesList.territoriesList,
  quotes: quotes.quotes,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetonlyMedicalTestList: () => dispatch(onlyMedicalTestList()),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetQuotes: (city_id, test_id) => dispatch(getQuotes(city_id, test_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MedicalTestList));