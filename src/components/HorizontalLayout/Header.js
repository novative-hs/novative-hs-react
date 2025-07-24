import PropTypes from "prop-types";
import React, { Component } from "react";
import "react-drawer/lib/react-drawer.css";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import logo from "../../assets/images/neqas-logo.jpeg";
import logoLight from "../../assets/images/neqas-logo.jpeg";
import logoLightSvg from "../../assets/images/neqas-logo.jpeg";
import { withRouter } from "react-router-dom";
import {
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// i18n
import { withTranslation } from "react-i18next";
// Redux Store
import { toggleRightSidebar } from "../../store/actions";

import NotificationDropdown from "components/CommonForBoth/TopbarDropdown/NotificationDropdown";
import Navbar from "./Navbar";
import RegAdminNotificationDropdown from "components/CommonForBoth/TopbarDropdown/RegAdminNotificationDropdown";
import Tooltip from "@material-ui/core/Tooltip";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isSearch: false,
      open: false,
      user_name: "", // <== include this
      isOpen: false,
      dropdownOpen: false,
      isSmallScreen: false,
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      position: "right",
      isNavbarOpen: false, // controls whether the navbar is open or not
      dropdowns: {
        databaseDropdownOpen: false,
        participantDataDropdownOpen: false,
        databaseReviewDropdownOpen: false,
      },
    };
    console.log("Header constructor - User ID:", this.state.user_id); // ✅ Log added here

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
    this.props.openLeftMenuCallBack();
  }

  toggleNavbar() {
    console.log("Menu icon clicked. Toggling navbar state.");
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen, // Toggle navbar open/close state
    }));
  }

  toggleMenu() {
    this.props.openLeftMenuCallBack();
  }
  toggleDropdown(dropdownName) {
    this.setState((prevState) => ({
      dropdowns: {
        ...prevState.dropdowns,
        [dropdownName]: !prevState.dropdowns[dropdownName],
      },
    }));
  }

  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

  updateDimensions = () => {
    this.setState({ isSmallScreen: window.innerWidth < 800 });
  };

  componentDidMount() {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const userId = authUser?.user_id;

    if (userId) {
     fetch(`https://externalqcapi.com/api/lab/user-name/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API response:", data); // Log the whole response
          if (data.status === 200 && data.data?.name) {
            console.log("Fetched name:", data.data.name); // Log the name field
            this.setState({ user_name: data.data.name });
          } else {
            console.warn("Name not found in API response.");
          }
        })
        .catch((err) => console.error("Failed to load user name", err));
    } else {
      console.warn("No userId found in localStorage.");
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  toggleNavbar() {
    console.log("Menu icon clicked. Toggling navbar state.");
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen, // Toggle navbar open/close state
      isOpen: !prevState.isOpen, // Sync with the Collapse component
    }));
  }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
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

  render() {
    const { isNavbarOpen } = this.state;
    const isSmallScreen = window.innerWidth < 800;
    const shouldShowNavbar = isNavbarOpen && !isSmallScreen;

    const { isOpen, dropdownOpen, dropdowns } = this.state;
    const { organization_name } = this.props.match.params;
    return (
      <React.Fragment>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box" style={{ background: "white" }}>
                {/* Logo based on account type */}
                {/* Logo based on account type */}
                {[
                  "nhs",
                  "database-admin",
                  "registration-admin",
                  "organization",
                  "CSR",
                  "labowner",
                ].includes(this.state.account_type) && (
                  <span className="logo-sm">
                    <img
                      src="https://externalqcapi.com/media/organization/nhs_logo.webp"
                      alt="Logo"
                      height="60"
                    />
                  </span>
                )}
              </div>

              {/* Menu icon */}
              <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item navbar-toggler"
                onClick={this.toggleNavbar}
              >
                <i className="fa fa-fw fa-bars" />
              </button>
            </div>

            {/* Full screen button and profile menu */}
            <div className="d-flex align-items-center">
              {/* <div className="dropdown d-none d-lg-inline-block me-3">
      <Tooltip title="Full Screen">
        <button
          type="button"
          onClick={this.toggleFullscreen}
          className="btn header-item noti-icon"
          data-toggle="fullscreen"
        >
          <i className="bx bx-fullscreen"></i>
        </button>
      </Tooltip>
    </div> */}

              <div
                className="me-3 fw-semibold fs-4"
                style={{ fontFamily: "Times New Roman, Times, serif" }}
              >
                {this.state.user_name ? (
                  <>
                    {/* <span className="text-dark">Welcome: </span> */}
                    <span className="text-dark">{this.state.user_name}</span>
                  </>
                ) : this.state.user_id ? (
                  <>
                    {/* <span className="text-dark">Welcome: </span> */}
                    <span className="text-dark">{this.state.user_id}</span>
                  </>
                ) : (
                  <span className="text-dark"></span>
                )}
              </div>

              <ProfileMenu />
            </div>
          </div>

          {/* Navbar component */}
          <Navbar isOpen={isNavbarOpen} toggleNavbar={this.toggleNavbar} />

          {/* Additional navbar based on account type */}
          {shouldShowNavbar && (
            <div className="topnav">
              <div className="left-space">
                {this.state.account_type === "database-admin" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isNavbarOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <span
                            className="dropdown-item database-dropdown"
                            onMouseEnter={() =>
                              this.toggleDropdown("databaseDropdownOpen")
                            }
                          >
                            <span className="pt-4 font-size-12">Database</span>
                          </span>
                          <ul
                            className={
                              dropdowns.databaseDropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                            onMouseEnter={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  databaseDropdownOpen: true,
                                },
                              })
                            }
                            onMouseLeave={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  databaseDropdownOpen: false,
                                },
                              })
                            }
                          >
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-units`}
                                className="dropdown-item"
                              >
                                Database of units
                              </NavLink>
                            </li>

                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-equipmentType`}
                                className="dropdown-item"
                              >
                                Database of equipment type
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-manufactural`}
                                className="dropdown-item"
                              >
                                Database of manufacturer
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/equipment-list`}
                                className="dropdown-item"
                              >
                                Database of equipments
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-method`}
                                className="dropdown-item"
                              >
                                Database of method
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-reagents`}
                                className="dropdown-item"
                              >
                                Database of reagents
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-analyte`}
                                className="dropdown-item"
                              >
                                Database of Analytes
                              </NavLink>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <span
                            className="dropdown-item database-dropdown"
                            onMouseEnter={() =>
                              this.toggleDropdown("databaseReviewDropdownOpen")
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Database Review
                            </span>
                          </span>
                          <ul
                            className={
                              dropdowns.databaseReviewDropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                            onMouseEnter={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  databaseReviewDropdownOpen: true,
                                },
                              })
                            }
                            onMouseLeave={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  databaseReviewDropdownOpen: false,
                                },
                              })
                            }
                          >
                            <li>
                              <NavLink
                                to={`/${organization_name}/participantreport`}
                                className={({ isActive }) =>
                                  `dropdown-item ${
                                    isActive ? "active-dropdown" : ""
                                  }`
                                }
                              >
                                Participants Count
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/schemedetails`}
                                className={({ isActive }) =>
                                  `dropdown-item ${
                                    isActive ? "active-dropdown" : ""
                                  }`
                                }
                              >
                                Scheme Detail
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/payment-detail`}
                                className={({ isActive }) =>
                                  `dropdown-item ${
                                    isActive ? "active-dropdown" : ""
                                  }`
                                }
                              >
                                Payment Detail
                              </NavLink>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <span
                            className="dropdown-item participant-data-dropdown"
                            onMouseEnter={() =>
                              this.toggleDropdown("participantDataDropdownOpen")
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Participant Data
                            </span>
                          </span>
                          <ul
                            className={
                              dropdowns.participantDataDropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                            onMouseEnter={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  participantDataDropdownOpen: true,
                                },
                              })
                            }
                            onMouseLeave={() =>
                              this.setState({
                                dropdowns: {
                                  ...dropdowns,
                                  participantDataDropdownOpen: false,
                                },
                              })
                            }
                          >
                            <li>
                              <NavLink
                                to={`/${organization_name}/banks`}
                                className="dropdown-item"
                              >
                                Banks
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantcity`}
                                className="dropdown-item"
                              >
                                City
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantcountry`}
                                className="dropdown-item"
                              >
                                Country
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantprovince`}
                                className="dropdown-item"
                              >
                                Province
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantdistrict`}
                                className="dropdown-item"
                              >
                                District
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantdepartment`}
                                className="dropdown-item"
                              >
                                Department
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantdesignation`}
                                className="dropdown-item"
                              >
                                Designation
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participanttype`}
                                className="dropdown-item"
                              >
                                Participant Type
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${organization_name}/database-of-participantSector`}
                                className="dropdown-item"
                              >
                                Participant Sector
                              </NavLink>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/participants`}
                            className="dropdown-item"
                            style={({ isActive }) =>
                              isActive
                                ? {
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Participants
                            </span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/scheme`}
                            className="dropdown-item"
                            style={({ isActive }) =>
                              isActive
                                ? {
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            <span className="pt-4 font-size-12">Scheme</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/cycle`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Cycle</span>
                            {/* {this.props.t("Tests")} */}
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/sample`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Sample</span>
                            {/* {this.props.t("Tests")} */}
                          </NavLink>
                        </li>
                      </ul>
                    </Collapse>
                  </nav>
                )}
                {this.state.account_type &&
                  this.state.account_type === "organization" && (
                    <nav
                      className="navbar navbar-light navbar-expand-lg"
                      id="navigation"
                    >
                      <Collapse
                        isOpen={isNavbarOpen}
                        className="navbar-collapse"
                        id="topnav-menu-content"
                      >
                        <ul className="navbar-nav">
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/add-staff`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Add Staff
                              </span>
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/databaseadmin-list`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Database Admin
                              </span>
                              {/* {this.props.t("Profiles")} */}
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/registration-admin-list`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Registration Admin
                              </span>
                              {/* {this.props.t("Packages")} */}
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/csr-list`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">CSR</span>
                              {/* {this.props.t("Packages")} */}
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/all-participants`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Participants List
                              </span>
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/PaymentCSR`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              <span className="pt-4 font-size-12">Payment</span>
                            </NavLink>
                          </li>
                        </ul>
                      </Collapse>
                    </nav>
                  )}
                {this.state.account_type && this.state.account_type === "CSR" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isNavbarOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/register-participant-CSR`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Add Participant
                            </span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/all-participant2`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Participants List
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to={`/${organization_name}/PaymentCSR`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Payment</span>
                          </NavLink>
                        </li>
                      </ul>
                    </Collapse>
                  </nav>
                )}
                {/* {this.state.account_type && this.state.account_type === "CSR" && (
                    <nav
                      className="navbar navbar-light navbar-expand-lg"
                      id="navigation"
                    >
                      <Collapse
                        isOpen={isNavbarOpen}
                        className="navbar-collapse"
                        id="topnav-menu-content"
                      >
                        <ul className="navbar-nav">
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/register-participant-CSR`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Add Participant
                              </span>
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/all-participant2`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">
                                Participants List
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </Collapse>
                    </nav>
                  )} */}
                {this.state.account_type &&
                  this.state.account_type === "labowner" && (
                    <nav
                      className="navbar navbar-light navbar-expand-lg"
                      id="navigation"
                    >
                      <Collapse
                        isOpen={isNavbarOpen}
                        className="navbar-collapse"
                        id="topnav-menu-content"
                      >
                        <ul className="navbar-nav">
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/dashboard-participant`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              <span className="pt-4 font-size-12">Home</span>
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            {/* <NavLink to={"/rounds-participant"} className="dropdown-item"> */}
                            <NavLink
                              to={`/${organization_name}/rounds-participant`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">Rounds</span>
                            </NavLink>
                          </li>
                          {/* <li className="nav-item">
                              <NavLink
                                to={`/${organization_name}/performance`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">
                                  Performance
                                </span>
                              </NavLink>
                            </li> */}
                          <li className="nav-item">
                            <NavLink
                              to={`/${organization_name}/newspage`}
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">News</span>
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink to={`/help`} className="dropdown-item">
                              <span className="pt-4 font-size-12">Help</span>
                            </NavLink>
                          </li>

                          {this.state.user_id &&
                            this.state.user_type == "patient" && (
                              <li className="nav-item">
                                <NavLink
                                  to={"/test-appointments"}
                                  className="dropdown-item"
                                >
                                  {/* {this.props.t("My Appointments")} */}
                                  <span className="pt-4 font-size-12">
                                    My Appointments
                                  </span>
                                </NavLink>
                              </li>
                            )}
                        </ul>
                      </Collapse>
                    </nav>
                  )}
                {/* ... (existing code for other account types) */}
              </div>
            </div>
          )}
        </header>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.func,
  showRightSidebar: PropTypes.bool,
  toggleRightSidebar: PropTypes.func,
  openLeftMenuCallBack: PropTypes.func,
  toggleNavbarDropdown: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      organization_name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  getusername: PropTypes.func,
  name: PropTypes.string,
  success: PropTypes.any,
  usernameData: PropTypes.shape({
    user_name: PropTypes.string,
    user_id: PropTypes.string,
  }),
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar } = state.Layout;
  return { layoutType, showRightSidebar };
};

// export default connect(mapStatetoProps, { toggleRightSidebar })(
//   withTranslation()(Header)
// );
export default connect(mapStatetoProps, { toggleRightSidebar })(
  withRouter(withTranslation()(Header))
);
