import React, { Component } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { NavLink, withRouter } from "react-router-dom";
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
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
      dropdowns: {
        ...prevState.dropdowns,
        [dropdownName]: !prevState.dropdowns[dropdownName],
      },
    }));
  }

  toggleNavbar() {
    this.setState((prevState) => ({
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
    this.setState({ isOpen: window.innerWidth >= 1000 });
  };

  // ✅ Function to apply the active class dynamically
  isActiveNavLink = ({ isActive }) => (isActive ? "active-link" : "");

  render() {
    const { screenWidth } = this.props;
    const { databaseDropdownOpen, participantDataDropdownOpen } = this.state;
    const { isOpen, dropdowns, dropdownOpen } = this.state;

    // Determine if the navbar should be shown based on screen width
    const shouldShowNavbar = screenWidth >= 1000 || isOpen;
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
                            <NavLink
                              to={`/${organization_name}/database-of-units`}
                              className={({ isActive }) =>
                                `dropdown-item ${
                                  isActive ? "active-dropdown" : ""
                                }`
                              }
                            >
                              Database of Units
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-equipmentType`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of Equipment Type
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-manufactural`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of manufacturer
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/equipment-list`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of equipments
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-method`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of method
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-reagents`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of reagents
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-analyte`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Database of Analytes
                            </NavLink>
                          </li>
                          <li>
                              <NavLink
                                to={`/${organization_name}/database-of-organism`}
                                className="dropdown-item"
                              >
                                Database of Organism
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
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Banks
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantcity`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              City
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantcountry`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Country
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantprovince`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Province
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantdistrict`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              District
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantdepartment`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Department
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantdesignation`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Designation
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participanttype`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
                            >
                              Participant Type
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/${organization_name}/database-of-participantSector`}
                              className={({ isActive }) =>
                                `dropdown-item ${isActive ? "active-link" : ""}`
                              }
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
                          className={({ isActive }) =>
                            `dropdown-item ${isActive ? "active-link" : ""}`
                          }
                        >
                          <span className="pt-4 font-size-12">Cycle</span>
                          {/* {this.props.t("Tests")} */}
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to={`/${organization_name}/sample`}
                          className={({ isActive }) =>
                            `dropdown-item ${isActive ? "active-link" : ""}`
                          }
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
                      isOpen={isOpen}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/add-staff`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Add Staff</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/databaseadmin-list`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
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
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
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
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">CSR</span>
                            {/* {this.props.t("Packages")} */}
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/all-participants`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Participants List
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to={`/${organization_name}/participant-payment`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Payment</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to={`/${organization_name}/CSRrounds`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={`/${organization_name}/CSRhistory`} className="dropdown-item">
                              <span className="pt-4 font-size-12">History</span>
                            </NavLink>
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
                          <NavLink
                            to={`/${organization_name}/all-participant`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Participant
                            </span>
                          </NavLink>
                        </li>

                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/register-participant`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Add Participant
                            </span>
                          </NavLink>
                        </li>

                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/round`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to={`/${organization_name}/participant-payment`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Payment</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/news`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            News
                          </NavLink>
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
                          <NavLink
                            to={`/add-organization`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Add Organization
                            </span>
                            {/* {this.props.t("Profiles")} */}
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to="/organization-list"
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            Organization List
                          </NavLink>
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
                          <NavLink
                            to={`/${organization_name}/home`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Home</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          {/* <NavLink to={"/rounds-participant"} className={({ isActive }) => `dropdown-item ${isActive ? "active-link" : ""}`}> */}
                          <NavLink
                            to={`/${organization_name}/rounds-participant`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Rounds</span>
                          </NavLink>
                        </li>
                        {/* <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/performance`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">
                              Performance
                            </span>
                          </NavLink>
                        </li> */}
                        <li className="nav-item">
                          <NavLink
                            to={`/${organization_name}/newspage`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">News</span>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to={`/help`}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="pt-4 font-size-12">Help</span>
                          </NavLink>
                        </li>

                        {this.state.user_id &&
                          this.state.user_type == "patient" && (
                            <li className="nav-item">
                              <NavLink
                                to={"/test-appointments"}
                                className={({ isActive }) =>
                                  `dropdown-item ${
                                    isActive ? "active-link" : ""
                                  }`
                                }
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

const mapStateToProps = (state) => {
  const { layoutType } = state.Layout;
  const { carts } = state.carts;
  return { layoutType, carts };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(Navbar)));
