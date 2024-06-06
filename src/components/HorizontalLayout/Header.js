import PropTypes from "prop-types";
import React, { Component } from "react";
import "react-drawer/lib/react-drawer.css";

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import { Link } from "react-router-dom";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logo from "../../assets/images/neqas-logo.jpeg";
import logoLight from "../../assets/images/neqas-logo.jpeg";
import logoLightSvg from "../../assets/images/neqas-logo.jpeg";

//i18n
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
      isSearch: false,
      open: false,
      dropdownOpen: false,
      isSmallScreen: false,
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      position: "right",
      isNavbarOpen: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }
  /**
   * Toggle sidebar
   */
  toggleDropdown() {
    // Toggle dropdown for the fullscreen button
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));

    // Toggle navbar dropdown
    this.props.openLeftMenuCallBack(); // Call the function to toggle the navbar dropdown
  }

  toggleNavbar() {
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen,
    }));
  }
  toggleMenu() {
    this.props.openLeftMenuCallBack();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }
  updateDimensions = () => {
    this.setState({ isSmallScreen: window.innerWidth < 800 });
  };
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  
    // Check if the screen size is greater than 800px initially
    if (window.innerWidth > 800) {
      this.setState({ isNavbarOpen: true });
    }
  }
  

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
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
  toggleNavbarDropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  render() {
    const isSmallScreen = window.innerWidth < 800;
    const { isNavbarOpen } = this.state;
   
    return (
      <React.Fragment>
        <header id="page-topbaar" >
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box" style={{ background: "white" }}>

                <span className="logo-sm">
                  <img src={logo} alt="" height="60" />
                </span>
              </div>
              <button
              type="button"
              className="btn btn-sm pl-5 font-size-16 d-lg-none header-item navbar-toggler"
              onClick={this.toggleNavbar}
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            </div>
     
            <div className="d-flex">
         
              <div className="dropdown d-none d-lg-inline-block ms-1">
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
              </div>
              <ProfileMenu />
            </div>

          </div>
          <Navbar isOpen={isNavbarOpen} toggleNavbar={this.toggleNavbar} />
        
        </header>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.any,
  showRightSidebar: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
  openLeftMenuCallBack: PropTypes.func,
  toggleNavbarDropdown: PropTypes.func,
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar } = state.Layout;
  return { layoutType, showRightSidebar };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(
  withTranslation()(Header)
);
