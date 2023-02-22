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

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }));
  }

  componentDidMount() {}

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
            <i className="mdi mdi-account-circle font-size-24 d-xl-inline-block" />
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-middle">
              <DropdownItem tag="a" href={"/pending-test-appointments"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("Pending")}
              </DropdownItem>
              <DropdownItem tag="a" href={"/in-process-test-appointments"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("In Process")}
              </DropdownItem><DropdownItem tag="a" href={"/completed-test-appointments"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("Completed")}
              </DropdownItem>
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

};

const mapStateToProps = state => ({
    // map state properties to props
    // for example: prop1: state.property1
  });
  
export default withRouter(
connect(mapStateToProps, {})(withTranslation()(ProfileMenu))
);