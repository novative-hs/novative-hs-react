import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

// i18n
import { withTranslation } from "react-i18next";
import "./horizontal-navbar.scss";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpened: false,
      dropdownOpen: false,
      isOpen: false,
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  toggleNavbar() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  handleDocumentClick(event) {
    // Close the dropdown if the clicked element is not inside the dropdown
    if (!event.target.closest(".dropdown-item")) {
      this.setState({ dropdownOpen: false });
    }
  }

  componentDidMount() {
    document.body.addEventListener("click", this.handleDocumentClick);
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions(); // Call updateDimensions initially
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleDocumentClick);
    window.removeEventListener("resize", this.updateDimensions); // Remove event listener on component unmount
  }

  updateDimensions = () => {
    this.setState({ isOpen: window.innerWidth >= 800 });
  };

  render() {
    const { dropdownOpen, isOpen } = this.state;

    // Determine if the navbar should be shown based on screen width
    const shouldShowNavbar = this.props.screenWidth >= 800 || isOpen;

    return (
      <React.Fragment>
        {/* Render navbar only if shouldShowNavbar is true */}
        {shouldShowNavbar && (
          <div className="topnav">
            <div className="left-space">
              {this.state.account_type &&
                this.state.account_type === "database-admin" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <span
                            className="dropdown-item"
                            onMouseEnter={this.toggleDropdown}
                            // onMouseLeave={this.toggleDropdown}
                          >
                            <span className="pt-4 font-size-12">Database</span>
                          </span>
                          <ul
                            className={
                              dropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                          >
                            <li>
                              <Link
                                to="/database-of-units"
                                className="dropdown-item"
                              >
                                Database of units
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/equipment-list"
                                className="dropdown-item"
                              >
                                Database of equipments
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/database-of-equipmentType"
                                className="dropdown-item"
                              >
                                Database of equipment type
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/database-of-manufactural"
                                className="dropdown-item"
                              >
                                Database of manufacturer
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/database-of-method"
                                className="dropdown-item"
                              >
                                Database of method
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/database-of-reagents"
                                className="dropdown-item"
                              >
                                Database of reagents
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/database-of-analyte"
                                className="dropdown-item"
                              >
                                Database of Analytes
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/databaseadmin-news"
                            className="dropdown-item"
                          >
                            News
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/databaseadmin-news"
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Database Review</span>
                            {/* {this.props.t("Tests")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <span>
                            <Link
                              to={"/scheme"}
                              className="dropdown-item"
                              onMouseEnter={this.toggleDropdown}
                              // onMouseLeave={this.toggleDropdown}
                            >
                              <span className="pt-4 font-size-12">Participant Data</span>
                            </Link>
                          </span>
                          <ul
                            className={
                              dropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                          >
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                City
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                District
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                Department
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                Designation
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                Participant Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/"
                                className="dropdown-item"
                              >
                                Participant Sector
                              </Link>
                            </li>
                          </ul>
                          
                          {/* {this.props.t("Packages")} */}
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/sample"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Sample</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/scheme"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Scheme</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>

                        {this.state.user_id &&
                          this.state.user_type === "patient" && (
                            <li className="nav-item">
                              <Link to="/add-staff" className="dropdown-item">
                                {/* {this.props.t("My Appointments")} */}
                                <span className="pt-4 font-size-12">
                                  My Appointments
                                </span>
                              </Link>
                            </li>
                          )}
                      </ul>
                    </Collapse>
                  </nav>
                )}
              {this.state.account_type &&
                this.state.account_type === "superadmin" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link
                            to="/add-organization"
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Add Organization</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/organization-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Organization List</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
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
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link
                            to="/add-staff"
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Add Staff(Registration, DatabaseAdmin, CSR)</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/Register-Participant"
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Add Participant</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/organization-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Participant List</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/databaseadmin-list`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Database Admin list</span>
                            {/* {this.props.t("Profiles")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/registration-admin-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Registration Admin list</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/csr-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">CSR list</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                      </ul>
                    </Collapse>
                  </nav>
                )}
              {this.state.account_type &&
                this.state.account_type === "registration-admin" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <span
                            className="dropdown-item"
                            onMouseEnter={this.toggleDropdown}
                          >
                            <span className="pt-4 font-size-12">Participant</span>
                          </span>
                          <ul
                            className={
                              dropdownOpen
                                ? "dropdown-menu show"
                                : "dropdown-menu"
                            }
                            style={{ backgroundColor: "#0000CD" }}
                          >
                            <li>
                              <Link
                                to="/pending-participant"
                                className="dropdown-item"
                              >
                                Pending
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/approved-participant"
                                className="dropdown-item"
                              >
                                Approved
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/unapproved-participant"
                                className="dropdown-item"
                              >
                                Unapproved
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/round`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                            {/* {this.props.t("Profiles")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/rounds"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Registration Admin</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/csr-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">CSR</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/databaseadmin-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Registrationn Admin</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/csr-list"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">CSR</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                      </ul>
                    </Collapse>
                  </nav>
                )}
              {this.state.account_type &&
                this.state.account_type === "labowner" && (
                  <nav
                    className="navbar navbar-light navbar-expand-lg"
                    id="navigation"
                  >
                    <Collapse
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link
                            to={"/email"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Email us</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/rounds"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/performance"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Performance</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/newspage"}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">News</span>
                          </Link>
                        </li>
                      </ul>
                    </Collapse>
                  </nav>
                )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  screenWidth: PropTypes.number,
};

const mapStateToProps = (state) => ({
  screenWidth: state.Layout.screenWidth,
});

export default withRouter(connect(mapStateToProps)(withTranslation()(Navbar)));
