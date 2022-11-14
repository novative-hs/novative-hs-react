import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

import { connect } from "react-redux";

import { withRouter, Link } from "react-router-dom";
// Import menuDropdown
import logo from "../../assets/images/logo.svg";
import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";

//i18n
import { withTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import Navbar from "./Navbar";

import "./horizontal-navbar.scss";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      open: false,
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
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };
  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.openLeftMenuCallBack();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

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
  render() {
    return (
      <React.Fragment>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link
                  to={
                    this.props.match.params.uuid
                      ? `/nearby-labs/${this.props.match.params.uuid}`
                      : `/nearby-labs`
                  }
                  className="logo logo-dark"
                >
                  <span className="logo-sm">
                    <img src={logo} alt="" height="40" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="60" />
                  </span>
                </Link>

                <Link
                  to={
                    this.props.match.params.uuid
                      ? `/nearby-labs/${this.props.match.params.uuid}`
                      : `/nearby-labs`
                  }
                  className="logo logo-light"
                >
                  <span className="logo-sm">
                    <img src={logoLightSvg} alt="" height="40" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="60" />
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                data-toggle="collapse"
                onClick={this.toggleMenu}
                data-target="#topnav-menu-content"
              >
                <i className="fa fa-fw fa-bars" />
              </button>
            </div>

            <div className="d-flex">
              {/* Display login and signup links if the user is not logged in,
              otherwise show logout and cart links to the user with patient account and is logged in */}
              {!this.state.user_id ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-4">
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/login/${this.props.match.params.uuid}`
                        : `/login`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-account-arrow-right align-middle me-1 font-size-20" />{" "}
                    <span className="pt-4 font-size-12">Login</span>
                  </Link>

                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/register/${this.props.match.params.uuid}`
                        : `/register`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                    <span className="pt-4 font-size-12">Sign up</span>
                  </Link>

                  <Link
                    to="/contact-us"
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-phone align-middle me-1 font-size-20" />{" "}
                  </Link>
                </div>
              ) : this.state.user_type == "patient" ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-4">
                  <Link
                    // to={"/profile"}
                    to={
                      this.props.match.params.uuid
                        ? `/profile/${this.props.match.params.uuid}`
                        : `/profile`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-account-box align-middle me-1 font-size-20" />{" "}
                    <span className="pt-4 font-size-12">
                      {this.state.patient_name.split(" ")[0]}
                    </span>
                  </Link>

                  <Link
                    to="/change-password"
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-key align-middle me-1 font-size-20" />{" "}
                    {/* <span className="pt-4 font-size-12">Cart</span> */}
                  </Link>

                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/cart/${this.props.match.params.uuid}`
                        : `/cart`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    {/* <i className="mdi mdi-cart mdi-tada align-middle me-1 font-size-20" />{" "} */}
                    {/* <span className="pt-4 font-size-12">Cart</span> */}
                    <i className="bx bx-cart-alt bx-tada align-middle me-1 font-size-20" />{" "}
                    {/* <span className="pt-4 font-size-12">Cart</span> */}
                    {/* <span className="badge bg-danger rounded-pill">{this.state.patient_name.split(" ")[0]}</span> */}
                  </Link>

                  <Link
                    to="/logout"
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-power align-middle font-size-20" />{" "}
                    {/* <span className="pt-4 font-size-12">Logout</span> */}
                  </Link>
                </div>
              ) : (
                <div className="dropdown d-lg-inline-block ms-3 mt-3">
                  {this.state.user_type == "labowner" && (
                    <Link
                      to={"/dashboard-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "b2bclient" && (
                    <Link
                      to={"/dashboard-b2bclient"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "auditor" && (
                    <Link
                      to={"/dashboard-auditor"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "CSR" && (
                    <Link
                      to={"/dashboard-csr"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "registration-admin" && (
                    <Link
                      to={"/pending-labs"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "auditor-admin" && (
                    <Link
                      to={"/pending-audits"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "csr-admin" && (
                    <Link
                      to={"/pending-complaints-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "hr-admin" && (
                    <Link
                      to={"/add-staff"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "marketer-admin" && (
                    <Link
                      to={"/discount-labhazir"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <Navbar menuOpen={this.state.open} />
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  match: PropTypes.object,
  openLeftMenuCallBack: PropTypes.func,
  t: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};

const mapStateToProps = state => {
  const { layoutType } = state.Layout;
  return { layoutType };
};

// export default connect(mapStatetoProps, { toggleRightSidebar })(
//   withTranslation()(Header)
// );

export default withRouter(
  connect(mapStateToProps, { toggleRightSidebar })(withTranslation()(Header))
);