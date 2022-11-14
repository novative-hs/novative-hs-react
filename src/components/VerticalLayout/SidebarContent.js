import PropTypes from "prop-types";
import React, { Component } from "react";

//Simple bar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
    this.refDiv = React.createRef();
  }

  componentDidMount() {
    this.initMenu();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
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

  // componentDidUpdate() {}

  scrollElement = item => {
    setTimeout(() => {
      if (this.refDiv.current !== null) {
        if (item) {
          const currentPosition = item.offsetTop;
          if (currentPosition > window.innerHeight) {
            if (this.refDiv.current)
              this.refDiv.current.getScrollElement().scrollTop =
                currentPosition - 300;
          }
        }
      }
    }, 300);
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      this.scrollElement(item);
      return false;
    }
    this.scrollElement(item);
    return false;
  };

  render() {
    return (
      <React.Fragment>
        {/* B2B Client */}
        {this.state.account_type && this.state.account_type == "b2bclient" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <Link to={"/dashboard-b2bclient"}>
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li>
                  <Link to={"/b2b-account-statements"}>
                    <i className="bx bx-receipt" />
                    <span>{this.props.t("Statement")}</span>
                  </Link>
                </li>
                <li className="menu-title">{this.props.t("B2B")}</li>
                {/* B2b referred Patient List */}
                <li>
                  <Link to={"/b2b-referred-patients"}>
                    <i className="fas fa-user" />
                    <span>{this.props.t("Referred Patients")}</span>
                  </Link>
                </li>
                {/* B2B Shares List */}
                <li>
                  <Link to={"/b2b-shares"}>
                    <i className="fas fa-user" />
                    <span>{this.props.t("B2B Shares")}</span>
                  </Link>
                </li>
                <li>
                  <Link to={"/b2b-payment"}>
                    <i className="far fa-money-bill-alt" />
                    <span>{this.props.t("Payment Method")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}
        {this.state.account_type && this.state.account_type == "donor" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                {/* Lab Settings */}
                {/* <li>
                  <Link to="/donor-settings">
                    <i className="mdi mdi-cog" />
                    <span>{this.props.t("Settings")}</span>
                  </Link>
                </li> */}
                {/* Donor Statements */}
                <li>
                  <Link to={"/donor-account-statements"}>
                    <i className="bx bx-receipt" />
                    <span>{this.props.t("Statement")}</span>
                  </Link>
                </li>

                <li className="menu-title">{this.props.t("DONOR")}</li>

                {/* Donor Appointments List */}
                <li>
                  <Link to={"/donor-appointment"}>
                    <i className="bx bx-receipt" />
                    <span>{this.props.t("Donor Appointments")}</span>
                  </Link>
                </li>
                {/* Donor payment Method */}
                <li>
                  <Link to={"/donor-payment"}>
                    <i className="far fa-money-bill-alt" />
                    <span>{this.props.t("Payment Method")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}
        {this.state.account_type && this.state.account_type == "b2b-admin" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{this.props.t("B2B ADMIN")}</li>
                {/* B2b referred Patient List */}
                <li>
                  <Link to={"/b2b-clients-list"}>
                    <i className="mdi mdi-account-group" />
                    <span>{this.props.t("B2B Clients")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* Auditor */}
        {this.state.account_type && this.state.account_type == "auditor" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <Link to="/dashboard-auditor">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li className="menu-title">{this.props.t("Auditor")}</li>
                {/* Sample Collector In process test List */}
                <li>
                  <Link to="/assigned-audits">
                    <i className="mdi mdi-file-clock" />
                    <span>{this.props.t("Assigned Audits")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/audited-audits">
                    <i className="mdi mdi-file-check" />
                    <span>{this.props.t("Completed Audits")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}
        {/* Finance officer  */}
        {this.state.account_type &&
          this.state.account_type == "finance-officer" && (
            <SimpleBar className="h-100" ref={this.refDiv}>
              <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                  <li>
                    <Link to="/dashboard-financeofficer">
                      <i className="bx bx-home-circle" />
                      <span>{this.props.t("Dashboard")}</span>
                    </Link>
                  </li>

                  <li className="menu-title">
                    {this.props.t("Finance Officer")}
                  </li>
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="bx bx-test-tube" />
                      <span>{this.props.t("Payments Form")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/in-payment"}>{this.props.t("MIF")}</Link>
                      </li>
                      <li>
                        <Link to={"/out-payment"}>{this.props.t("MOF")}</Link>
                      </li>
                    </ul>
                  </li>
                  {/* Payments Status Links */}
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="bx bx-test-tube" />
                      <span>{this.props.t("MIF Statuses")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/payment-status"}>
                          {this.props.t("MIF Created")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/deposit-status"}>
                          {this.props.t("MIF Deposited")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/clear-status"}>
                          {this.props.t("MIF Cleared")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/bounced-status"}>
                          {this.props.t("MIF Bounced")}
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="bx bx-test-tube" />
                      <span>{this.props.t("MOF Statuses")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/payment-out-created-status"}>
                          {this.props.t("MOF Created")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/payment-out-pending-clearence-status"}>
                          {this.props.t("MOF Pending Clearence")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/payment-out-bounced-status"}>
                          {this.props.t("MOF Bounced")}
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </SimpleBar>
          )}
        {/* Finance Admin  */}
        {this.state.account_type && this.state.account_type == "finance-admin" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <Link to="/dashboard-financeadmin">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li className="menu-title">{this.props.t("Finance Admin")}</li>
                {/* payments Approval Routes */}
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="mdi mdi-office-building" />
                    <span>{this.props.t("In Payments")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to={"/cleared-in-payments"}>
                        {this.props.t("Cleared")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/approved-in-payments"}>
                        {this.props.t("Approved")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/unapproved-in-payments"}>
                        {this.props.t("Unapproved")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/create-bank">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Bank")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/bank-account">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Account")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/banks-list">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Banks List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/bankaccounts-list">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Bank Accounts List")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}
        {/* CSR  */}
        {this.state.account_type && this.state.account_type == "CSR" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <Link to="/dashboard-csr">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li className="menu-title">{this.props.t("CSR")}</li>
                {/* Unhandled Complaints */}
                <li>
                  <Link to={"/unhandled-complaints"}>
                    <i className="mdi mdi-chat-remove" />
                    <span>{this.props.t("Unhandled Complaints")}</span>
                  </Link>
                </li>

                {/* Handled Complaints */}
                <li>
                  <Link to={"/handled-complaints"}>
                    <i className="mdi mdi-checkbox-multiple-marked-circle" />
                    <span>{this.props.t("Handled Complaints")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* Sample Collector */}
        {this.state.account_type &&
          this.state.account_type == "samplecollector" && (
            <SimpleBar className="h-100" ref={this.refDiv}>
              <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                  <li>
                    <Link to="/dashboard-samplecollector">
                      <i className="bx bx-home-circle" />
                      <span>{this.props.t("Dashboard")}</span>
                    </Link>
                  </li>

                  <li className="menu-title">
                    {this.props.t("Sample Collector")}
                  </li>
                  {/* Sample Collector In process test List */}
                  <li>
                    <Link to="/sample-collector-in-process">
                      <i className="mdi mdi-beaker-alert" />
                      <span>{this.props.t("Assigned Collections")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sample-collector-completed">
                      <i className="mdi mdi-beaker-check" />
                      <span>{this.props.t("Completed Collections")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </SimpleBar>
          )}

        {/* Registration Admin */}
        {this.state.account_type &&
          this.state.account_type == "registration-admin" && (
            <SimpleBar className="h-100" ref={this.refDiv}>
              <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                  {/* <li>
                  <Link to="/dashboard-auditor">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li> */}

                  <li className="menu-title">
                    {this.props.t("Registration Admin")}
                  </li>

                  {/* Labs Approval Routes */}
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="mdi mdi-hospital-building" />
                      <span>{this.props.t("Labs")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/pending-labs"}>
                          {this.props.t("Pending")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/approved-labs"}>
                          {this.props.t("Approved")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/unapproved-labs"}>
                          {this.props.t("Unapproved")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/referrellab"}>
                          {this.props.t("Pending Referrel Fee")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/approvereferrellab"}>
                          {this.props.t("Approve Referrel Fee")}
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* B2b Clients Approval Routes */}
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="mdi mdi-office-building" />
                      <span>{this.props.t("B2B Clients")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/pending-b2b-clients"}>
                          {this.props.t("Pending")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/approved-b2b-clients"}>
                          {this.props.t("Approved")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/unapproved-b2b-clients"}>
                          {this.props.t("Unapproved")}
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Donor Approval Routes */}
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="mdi mdi-hospital-building" />
                      <span>{this.props.t("Donors")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/pending-donors"}>
                          {this.props.t("Pending")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/approved-donors"}>
                          {this.props.t("Approved")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/unapproved-donors"}>
                          {this.props.t("Unapproved")}
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <Link to="/pending-labs">
                      <i className="mdi mdi-book-clock" />
                      <span>{this.props.t("Pending Labs")}</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/approved-labs">
                      <i className="mdi mdi-book-check" />
                      <span>{this.props.t("Approved Labs")}</span>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </SimpleBar>
          )}
        {/* Marketer Admin */}
        {this.state.account_type &&
          this.state.account_type == "marketer-admin" && (
            <SimpleBar className="h-100" ref={this.refDiv}>
              <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                  <li className="menu-title">
                    {this.props.t("Marketer Admin")}
                  </li>
                  {/* Advertisement*/}
                  <li>
                    <Link to="/#" className="has-arrow">
                      <i className="bx bx-test-tube" />
                      <span>{this.props.t("Advertisements")}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/advertisement"}>
                          {this.props.t("Advertisements Labhazir")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/advertisement-price-list"}>
                          {this.props.t("Advertisement Price List")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/#" className="has-arrow">
                          <span>{this.props.t("Lab Requests")}</span>
                        </Link>
                        <ul className="sub-menu" aria-expanded="false">
                          <li>
                            <Link to={"/pending-lab-advertisement-requests"}>
                              {this.props.t("Pending Requests")}
                            </Link>
                          </li>
                          <li>
                            <Link to={"/accepted-lab-advertisement-requests"}>
                              {this.props.t("Accepted Requests")}
                            </Link>
                          </li>
                          {/* <li>
                      <Link to={"/completed-test-appointments"}>
                        {this.props.t("Completed")}
                      </Link>
                    </li> */}
                        </ul>
                      </li>
                    </ul>
                  </li>
                  {/* Discounts*/}
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-test-tube" />
                    <span>{this.props.t("Discounts")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                    <Link to={"/discount-labhazir"}>
                      {this.props.t("Against Test")}
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      <li>
                        <Link to={"/discount-labhazir"}>
                          {this.props.t("Lab Hazir")}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/labs-list"}>{this.props.t("Lab")}</Link>
                      </li>
                    </ul>
                  </li>
                    <li>
                      <Link to={"/labs-list"}>
                        {this.props.t("Against Lab")}
                      </Link>
                    </li>
                  </ul>
                </li>
                </ul>
              </div>
            </SimpleBar>
          )}

        {/* CSR Admin */}
        {this.state.account_type && this.state.account_type == "csr-admin" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{this.props.t("CSR Admin")}</li>
                {/* Complaints Routes */}
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="mdi mdi-hospital-building" />
                    <span>{this.props.t("Complaints")}</span>
                  </Link>

                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="/#" className="has-arrow">
                        <span>{this.props.t("Pending Complaints")}</span>
                      </Link>
                      <ul>
                        <li>
                          <Link to={"/pending-complaints-lab"}>
                            {this.props.t("Lab")}
                          </Link>
                        </li>
                        <li>
                          <Link to={"/pending-complaints-labhazir"}>
                            {this.props.t("LabHazir")}
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/#" className="has-arrow">
                        <span>{this.props.t("InProcess Complaints")}</span>
                      </Link>
                      <ul>
                        <li>
                          <Link to={"/inprocess-complaints-lab"}>
                            {this.props.t("Lab")}
                          </Link>
                        </li>
                        <li>
                          <Link to={"/inprocess-complaints-labhazir"}>
                            {this.props.t("LabHazir")}
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {/* <li>
                      <Link to={"/inprocess-complaints-lab"}>
                        {this.props.t("In Process")}
                      </Link>
                    </li> */}
                    {/* <li>
                      <Link to={"/resolved-complaints"}>
                        {this.props.t("Resolved")}
                      </Link>
                    </li> */}
                    <li>
                      <Link to="/#" className="has-arrow">
                        <span>{this.props.t("Resolved Complaints")}</span>
                      </Link>
                      <ul>
                        <li>
                          <Link to={"/resolved-complaints-lab"}>
                            {this.props.t("Lab")}
                          </Link>
                        </li>
                        <li>
                          <Link to={"/resolved-complaints-labhazir"}>
                            {this.props.t("LabHazir")}
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/csrs-list">
                    <i className="mdi mdi-account-tie-voice" />
                    <span>{this.props.t("CSR")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* Auditor Admin */}
        {this.state.account_type && this.state.account_type == "auditor-admin" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{this.props.t("Auditor Admin")}</li>
                {/* Auditor Routes */}
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="mdi mdi-hospital-building" />
                    <span>{this.props.t("Audits")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to={"/pending-audits"}>
                        {this.props.t("Pending")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/inprocess-audits"}>
                        {this.props.t("In Process")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/#" className="has-arrow">
                        <span>{this.props.t("Completed")}</span>
                      </Link>
                      <ul>
                        <li>
                          <Link to={"/passed-audits"}>
                            {this.props.t("Pass")}
                          </Link>
                        </li>
                        <li>
                          <Link to={"/failed-audits"}>
                            {this.props.t("Fail")}
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/auditors-list">
                    <i className="mdi mdi-account-search" />
                    <span>{this.props.t("Auditors")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* HR Admin */}
        {this.state.account_type && this.state.account_type == "hr-admin" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{this.props.t("HR Admin")}</li>
                {/* HR Routes */}
                <li>
                  <Link to="/add-staff">
                    <i className="mdi mdi-hospital-building" />
                    <span>{this.props.t("Staff")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/csr-list">
                    <i className="mdi mdi-account-tie-voice" />
                    <span>{this.props.t("CSR")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/auditor-list">
                    <i className="mdi mdi-account-search" />
                    <span>{this.props.t("Auditor")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/finance-officer-list">
                    <i className="mdi mdi-account-cash" />
                    <span>{this.props.t("Finance Officer")}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* Lab */}
        {this.state.account_type && this.state.account_type == "labowner" && (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li>
                  <Link to="/dashboard-lab">
                    <i className="bx bx-home-circle" />
                    <span>{this.props.t("Dashboard")}</span>
                  </Link>
                </li>

                {/* Lab Settings */}
                <li>
                  <Link to="/lab-settings">
                    <i className="mdi mdi-cog" />
                    <span>{this.props.t("Settings")}</span>
                  </Link>
                </li>

                {/* Account Statements */}
                <li>
                  <Link to="/account-statements">
                    <i className="bx bx-receipt" />
                    <span>{this.props.t("Account Statements")}</span>
                  </Link>
                </li>

                <li className="menu-title">{this.props.t("Lab")}</li>

                {/* Offered Test Links */}
                <li>
                  <Link to={"/offered-tests"}>
                    <i className="fas fa-hand-holding-medical" />
                    <span>{this.props.t("Offered Tests")}</span>
                  </Link>
                </li>

                {/* Pathologist Links */}
                <li>
                  <Link to={"pathologists"}>
                    <i className="fas fa-user-md" />
                    <span>{this.props.t("Pathologists")}</span>
                  </Link>
                </li>

                {/* Quality Certificates Links */}
                <li>
                  <Link to={"quality-certificates"}>
                    <i className="mdi mdi-certificate" />
                    <span>{this.props.t("Quality Credentials")}</span>
                  </Link>
                </li>

                {/* Home Sample Collector Links */}
                <li>
                  <Link to={"sample-collectors"}>
                    <i className="mdi mdi-bike" />
                    <span>{this.props.t("Home Sample Collectors")}</span>
                  </Link>
                </li>

                {/* Test Appointment Links */}
                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-test-tube" />
                    <span>{this.props.t("Test Appointments")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to={"/pending-test-appointments"}>
                        {this.props.t("Pending")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/in-process-test-appointments"}>
                        {this.props.t("In Process")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/completed-test-appointments"}>
                        {this.props.t("Completed")}
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Feedbacks Links */}
                <li>
                  <Link to="feedbacks">
                    <i className="mdi mdi-comment" />
                    <span>{this.props.t("Feedbacks")}</span>
                  </Link>
                </li>
                {/* lab Discounts*/}
                <li>
                  <Link to="/discount-lab">
                    <i className="mdi mdi-comment" />
                    <span>{this.props.t("Discount")}</span>
                  </Link>
                </li>
                {/* lab Advertisements*/}
                <li>
                  <Link to={"/lab-advertisement"}>
                    <i className="mdi mdi-book-open"></i>
                    {this.props.t("Advertisements")}
                  </Link>
                </li>
              </ul>
            </div>
          </SimpleBar>
        )}

        {/* Sidebar for Corporate 
        {this.props.location &&
        this.props.location.pathname.includes("dashboard-corporate") ? (
          <SimpleBar className="h-100" ref={this.refDiv}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{this.props.t("Corporate")}</li>
              </ul>
            </div>
          </SimpleBar>
        ) : null} */}
      </React.Fragment>
    );
  }
}

SidebarContent.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.any,
  t: PropTypes.any,
  type: PropTypes.string,
};

export default withRouter(withTranslation()(SidebarContent));