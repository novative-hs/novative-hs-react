import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

import { connect } from "react-redux";
import { isEmpty, map, size } from "lodash";

import { withRouter, Link } from "react-router-dom";
// Import menuDropdown
import logo from "../../assets/images/logo.svg";
import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";
import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

//i18n
import { withTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import Navbar from "./Navbar";

import "./horizontal-navbar.scss";
import carts from "pages/CartsList/carts";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      open: false,
      count: 0,
      carts: [],
      isDropdownOpen: false,
      cart: "",
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
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid)
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id)
    console.log("yaha ani chahi hai fuid", this.props.match.params.filnalurl)

    console.log(this.state.user_type)
  }

  componentDidMount() {

    const { getCarts } = this.props;
    if (!this.state.user_id) {
      console.log("hellll")
      // this.props.history.push("/login");
      getCarts(this.props.match.params.guest_id);
      this.setState({ carts: this.state.carts });
      console.log("uuid:", carts, this.props.match.params.guest_id)
      //  window.location.reload()
    }
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      getCarts(this.state.user_id);
      this.setState({ carts: this.state.carts });
      console.log("uuid:", carts, this.state.user_id)

      // window.location.reload()
    }
    if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      getCarts(this.props.match.params.guest_id);
      console.log("heeelllll:", carts, this.props.match.params.guest_id)
    }
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      getCarts(this.props.match.params.uuid);
      console.log("heeelllll:", carts, this.props.match.params.uuid)
    }
    // getCarts(this.state.user_id);
    // this.setState({ carts: this.state.carts });

    // getCarts(this.props.match.params.id);
    // // console.log("header id:",getCarts(this.props.match.params.id))
    // this.setState({ carts: this.state.carts });
    // if (window.localStorage) {

    //   // If there is no item as 'reload'
    //   // in localstorage then create one &
    //   // reload the page
    //   if (!localStorage.getItem('reload')) {
    //       localStorage['reload'] = true;
    //       window.location.reload();
    //   } else {

    //       // If there exists a 'reload' item
    //       // then clear the 'reload' item in
    //       // local storage
    //       localStorage.removeItem('reload');
    //   }
    // }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { carts } = this.props;
    if (
      !isEmpty(carts) &&
      size(prevProps.carts) !== size(carts)
    ) {
      this.setState({ carts: {} });
    }
  }
  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };

  handlePageClick = page => {
    this.setState({ page });
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
  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };
  render() {
    const { isDropdownOpen } = this.state;
    const isLargeScreen = window.innerWidth > 992;
    return (
      <React.Fragment>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              {isLargeScreen ? (
                <div className="navbar-brand-box">
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-labs/${this.props.match.params.uuid}`
                        : `/nearby-labs/`
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
                        : `/nearby-labs/`
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


              ) : null}

              {!isLargeScreen ? (

                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  style={{ left: '12px' }} // Set left position to 10 pixels
                  data-toggle="collapse"
                  onClick={this.toggleMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>

              ) : <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                data-toggle="collapse"
                onClick={this.toggleMenu}
                data-target="#topnav-menu-content"
              >
                <i className="fa fa-fw fa-bars" />
              </button>}
            </div>

            <div className="d-flex">
              {/* Display login and signup links if the user is not logged in,
              otherwise show logout and cart links to the user with patient account and is logged in */}
              {!this.state.user_id ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-4">
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                        : `/cart/${this.props.match.params.guest_id}`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                    {!isEmpty(this.props.carts) &&

                      this.props.carts.slice(-1).pop().cart_quantity + this.state.count
                    }
                  </Link>
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                        : `/login/${this.props.match.params.guest_id}`
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

                  {/* <Link
                    // to="/contact-us"
                    to={
                      this.props.match.params.uuid
                        ? `/contact-us/${this.props.match.params.uuid}`
                        : `/contact-us`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                  </Link> */}
                </div>
              ) : this.state.user_type == "patient" ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-2">
                    <Link
                      // to={"/profile"}
                      to={
                        this.props.match.params.uuid
                          ? `/profile/${this.props.match.params.uuid}`
                          : `/profile`
                      }
                      className="dropdown-content me-2 text-light"
                    >
                      <i className="mdi mdi-account-box align-middle font-size-20" />{" "}
                      <span className="pt-4 font-size-12">
                        {this.state.patient_name.split(" ")[0]}                    
                      </span>
                    </Link>{" "}
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/cart/${this.props.match.params.uuid}`
                          : `/cart`
                      }
                      className="dropdown-content me-2 text-light"
                    >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                      {!isEmpty(this.props.carts) &&

                        this.props.carts.slice(-1).pop().cart_quantity + this.state.count
                      }
                    </Link>
                    
                    <button
                      className="btn header-items noti-icon right-bar-toggle"
                      style={{ position: 'relative' }}
                      onClick={this.toggleDropdown}
                    >
                      <i className="mdi mdi-menu-down align-middle me-1 font-size-20" />
                    </button>

                    {isDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '50px', // Adjust this value to set the distance between the button and the dropdown
                        right: '20px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        minWidth: '150px',
                        zIndex: 1,
                      }}>
                        <ul style={{ listStyleType: "none", padding: '2px' }}>
                          <li>
                            <Link to="/change-password" className="dropdown-content me-2 text-light">
                              <i className="mdi mdi-key align-middle me-1 font-size-20" style={{ color: 'blue' }} />{" "}
                              <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                                Password
                              </span>
                              <hr style={{margin: '0 0' }} />
                            </Link>
                          </li>
                          <li>
                            <Link to="/contact-us" className="dropdown-content me-2 text-light">
                              <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" style={{ color: 'blue' }} />{" "}
                              <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                                Contact Us                  </span>
                              <hr style={{ margin: '0 0' }} />
                            </Link>
                          </li>
                          <li>
                            <Link to="/logout" className="dropdown-content text-light">
                              <i className="mdi mdi-power align-middle font-size-20" style={{ color: 'blue' }}/>{" "}
                              <span className="pt-2 font-size-12" style={{ color: 'blue', marginLeft: '5px' }}>
                                Log Out                    
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
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
                    <div className="dropdown d-lg-inline-block ms-4 mt-4">
                    <Link
                      to={"/dashboard-b2bclient"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                    <Link
                     to={
                       this.props.match.params.guest_id
                       ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                       : `/cart`
                     }
                     className="btn header-items noti-icon right-bar-toggle"
                 >
                     <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                       {!isEmpty(this.props.carts) &&
                       
                         this.props.carts.slice(-1).pop().cart_quantity+this.state.count
                         }
                 </Link>
</div>
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
                    <div className="dropdown d-lg-inline-block ms-4 mt-4">

                      <Link
                        to={"/dashboard-csr"}
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-home me-1 font-size-24" />{" "}
                      </Link>
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/cart/${this.props.match.params.guest_id}`
                            : `/cart`
                        }
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                        {!isEmpty(this.props.carts) &&

                          this.props.carts.slice(-1).pop().cart_quantity + this.state.count
                        }
                      </Link>
                      {/* <Link
                      to={
                        this.props.match.params.uuid
                          ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                          : `/login/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-arrow-right align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Login</span>
                    </Link>
   */}
                      {/* <Link
                      to={
                        this.props.match.params.uuid
                          ? `/register/${this.props.match.params.uuid}`
                          : `/register`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Sign up</span>
                    </Link> */}

                      {/* <Link
                      // to="/contact-us"
                      to={
                        this.props.match.params.uuid
                          ? `/contact-us/${this.props.match.params.uuid}`
                          : `/contact-us`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                    </Link> */}
                    </div>
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
  carts: PropTypes.array,
  getCarts: PropTypes.func,
};

const mapStateToProps = state => {
  const { layoutType } = state.Layout;
  const { carts } = state.carts;
  return { layoutType, carts };
};

// export default connect(mapStatetoProps, { toggleRightSidebar })(
//   withTranslation()(Header)
// );

export default withRouter(
  connect(mapStateToProps, { getCarts, toggleRightSidebar })(withTranslation()(Header))
);