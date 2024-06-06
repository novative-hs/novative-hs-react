import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

import {
  changeLayout,
  changeTopbarTheme,
  toggleRightSidebar,
  changeLayoutWidth,
} from "../../store/actions";

// Other Layout related Component
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";

class HorizontalLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false,
      screenWidth: window.innerWidth,
    };
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
    this.hideRightbar = this.hideRightbar.bind(this);
    this.updateScreenWidth = this.updateScreenWidth.bind(this);
  }

  /**
   * Open/close right sidebar
   */
  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  componentDidMount() {
    document.body.addEventListener("click", this.hideRightbar, true);
    window.addEventListener("resize", this.updateScreenWidth);
    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    // Scrollto 0,0
    window.scrollTo(0, 0);

    // const title = this.props.location.pathname
    // let currentage = title.charAt(1).toUpperCase() + title.slice(2)

    // document.title =
    //   currentage + " | Lab Hazir - Dashboard"

    this.props.changeLayout("horizontal");
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }
  }
  componentWillUnmount() {
    // Remove event listener when component unmounts
    window.removeEventListener("resize", this.updateScreenWidth);
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = e => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  //hides right sidebar on body click
  hideRightbar = event => {
    var rightbar = document.getElementById("right-bar");
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      if (document.body.classList.contains("right-bar-enabled")) {
        this.props.toggleRightSidebar(false);
      }
    }
  };
  updateScreenWidth() {
    // Update state with current screen width
    this.setState({ screenWidth: window.innerWidth });
  }
  render() {
    return (
      <React.Fragment>
        <I18nextProvider i18n={i18n}>
          <div id="preloader">
            <div id="status">
              <div className="spinner-chase">
                <div className="chase-dot"></div>
                <div className="chase-dot"></div>
                <div className="chase-dot"></div>
                <div className="chase-dot"></div>
                <div className="chase-dot"></div>
                <div className="chase-dot"></div>
              </div>
            </div>
          </div>
          <div id="layout-wrapper">
          <Header
  theme={this.props.topbarTheme}
  isMenuOpened={this.state.isMenuOpened}
  toggleRightSidebar={this.toggleRightSidebar}
  openLeftMenuCallBack={this.openMenu}
  toggleNavbarDropdown={this.toggleNavbarDropdown} // Pass the callback function
/>
             {/* <Navbar
              menuOpen={this.state.isMenuOpened}
              screenWidth={this.state.screenWidth} // Pass screenWidth here
            />*/}
            <div className="main-content">{this.props.children}</div> 
            <Footer />
          </div>
          {this.props.showRightSidebar ? <RightSidebar /> : null}
        </I18nextProvider>
      </React.Fragment>
    );
  }
}

HorizontalLayout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.bool,
  layoutWidth: PropTypes.string,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
  topbarTheme: PropTypes.any,
  
};

const mapStateToProps = state => {
  return {
    ...state.Layout,
  };
};
export default connect(mapStateToProps, {
  changeTopbarTheme,
  toggleRightSidebar,
  changeLayout,
  changeLayoutWidth,
})(withRouter(HorizontalLayout));
