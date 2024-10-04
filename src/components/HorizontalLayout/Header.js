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
import { getLabProfile } from "store/auth/labprofile/actions";
import { getStaffProfile } from "store/auth/staffprofile/actions";

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
      LabProfile: [],
      StaffProfile: [],
      open: false,
      dropdownOpen: false,
      isSmallScreen: false,
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
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
    const { LabProfile, getLabProfile } = this.props;
    getLabProfile(this.state.user_id);
    this.setState({
      LabProfile
    });
    console.log("state", this.state.LabProfile);

    const { StaffProfile, getStaffProfile } = this.props;
    getStaffProfile(this.state.user_id);
    this.setState({
      StaffProfile
    });
    console.log("state", this.state.StaffProfile);
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
    const { LabProfile } = this.props;
    const {StaffProfile} = this.props;
    const { getLabProfile } = this.props;
    const { getStaffProfile } = this.props;
    console.log("lab logo", this.props.LabProfile)
    // Extract organization_logo from the LabProfile
    // Assuming 'https://example.com' is your domain
    const BASE_URL = "http://127.0.0.1:8000/";

    // Append the base URL to the relative path if the logo exists
    const laborganizationLogo = LabProfile?.success?.organization_logo
      ? `${BASE_URL}${LabProfile.success.organization_logo}`
      : logo;

    console.log("lab organization logo", laborganizationLogo); // Debugging the logo URL

    // Append the base URL to the relative path if the logo exists
    const stafforganizationLogo = StaffProfile?.success?.organization_logo
      ? `${BASE_URL}${StaffProfile.success.organization_logo}`
      : logo;

    console.log("lab organization logo", stafforganizationLogo); // Debugging the logo URL
  
   
    return (
      <React.Fragment>
        <header id="page-topbaar" >
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box" style={{ background: "white" }}>
                {this.state.account_type == "superadmin" ? (
                  <span className="logo-sm">
                  <img src={logo} alt="" height="60" />
                  </span>
                ) : this.state.account_type == "labowner" ? (
                  <span className="logo-sm">
                  <img
                    src={laborganizationLogo}
                    alt="Lab Logo"
                    height="60"
                  />
                  </span>                
                ) : this.state.account_type == "database-admin" || this.state.account_type == "registration-admin" || this.state.account_type == "CSR" ? (
                  <span className="logo-sm">
                  <img
                    src={stafforganizationLogo}
                    alt="Lab Logo"
                    height="60"
                  />
                  </span>                
                ) : null
}

               
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
  getLabProfile: PropTypes.func,
  LabProfile: PropTypes.array,
  getStaffProfile: PropTypes.func,
  StaffProfile: PropTypes.array,

};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar } = state.Layout;
  const LabProfile = state.LabProfile;
  const StaffProfile = state.StaffProfile;
  return { layoutType, showRightSidebar, LabProfile, StaffProfile};
};

export default connect(mapStatetoProps, { getStaffProfile, getLabProfile, toggleRightSidebar })(
  withTranslation()(Header)
);
