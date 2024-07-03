import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { isEmpty, map } from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import { getRegAdminNotification } from "store/regadminnotification/actions";
import { withTranslation } from "react-i18next";
import moment from 'moment';

class RegAdminNotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      menu: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { user_id } = this.state;
    const { onGetRegAdminNotification } = this.props;
    const previousApiCallTime = localStorage.getItem("api_call_time");

    onGetRegAdminNotification(user_id, previousApiCallTime);

    const currentApiCallTime = new Date();
    localStorage.setItem("api_call_time", currentApiCallTime.toISOString());
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {

    // const { SearchBar } = Search;

    const { regAdminNotification } = this.props;
    console.log("My regAdminNotification", regAdminNotification);

    const { onGetRegAdminNotification } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: regAdminNotification.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "asc",
      },
    ];

    return (
      
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <Tooltip title="Notifications">
            <DropdownToggle
              className="btn header-item noti-icon"
              tag="button"
              id="page-header-notifications-dropdown"
            >
              {!isEmpty(regAdminNotification) &&
                regAdminNotification.map((notification, key) => (
                  <Col key={"col" + key}>
                    {notification.notifications_count > 0 && (
                      <div>
                        <i className="bx bx-bell bx-tada" />
                        <span className="badge bg-danger rounded-pill">
                          {notification.notifications_count}
                        </span>
                      </div>
                    )}
                    {notification.notifications_count === 0 && (
                      <div>
                        <i className="bx bx-bell bx-tada" />
                        <span className="badge bg-danger rounded-pill"></span>
                      </div>
                    )}
                  </Col>
                ))}
            </DropdownToggle>
          </Tooltip>
          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0">{this.props.t("Notifications")}</h6>
                </Col>
                <div className="col-auto"></div>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>
                     <Link
                to="/labs-list-pending-fee"
                className="text-reset sampleNotification-item"
              >
            {!isEmpty(regAdminNotification) &&
              regAdminNotification.map((notifications, key) => (
                <Col key={"col" + key}>
                  <>
                    {notifications.notifications &&
                      Array.isArray(notifications.notifications) &&
                      notifications.notifications.map((item, innerKey) => (
                        <div key={"item" + innerKey} className="d-flex mt-0">
                       
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                            You Have New Pending Lab <b>{item.id}</b> name <b>{item.name}</b> From <b>{item.city}</b> Registered At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}.
                            </div>
                          {/* Add more conditions for other actions if needed */}
                        </div>
                      ))}
                  </>
                  <>
                    {notifications.notifications_offered_tests &&
                      Array.isArray(notifications.notifications_offered_tests) &&
                      notifications.notifications_offered_tests.map((item, innerKey) => (
                        <div key={"item" + innerKey} className="d-flex mt-0">
                       
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                              You Have New Pending Test Id <b>{item.id}</b>
                            {/* from <b>{item.complainant}</b> Against the LabHazir <b>{item.labhazir_complainee}</b> department At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}. */}
                            </div>
                          {/* Add more conditions for other actions if needed */}
                        </div>
                      ))}
                  </>
                  <>
                    {notifications.notifications_donor &&
                      Array.isArray(notifications.notifications_donor) &&
                      notifications.notifications_donor.map((item, innerKey) => (
                        <div key={"item" + innerKey} className="d-flex mt-0">
                       
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                              You Have New Pending Donor <b>{item.id}</b> name <b>{item.name}</b> From <b>{item.city}</b> Registered At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}.
                            {/* from <b>{item.complainant}</b> Against the LabHazir <b>{item.labhazir_complainee}</b> department At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}. */}
                            </div>
                          {/* Add more conditions for other actions if needed */}
                        </div>
                      ))}
                  </>
                  <>
                    {notifications.notifications_b2b &&
                      Array.isArray(notifications.notifications_b2b) &&
                      notifications.notifications_b2b.map((item, innerKey) => (
                        <div key={"item" + innerKey} className="d-flex mt-0">
                       
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                              You Have New Pending B2b Client <b>{item.id}</b> Name <b>{item.name}</b> From <b>{item.city}</b> Registered At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}.
                            {/* from <b>{item.complainant}</b> Against the LabHazir <b>{item.labhazir_complainee}</b> department At {moment(item.registered_at).format("DD MMM YYYY, h:mm A")}. */}
                            </div>
                          {/* Add more conditions for other actions if needed */}
                        </div>
                      ))}
                  </>
                </Col>
              ))}
                </Link>
            </SimpleBar>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

RegAdminNotificationDropdown.propTypes = {
  match: PropTypes.object,
  regAdminNotification: PropTypes.array,
  className: PropTypes.any,
  onGetRegAdminNotification: PropTypes.func,
  history: PropTypes.any,
  success: PropTypes.any,
  error: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ regAdminNotification }) => ({
  regAdminNotification: regAdminNotification.regAdminNotification,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetRegAdminNotification: (id, previousApiCallTime) =>
    dispatch(getRegAdminNotification(id, previousApiCallTime)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(RegAdminNotificationDropdown))
);
