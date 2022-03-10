import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

// actions
import { getLabProfile } from "store/auth/labprofile/actions";

// actions
import { getPatientProfile } from "store/auth/patientprofile/actions";

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiURL: process.env.REACT_APP_BACKENDURL,
      menu: false,
      name: "",
      logo: "",
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }));
  }

  componentDidMount() {
    // if (this.props.location.pathname.includes("dashboard-lab")) {
    //   setTimeout(() => {
    //     this.props.getLabProfile(this.props.match.params.id);
    //   }, 1000);

    //   setTimeout(() => {
    //     this.setState({
    //       name: this.props.success.name,
    //       logo: this.state.apiURL + this.props.success.logo,
    //     });
    //   }, 3000);
    // }

    // if (this.props.location.pathname.includes("dashboard-patient")) {
    //   setTimeout(() => {
    //     this.props.getPatientProfile(this.props.match.params.id);
    //   }, 1000);

    //   setTimeout(() => {
    //     this.setState({
    //       name: this.props.success.name,
    //     });
    //   }, 3000);
    // }
  }

  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item"
            id="page-header-user-dropdown"
            tag="button"
          >
            {/* {this.props.location &&
            this.props.location.pathname.includes("dashboard-lab") ? (
              <img
                className="rounded-circle header-profile-user"
                src={this.state.logo}
                alt="Logo"
              />
            ) : null}
            <span className="d-none d-xl-inline-block ms-1">
              {" "}
              {this.state.name}
            </span> */}
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-end">
            {this.props.location &&
            this.props.location.pathname.includes("dashboard-patient") ? (
              <DropdownItem
                tag="a"
                href={
                  "/dashboard-patient/" +
                  this.props.match.params.id +
                  "/profile"
                }
              >
                <i className="bx bx-user font-size-16 align-middle ms-1" />
                {this.props.t("Patient Profile")}
              </DropdownItem>
            ) : null}

            {this.props.location &&
            this.props.location.pathname.includes("dashboard-lab") ? (
              <DropdownItem
                tag="a"
                href={
                  "/dashboard-lab/" + this.props.match.params.id + "/profile"
                }
              >
                <i className="bx bx-user font-size-16 align-middle ms-1" />
                {this.props.t("Lab Profile")}
              </DropdownItem>
            ) : null}

            {this.props.location &&
            this.props.location.pathname.includes("dashboard-corporate") ? (
              <DropdownItem tag="a" href="/profile">
                <i className="bx bx-user font-size-16 align-middle ms-1" />
                {this.props.t("Corporate Profile")}
              </DropdownItem>
            ) : null}

            <div className="dropdown-divider" />
            <Link to="/logout" className="dropdown-item">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{this.props.t("Logout")}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
  getPatientProfile: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.location.pathname.includes("dashboard-patient")) {
    const { error, success } = state.PatientProfile;
    return { error, success };
  } else if (ownProps.location.pathname.includes("dashboard-lab")) {
    const { error, success } = state.LabProfile;
    return { error, success };
  }
};

export default withRouter(
  connect(mapStateToProps, { getLabProfile, getPatientProfile })(
    withTranslation()(ProfileMenu)
  )
);
