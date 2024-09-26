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

//i18n
import { withTranslation } from "react-i18next";
import "./horizontal-navbar.scss";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      dropdownOpen: false,
      dropdowns: {
        databaseDropdownOpen: false,
        participantDataDropdownOpen: false,
      },
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleDropdown(dropdownName) {
    // Toggle the specified dropdown
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
      dropdowns: {
        ...prevState.dropdowns,
        [dropdownName]: !prevState.dropdowns[dropdownName],
      },
    }));
  }

  toggleNavbar() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  handleDocumentClick(event) {
    // Close all dropdowns if the clicked element is not inside any dropdown
    if (
      !event.target.closest(".database-dropdown") &&
      !event.target.closest(".participant-data-dropdown")
    ) {
      this.setState({
        dropdowns: {
          dropdownOpen: false,
          databaseDropdownOpen: false,
          participantDataDropdownOpen: false,
        },
      });
    }
  }

  componentDidMount() {
    document.body.addEventListener("click", this.handleDocumentClick);
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions(); // Call updateDimensions initially
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleDocumentClick);
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ isOpen: window.innerWidth >= 800 });
  };

  render() {
    const { screenWidth } = this.props;
    const { databaseDropdownOpen, participantDataDropdownOpen } = this.state;
    const { isOpen, dropdowns, dropdownOpen } = this.state;

    // Determine if the navbar should be shown based on screen width
    const shouldShowNavbar = screenWidth >= 800 || isOpen;
    const { organization_name } = this.props.match.params;
    return (
      <React.Fragment>
        {/* Render navbar only if shouldShowNavbar is true */}
        {shouldShowNavbar && (
          <div className="topnav">
            <div className="left-space">
              {this.state.account_type === "database-admin" && (
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
                            <Link
                              to={`/${organization_name}/database-of-units`}
                              className="dropdown-item"
                            >
                              Database of units
                            </Link>
                          </li>

                          <li>
                            <Link
                              to={`/${organization_name}/database-of-equipmentType`}
                              className="dropdown-item"
                            >
                              Database of equipment type
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-manufactural`}
                              className="dropdown-item"
                            >
                              Database of manufacturer
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/equipment-list`}
                              className="dropdown-item"
                            >
                              Database of equipments
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-method`}
                              className="dropdown-item"
                            >
                              Database of method
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-reagents`}
                              className="dropdown-item"
                            >
                              Database of reagents
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-analyte`}
                              className="dropdown-item"
                            >
                              Database of Analytes
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li className="nav-item">
                        <Link
                          to={`/${organization_name}/databaseadmin-news`}
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">
                            Database Review
                          </span>
                          {/* {this.props.t("Tests")} */}
                        </Link>
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
                            <Link
                              to={`/${organization_name}/database-of-participantcity`}
                              className="dropdown-item"
                            >
                              City
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantcountry`}
                              className="dropdown-item"
                            >
                              Country
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantprovince`}
                              className="dropdown-item"
                            >
                              Province
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantdistrict`}
                              className="dropdown-item"
                            >
                              District
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantdepartment`}
                              className="dropdown-item"
                            >
                              Department
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantdesignation`}
                              className="dropdown-item"
                            >
                              Designation
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participanttype`}
                              className="dropdown-item"
                            >
                              Participant Type
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/${organization_name}/database-of-participantSector`}
                              className="dropdown-item"
                            >
                              Participant Sector
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <Link to={`/${organization_name}/scheme`} className="dropdown-item">
                          <span className="pt-4 font-size-12">Scheme</span>
                          {/* {this.props.t("Tests")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={`/${organization_name}/cycle`} className="dropdown-item">
                          <span className="pt-4 font-size-12">Cycle</span>
                          {/* {this.props.t("Tests")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={`/${organization_name}/sample`} className="dropdown-item">
                          <span className="pt-4 font-size-12">Sample</span>
                          {/* {this.props.t("Tests")} */}
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
                          <Link to={`/${organization_name}/add-staff`} className="dropdown-item">
                            <span className="pt-4 font-size-12">Add Staff</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/${organization_name}/databaseadmin-list`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Database Admin
                            </span>
                            {/* {this.props.t("Profiles")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/${organization_name}/registration-admin-list`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Registration Admin
                            </span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to={`/${organization_name}/csr-list`} className="dropdown-item">
                            <span className="pt-4 font-size-12">CSR</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`/${organization_name}/all-participants`} className="dropdown-item">
                            <span className="pt-4 font-size-12">
                              Participants List
                            </span>
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
                          <Link
                            to={`/${organization_name}/pending-participant`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Participant
                            </span>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            to={`/${organization_name}/register-participant`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Add Participant
                            </span>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link to={`/${organization_name}/round`} className="dropdown-item">
                            <span className="pt-4 font-size-12">Rounds</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${organization_name}/participant-payment`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Payment</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to={`/${organization_name}/news`} className="dropdown-item">
                            News
                          </Link>
                        </li>
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
                            to={`/add-organization`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Add Organization
                            </span>
                            {/* {this.props.t("Profiles")} */}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="/organization-list"
                            className="dropdown-item"
                          >
                            Organization List
                          </Link>
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
                    isOpen={isOpen}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={`/${organization_name}/register-participant-CSR`}
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">
                            Add Participant
                          </span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={`/${organization_name}/all-participant2`} className="dropdown-item">  
                          <span className="pt-4 font-size-12">
                            Participants List
                          </span>
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
                          {/* <Link to={"/rounds-participant"} className="dropdown-item"> */}
                          <Link
                            to={`/${organization_name}/rounds-participant`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/${organization_name}/performance`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">
                              Performance
                            </span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/${organization_name}/newspage`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">News</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={`/help`}
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Help</span>
                          </Link>
                        </li>

                        {this.state.user_id &&
                          this.state.user_type == "patient" && (
                            <li className="nav-item">
                              <Link
                                to={"/test-appointments"}
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
  menuOpen: PropTypes.any,
  patientProfile: PropTypes.array,
  screenWidth: PropTypes.number,
  isOpen: PropTypes.bool, // Assuming isOpen is also a prop you intend to use
  dropdowns: PropTypes.shape({
    databaseDropdownOpen: PropTypes.bool,
    participantDataDropdownOpen: PropTypes.bool,
  }),
};

const mapStateToProps = state => {
  const { layoutType } = state.Layout;
  const { carts } = state.carts;
  return { layoutType, carts };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(Navbar)));
