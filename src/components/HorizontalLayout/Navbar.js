import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";
import "./horizontal-navbar.scss";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
  }

  componentDidMount() {
    let matchingMenuItem = null;
    const ul = document.getElementById("navigation");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

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

  render() {
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
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
                      {this.props.t("Nearby Labs")}
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
                      {this.props.t("Nearby Labs")}
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
                      {this.props.t("Nearby Labs")}
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
                      {this.props.t("Nearby Labs")}
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
                        {this.props.t("Test Appointments")}
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
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(Navbar));
