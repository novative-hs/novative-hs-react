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

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

import { connect } from "react-redux";

const getUserName = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      name: "Admin",
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }));
  }

  componentDidMount() {
    const userData = getUserName();
    if (userData) {
      this.setState({ name: userData.username });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.success !== this.props.success) {
      const userData = getUserName();
      if (userData) {
        this.setState({ name: userData.username });
      }
    }
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
            <img
              className="rounded-circle header-profile-user"
              src={user1}
              alt="Header Avatar"
            />{" "}
            <span className="d-none d-xl-inline-block ms-1">
              {this.state.name}
            </span>
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-end">
            {this.props.location &&
            this.props.location.pathname.includes("dashboard-patient") ? (
              <DropdownItem tag="a" href="/profile">
                <i className="bx bx-user font-size-16 align-middle ms-1" />
                {this.props.t("Patient Profile")}
              </DropdownItem>
            ) : null}

            {this.props.location &&
            this.props.location.pathname.includes("dashboard-lab") ? (
              <DropdownItem tag="a" href="/profile">
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
  success: PropTypes.string,
};

const mapStateToProps = state => {
  const { success } = state.Profile;
  return { success };
};

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(ProfileMenu))
);
