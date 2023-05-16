import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link, Redirect } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Collapse } from "reactstrap";
import logo from "../../../src/assets/images/logo.svg";
import logoLight from "../../../src/assets/images/logo-light.png";
import logoLightSvg from "../../../src/assets/images/logo-light.svg";


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import carts from "pages/CartsList/carts";

class CartList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      carts: [],
      cart: "",
      abc: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      patient_name: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).patient_name
        : "",
      modal: false,
      deleteModal: false,
      isDisabled: true,
      cartListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, cart) => <>{cart.id}</>,
        },
        {
          dataField: "lab_name",
          text: "Lab name",
          sort: true,
        },
        {
          dataField: "test_name",
          text: "Test name",
          sort: true,
          headerStyle: () => {
            return { width: "30%" };
          }
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
          formatter: (cellContent, cart) => (
            <>
              {(
                                  <span>{cart.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>

              )}
            </>
          ),

        },
        {
          dataField: "lab_discount",
          text: "Discount (%)",
          sort: true,
          formatter: (cellContent, cart) => (
            <>
              {(
                <span>{(cart.lab_discount * 100).toFixed()}%</span>
              )}
            </>
          ),
        },
        {
          dataField: "labhaz_discount_test",
          text: "Discount (%)",
          sort: true,
          formatter: (cellContent, cart) => (
            <>
              {(
                <span>{(cart.labhaz_discount_test * 100).toFixed()}%</span>
              )}
            </>
          ),
        },
        {
          dataField: "discount_by_labhazir",
          text: "Discount (%)",
          sort: true,
          formatter: (cellContent, cart) => (
            <>
              {(
                <span>{(cart.discount_by_labhazir * 100).toFixed()}%</span>
              )}
            </>
          ),
        },
        {
          dataField: "total_balance",
          text: "After Discount",
          sort: true,
          formatter: (cellContent, cart) => (
            <>
              {(
                <span>{cart.total_balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, cart) => (
            <Col>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(cart)}
                ></i>
              </Link>
            </Col>
          ),
        },
      ],
    };
    this.handleCartClick = this.handleCartClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    console.log("uuid", this.props.match.params.uuid);
    console.log("guest_id", this.props.match.params.guest_id);
  }

  componentDidMount() {
    const { onGetCarts } = this.props;

    // onGetCarts(this.props.match.params.id);
    // this.setState({ carts: this.props.carts });
    if ((!this.state.user_id)) {
      console.log(onGetCarts(this.props.match.params.guest_id));
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
    if ((this.state.user_id && this.state.user_type !== "CSR"))
    {
      onGetCarts(this.state.user_id);
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
    if((this.state.user_id && this.state.user_type === "CSR"))
    {
      onGetCarts(this.props.match.params.guest_id);
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { carts } = this.props;
    if (!isEmpty(carts) && size(prevProps.carts) !== size(carts)) {
      this.setState({ carts: {}, isEdit: false });
    }
  }

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = carts => {
    this.setState({ carts: carts });
    this.setState({ deleteModal: true });
  };

  handleDeleteCart = () => {
    const { onDeleteCart, onGetCarts } = this.props;
    const { carts } = this.state;

    if (carts.id !== undefined) {
      onDeleteCart(carts);
      // onDeleteAllCart(id);
      setTimeout(() => {
        if ((!this.state.user_id)) {
      console.log(onGetCarts(this.props.match.params.guest_id));
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.props.match.params.uuid)
    }
    if ((this.state.user_id && this.state.user_type !== "CSR"))
    {
      onGetCarts(this.state.user_id);
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.state.user_id)
      console.log("carts:", carts)
    }
    if((this.state.user_id && this.state.user_type === "CSR"))
    {
      onGetCarts(this.props.match.params.guest_id);
      this.setState({ carts: this.props.carts });
      console.log("carts:", this.props.match.params.guest_id)
      console.log("carts:", carts)
    }
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleCart = () => {

    if (this.state.user_id && this.state.user_type !=="CSR") {
      this.props.match.params.uuid = this.props.match.params.guest_id
      console.log(this.props.match.params.uuid)
      this.props.history.push(
        this.props.match.params.uuid
          ? `/checkout/${this.props.match.params.uuid}`
          : `/checkout`
      );
    }
    if (this.state.user_id && this.state.user_type ==="CSR") {
      console.log(this.state.user_id)
      console.log(this.state.user_type)
      console.log(this.props.match.params.guest_id)
      console.log(this.props.match.params.guest_id)
      console.log(this.props.match.params.uuid)
      this.props.history.push(
        this.props.match.params.guest_id
          ? `/checkout-csr/${this.props.match.params.guest_id}`
          : `/checkout-csr`
      );
    }
    if (!this.state.user_id) {
      this.props.history.push(
        this.props.match.params.uuid
          ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
          : `/login/${this.props.match.params.guest_id}`
      );
      // this.props.history.push("/login");
    }
  };

  handleEmptyCart = () => {
    const { onGetCarts, onEmptyCart } = this.props;
    const { carts } = this.state;

    onEmptyCart(this.state.user_id);

    setTimeout(() => {
      if ((!this.state.user_id)) {
        console.log(onGetCarts(this.props.match.params.guest_id));
        this.setState({ carts: this.props.carts });
        console.log("carts:", this.props.match.params.uuid)
      }
      if ((this.state.user_id && this.state.user_type !== "CSR"))
      {
        onGetCarts(this.state.user_id);
        this.setState({ carts: this.props.carts });
        console.log("carts:", this.state.user_id)
        console.log("carts:", carts)
      }
      if((this.state.user_id && this.state.user_type === "CSR"))
      {
        onGetCarts(this.props.match.params.guest_id);
        this.setState({ carts: this.props.carts });
        console.log("carts:", this.props.match.params.guest_id)
        console.log("carts:", carts)
      }
    }, 1000);

    this.setState({ carts });

    this.props.history.push(
      this.props.match.params.uuid
        ? `/nearby-labs/${this.props.match.params.uuid}`
        : `/nearby-labs`
    );
  };

  handleCartClick = (e, arg) => {
    const cart = arg;

    this.setState({
      cart: {
        id: cart.id,
        patient_id: cart.patient_id,
        lab_id: cart.lab_id,
        offered_test_id: cart.offered_test_id,
        test_appointment_id: cart.test_appointment_id,
        invoice_id: cart.invoice_id,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { carts } = this.props;

    const { deleteModal } = this.state;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: carts.length, // replace later with size(carts),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCart}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="p-4">
        <div className="topnav mt-5">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {!this.state.user_id
              ? (
                 <Collapse
                 isOpen={this.props.menuOpen}
                 className="navbar-collapse"
                 id="topnav-menu-content"
               >
                 <ul className="navbar-nav">
                   <li className="nav-item">
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/labs/${this.props.match.params.guest_id}`
                     }
                     className="dropdown-item"
                     >
                    <span className="pt-4 font-size-12">Labs</span>
                     </Link>
                   </li>
 
                   <li className="nav-item">

                     {/* <Link to="/nearby-tests" className="dropdown-item">
                       {this.props.t("Search by Tests")}
                     </Link> */}
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/nearby-tests/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/nearby-tests/${this.props.match.params.guest_id}`
                     }
                     className="dropdown-item"
                     >
                       <span className="pt-4 font-size-12">Search by Tests</span>
                       {/* {this.props.t("Tests")} */}
                     </Link>
                   </li>
                   <li className="nav-item">
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/nearby-profiles/${this.props.match.params.guest_id}`
                     }
                     className="dropdown-item"
                     >
                      <span className="pt-4 font-size-12">Profiles</span>
                       {/* {this.props.t("Profiles")} */}
                     </Link>
                   </li>
                   <li className="nav-item">
                     <Link 
                     to={
                       this.props.match.params.uuid
                         ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                         : `/nearby-packages/${this.props.match.params.guest_id}`
                     }
                     className="dropdown-item"
                     >
                      <span className="pt-4 font-size-12">Packages</span>
                       {/* {this.props.t("Packages")} */}
                     </Link>
                   </li>
                   {/* <li className="nav-item dropdown">
                     <Link
                       to="/#"
                       onClick={e => {
                         e.preventDefault();
                         this.setState({ appState: !this.state.appState });
                       }}
                       className="nav-link dropdown-toggle arrow-none"
                     >
                       <i className="bx bx-store me-2" />
                       {this.props.t("Lab Marketplace")}{" "}
                       <div className="arrow-down" />
                     </Link>
                     <div
                       className={classname("dropdown-menu", {
                         show: this.state.appState,
                       })}
                     >
                       <Link to="/nearby-labs" className="dropdown-item">
                         {this.props.t("Nearby Labs")}
                       </Link>
                       <Link to="/nearby-tests" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}
 
                   {this.state.user_id && this.state.user_type == "patient" && (
                     <li className="nav-item">
                       <Link to={"/test-appointments"} className="dropdown-item">
                         {/* {this.props.t("My Appointments")} */}
                         <span className="pt-4 font-size-12">My Appointments</span>

                       </Link>
                     </li>
                     /* <li className="nav-item dropdown">
                        <Link
                         to="/#"
                         onClick={e => {
                           e.preventDefault();
                           this.setState({ appState: !this.state.appState });
                         }}
                         className="nav-link dropdown-toggle arrow-none"
                       >
                         <i className="bx bx-test-tube me-2" />
                         {this.props.t("Appointments")}{" "}
                         <div className="arrow-down" />
                       </Link>
                       <div
                         className={classname("dropdown-menu", {
                           show: this.state.appState,
                         })}
                       >
                         <Link
                           to={"/test-appointments"}
                           className="dropdown-item"
                         >
                           {this.props.t("Test Appointments")}
                         </Link>
                       </div>
                       </li> */
                   )}
                 </ul>
               </Collapse>

              ): this.state.user_id ? (
                <Collapse
                isOpen={this.props.menuOpen}
                className="navbar-collapse"
                id="topnav-menu-content"
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link 
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-labs/${this.props.match.params.uuid}`
                        : `/nearby-labs/`
                    }
                    className="dropdown-item"
                    >
                      <span className="pt-4 font-size-12">Labs</span>
                      {/* {this.props.t("Labs")} */}
                    </Link>
                  </li>

                  <li className="nav-item">
                    {/* <Link to="/nearby-tests" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                    <Link 
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-tests/${this.props.match.params.uuid}`
                        : `/nearby-tests/`
                    }
                    className="dropdown-item"
                    >
                      {/* {this.props.t("Tests")} */}
                      <span className="pt-4 font-size-12">Tests</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-profiles/${this.props.match.params.uuid}`
                        : `/nearby-profiles/`
                    }
                    className="dropdown-item"
                    >
                      {/* {this.props.t("Profiles")} */}
                      <span className="pt-4 font-size-12">Profiles</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-packages/${this.props.match.params.uuid}`
                        : `/nearby-packages/`
                    }
                    className="dropdown-item"
                    >
                      <span className="pt-4 font-size-12">Packages</span>
                      {/* {this.props.t("Packages")} */}
                    </Link>
                  </li>
                  {/* <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ appState: !this.state.appState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-store me-2" />
                      {this.props.t("Lab Marketplace")}{" "}
                      <div className="arrow-down" />
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.appState,
                      })}
                    >
                      <Link to="/nearby-labs" className="dropdown-item">
                        {this.props.t("Nearby Labs")}
                      </Link>
                      <Link to="/nearby-tests" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                  {this.state.user_id && this.state.user_type == "patient" && (
                    <li className="nav-item">
                      <Link to={"/test-appointments"} className="dropdown-item">
                        {/* {this.props.t("My Appointments")} */}
                        <span className="pt-4 font-size-12">My Appointments</span>

                      </Link>
                    </li>
                    /* <li className="nav-item dropdown">
                       <Link
                        to="/#"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ appState: !this.state.appState });
                        }}
                        className="nav-link dropdown-toggle arrow-none"
                      >
                        <i className="bx bx-test-tube me-2" />
                        {this.props.t("Appointments")}{" "}
                        <div className="arrow-down" />
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: this.state.appState,
                        })}
                      >
                        <Link
                          to={"/test-appointments"}
                          className="dropdown-item"
                        >
                          {this.props.t("Test Appointments")}
                        </Link>
                      </div>
                      </li> */
                  )}
                  
                </ul>
              </Collapse>
              ):null}
             
            </nav>
          </div>
        </div>
        </div>
       
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link
                  to={
                    this.props.match.params.uuid
                      ? `/nearby-labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                      : `/nearby-labs/${this.props.match.params.guest_id}`
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
                      ? `/nearby-labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                      : `/nearby-labs/${this.props.match.params.guest_id}`
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
                        ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                        : `/cart/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle d-none"
                  >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                        {/* {!isEmpty(this.props.carts) &&
                        
                          this.props.carts.slice(-1).pop().cart_quantity+this.state.count
                          } */}
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

                  <Link
                    // to="/contact-us"
                    to={
                      this.props.match.params.uuid
                        ? `/contact-us/${this.props.match.params.uuid}`
                        : `/contact-us`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-phone align-middle me-1 font-size-20" />{" "}
                  </Link>
                </div>
              )
               : this.state.user_type == "patient" ? (
                <div className="dropdown">
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
                      {this.state.patient_name}
                      {/* .split(" ")[0]} */}
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
                    to="/contact-us"
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-phone align-middle me-1 font-size-20" />{" "}
                    {/* <span className="pt-4 font-size-12">Cart</span> */}
                  </Link>
                
                  <Link
                      to={
                        this.props.match.params.uuid
                        ? `/cart/${this.props.match.params.uuid}`
                        : `/cart`
                      }
                      className="btn header-items noti-icon right-bar-toggle d-none"
                  >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                        {!isEmpty(this.props.carts) &&
                        
                          this.props.carts.slice(-1).pop().cart_quantity+this.state.count
                          }
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
        <div className="page-content">
          <MetaTags>
            <title>Carts List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Carts" breadcrumbItem="Carts List" />
            <Row>
              <Col lx="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.cartListColumns}
                      data={carts}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.cartListColumns}
                          data={carts}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                    <Row className="mt-4">
                      <Col sm="6">
                        <button
                          to="/dashboard-patient/:id/nearby-labs"
                          className="btn btn-danger"
                          onClick={this.handleEmptyCart}
                          disabled={this.state.carts.length == 0}
                        >
                          <i className="mdi mdi-delete-empty me-1" />
                          Empty Cart
                        </button>
                      </Col>
                      <Col sm="6">
                        <div className="text-sm-end mt-2 mt-sm-0">
                          <button
                            // component={Link}
                            // to="/checkout"
                            className="btn btn-success"

                            onClick={
                              this.handleCart}

                            disabled={this.state.carts.length == 0}
                          >
                            <i className="mdi mdi-cart-arrow-right me-1" />{" "}
                            Checkout{" "}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

CartList.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  match: PropTypes.object,
  carts: PropTypes.array,
  className: PropTypes.any,
  onGetCarts: PropTypes.func,
  onDeleteCart: PropTypes.func,
  onEmptyCart: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ carts }) => ({
  carts: carts.carts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCarts: id => dispatch(getCarts(id)),
  onDeleteCart: cartItem => dispatch(deleteCart(cartItem)),
  onEmptyCart: id => dispatch(emptyCart(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CartList));
