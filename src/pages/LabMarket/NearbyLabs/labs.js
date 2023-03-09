import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
// import ScrollButton from "components/Common/Scrollbutton";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Redirect, Link, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Collapse } from "reactstrap";
import classname from "classnames";
import logo from "../../../assets/images/logo.svg";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";

//i18n
import { withTranslation } from "react-i18next";
import "../../../components/HorizontalLayout/horizontal-navbar.scss";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

//Import Star Ratings
import StarRatings from "react-star-ratings";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import data
import { productsData } from "common/data";

//Import actions
import { getNearbyLabs, getAdvLive } from "store/labmarket/actions";
import { any } from "prop-types";
import "./nearbylabs.scss";

import { CITIES } from "helpers/global_variables_helper";
import offeredTestsList from "pages/OfferedTests/offered-tests-list";

class NearbyLabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      ratingvalues: [],
      nearbyLabs: [],
      advLives: [],
      advLive: "",
      activeTab: "1",
      address: "",
      search_type: "Current Location",
      city: "",
      latitude: "",
      longitude: "",
      location: "",
      currentLatitude: "",
      currentLongitude: "",
      discountData: [],
      filters: {
        discount: [],
        price: { min: 0, max: 500 },
      },
      page: 1,
      totalPage: 5, //replace this with total pages of data
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.onSelectRating = this.onSelectRating.bind(this);
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid)
    console.log(this.state.user_type)
  }

  componentDidMount() {
    let matchingMenuItem = null;
    const ul = document.getElementById("navigation");
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

    const { advLives, onGetAdvLive } = this.props;
    onGetAdvLive(this.state.user_id);
    this.setState({ advLives });


    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      //https://www.geeksforgeeks.org/how-to-reload-page-only-once-in-javascript/
      //   if (window.localStorage) {

      //     // If there is no item as 'reload'
      //     // in localstorage then create one &
      //     // reload the page
      //     if (!localStorage.getItem('reload')) {
      //         localStorage['reload'] = true;
      //         window.location.reload();
      //     } else {

      //         // If there exists a 'reload' item
      //         // then clear the 'reload' item in
      //         // local storage
      //         localStorage.removeItem('reload');
      //     }
      // }

    }
    );

    const { onGetNearbyLabs } = this.props;
    // const guest_id = uuidv4();
    // console.log("uuid in nearby lab:",this.state.user_id)


    setTimeout(() => {

      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });
      // this.setState({ guest_id: guest_id });



      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
      };
      // if (!this.state.user_id && !this.props.match.params.guest_id) {

      //   const guest_id = uuidv4();
      //   locationDetails.guest_id=guest_id
      //   console.log("uuid in nearby lab:",guest_id , locationDetails.guest_id)
      //   // guest_id = locationDetails.guest_id
      //   console.log("differ:",guest_id)
      //   this.setState({ guest_id: guest_id });
      //   console.log("differ:",this.props.match.params.guest_id)
      //   console.log(window.location.href)

      //   // locationDetails.guest_id =  guest_id

      //   // onGetNearbyLabs(locationDetails, guest_id);
      //   // setTimeout(() => {
      //   //   // const guest_id = uuidv4();
      //   //   // console.log("uuid in nearby lab:",guest_id)
      //   //   // locationDetails.guest_id =  guest_id
      //   //   this.setState({ nearbyLabs: this.props.nearbyLabs });
      //   //   // console.log("guest id in near by labs and backend;", { nearbyLabs: this.props.nearbyLabs, guest_id })

      //   // }, 1000);
      // }
      // if (isAuthProtected && !localStorage.getItem("authUser")) {
      //   const guest_id = uuidv4();
      //   // console.log("differ route main set hoi:",guest_id)
      //   // this.setState({ guest_id: guest_id });



      //   return (
      //     <Redirect
      //       // to={{ pathname: "/nearby-labs/"+ guest_id, state: { from: props.location } }}
      //       to={
      //         { pathname: "/nearby-labs", state: { from: props.location } }

      //       }
      //     />
      //   );
      // }


      if (this.state.currentLatitude && this.state.currentLongitude) {
        // const guest_id = locationDetails.guest_id
        // console.log("differ:",guest_id)
        // this.setState({ guest_id: guest_id });
        // locationDetails.guest_id =  this.props.match.params.guest_id
        // console.log("differ:",locationDetails.guest_id)

        onGetNearbyLabs(locationDetails);
        setTimeout(() => {
          // const guest_id = uuidv4();
          // console.log("uuid in nearby lab:",guest_id)
          // locationDetails.guest_id =  guest_id
          this.setState({ nearbyLabs: this.props.nearbyLabs });
          // console.log("guest id in near by labs and backend;", { nearbyLabs: this.props.nearbyLabs, guest_id })

        }, 1000);
      }
    }, 1000);
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { nearbyLabs } = this.props;
    if (
      isEmpty(prevProps.nearbyLabs) &&
      !isEmpty(nearbyLabs) &&
      size(nearbyLabs) !== size(prevProps.nearbyLabs)
    ) {
      this.setState({ nearbyLabs });
    }
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  onSelectDiscount = e => {
    const { value, checked } = e.target;
    const {
      filters,
      filters: { discount },
    } = this.state;
    this.setState(
      {
        filters: {
          ...filters,
          discount: discount.find(item => item === value)
            ? discount.filter(item => item !== value)
            : [...discount, value],
        },
      },
      () => {
        this.onFilterProducts(value, checked);
      }
    );
  };

  onFilterProducts = (value, checked) => {
    const {
      filters: { discount },
    } = this.state;
    let filteredProducts = productsData;
    if (!!checked && parseInt(value) === 0) {
      filteredProducts = productsData.filter(
        nearbyLab => nearbyLab.offer < 100
      );
    } else if (discount.length > 0) {
      filteredProducts = productsData.filter(
        nearbyLab => nearbyLab.offer >= Math.min(...discount)
      );
    }
    this.setState({ nearbyLabs: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyLabs: productsData.filter(
        nearbyLab =>
          nearbyLab.newPrice >= value[0] && nearbyLab.newPrice <= value[1]
      ),
    });
  };

  /*
  on change rating checkbox method
  */
  onChangeRating = value => {
    this.setState({
      nearbyLabs: productsData.filter(nearbyLab => nearbyLab.rating >= value),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyLabs: productsData.filter(nearbyLab => nearbyLab.rating === value),
    });
  };

  onUncheckMark = value => {
    var modifiedRating = [...this.state.ratingvalues];
    const modifiedData = (modifiedRating || []).filter(x => x !== value);
    /*
    find min values
    */
    var filteredProducts = productsData;
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter(
          nearbyLab => nearbyLab.rating >= minValue
        );

        this.setState({ ratingvalues: modifiedData });
      }
    } else {
      filteredProducts = productsData;
    }
    this.setState({ nearbyLabs: filteredProducts });
  };

  handlePageClick = page => {
    this.setState({ page });
  };

  onChangeAddress = e => {
    // Apply that city's latitude and longitude as city bound so that we see addresses of that city only
    var cityBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(this.state.latitude, this.state.longitude)
    );

    const options = {
      bounds: cityBounds,
      types: ["establishment"],
      componentRestrictions: { country: "pk" },
    };

    var searchBox = new window.google.maps.places.SearchBox(e.target, options);

    searchBox.addListener("places_changed", () => {
      const { onGetNearbyLabs } = this.props;

      var locationDetails = {
        latitude: "",
        longitude: "",
        search_type: this.state.search_type,
        address: e.target.value,
        city: this.state.city,
      };

      onGetNearbyLabs(locationDetails);

      setTimeout(() => {
        this.setState({ nearbyLabs: this.props.nearbyLabs });
      }, 1000);
    });
  };

  onChangeSearchType = e => {
    this.setState({ search_type: e.target.value });

    // Call nearby labs API only if the search type changes to current location
    if (e.target.value === "Current Location") {
      this.setState({ city: "" });
      this.setState({ address: "" });

      const { onGetNearbyLabs } = this.props;

      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: e.target.value,
        address: this.state.address,
        city: this.state.city,
      };

      onGetNearbyLabs(locationDetails);

      setTimeout(() => {
        this.setState({ nearbyLabs: this.props.nearbyLabs });
      }, 1000);
    }
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyLabs } = this.props;

    var locationDetails = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
    };

    onGetNearbyLabs(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);

    var latitude = "";
    var longitude = "";

    setTimeout(() => {
      var geocoder = new google.maps.Geocoder();

      // Concatenate city selected with Pakistan, so that it can be set as proper address
      var address = selectedGroup.value + ", Pakistan";

      // Using geocoder search address and get its latitude and longitude
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
        }
      });

      // Set the values of simple variables to the state variables of latitude and longitude
      // so that it can be used outside of this function
      setTimeout(() => {
        this.setState({ latitude: latitude });
        this.setState({ longitude: longitude });
      }, 1000);
    }, 1000);
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };

  render() {
    const { history } = this.props;
    const { discountData, nearbyLabs, page, totalPage } = this.state;

    return (
      <React.Fragment>
        <div className="topnav">
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
                              ? `/nearby-labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-labs/${this.props.match.params.guest_id}`
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
                          <span className="pt-4 font-size-12">Tests</span>
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
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-radiology/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
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

                ) : this.state.user_id ? (
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
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.uuid}`
                              : `/nearby-radiology/`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
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
                ) : null}

            </nav>
          </div>
        </div>

        <div className="page-content">
          <MetaTags>
            <title>Nearby Labs | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
            <Row>
              {/* <Col lg="3">
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Filter</CardTitle>
                    <div className="mt-4 pt-3">
                      <h5 className="font-size-14 mb-4">Price</h5>
                      <br />

                      <Nouislider
                        range={{ min: 0, max: 600 }}
                        tooltips={true}
                        start={[100, 500]}
                        connect
                        onSlide={this.onUpdate}
                      />
                    </div>

                    <div className="mt-4 pt-3">
                      <h5 className="font-size-14 mb-3">Discount</h5>
                      {discountData.map((discount, i) => (
                        <div className="form-check mt-2" key={i}>
                          <Input
                            type="checkbox"
                            value={discount.value}
                            className="form-check-input"
                            id={i}
                            onChange={this.onSelectDiscount}
                          />{" "}
                          <Label className="form-check-label" htmlFor={i}>
                            {discount.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3">
                      <h5 className="font-size-14 mb-3">Customer Rating</h5>
                      <div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck1"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(4);
                              } else {
                                this.onUncheckMark(4);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck1"
                          >
                            4 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck2"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(3);
                              } else {
                                this.onUncheckMark(3);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck2"
                          >
                            3 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck3"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(2);
                              } else {
                                this.onUncheckMark(2);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck3"
                          >
                            2 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck4"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onSelectRating(1);
                              } else {
                                this.onUncheckMark(1);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck4"
                          >
                            1 <i className="bx bxs-star text-warning" />
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>  */}

              {/* <Col lg="9"> */}
              <Row className="mb-3">
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    search_type:
                      (this.state && this.state.search_type) ||
                      "Current Location",
                    city: (this.state && this.state.city) || "",
                    location: (this.state && this.state.location) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    city: Yup.string().when("search_type", {
                      is: val => val === "Custom Address",
                      then: Yup.string().required("Please enter your City"),
                    }),
                    location: Yup.string().when("city", {
                      is: val => val != "",
                      then: Yup.string().required("Please enter your Location"),
                    }),
                  })}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      {/* Type field */}
                      <Row>
                        <Col lg="3">
                          <div className="mb-3">
                            <Field
                              name="search_type"
                              component="select"
                              onChange={e => this.onChangeSearchType(e)}
                              value={this.state.search_type}
                              className="form-select"
                            >
                              <option value="Current Location">
                                Current Location
                              </option>
                              <option value="Custom Address">
                                Custom Address
                              </option>
                            </Field>
                          </div>
                        </Col>

                        {/* City field */}
                        <Col lg="3">
                          {this.state.search_type === "Custom Address" && (
                            <div className="mb-3">
                              <Select
                                name="city "
                                component="Select"
                                onChange={this.onChangeCity}
                                className="defautSelectParent is-invalid"
                                options={CITIES}
                                placeholder="Select City..."
                              />
                            </div>
                          )}
                        </Col>

                        {/* Custom Address field */}
                        <Col lg="3">
                          {this.state.city != "" && (
                            <div className="mb-3">
                              <Input
                                defaultValue={this.state.address}
                                onChange={e => this.onChangeAddress(e)}
                                id="pac-input"
                                type="text"
                                className="form-control"
                                placeholder="Search Location..."
                              />
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Row>

              {/* ROW FOR ADVERTISEMENT */}
              {/* <Row> */}
              {
                this.props.advLives.map((advLive) => (
                  <Col lg="3" key={1}>
                    {advLive.advertisement_type == "Lab" &&
                      <Card>
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${advLive.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${advLive.account_id}/${this.props.match.params.guest_id}`
                            }
                          >
                            <div className="mt-4 text-center">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  advLive.poster
                                }
                                alt="Lab Logo"
                                style={{
                                  width: "200px",
                                  height: "300px",
                                  objectFit: "cover",
                                }}
                                className="img-fluid mx-right d-block"
                              />
                            </div>
                          </Link>
                        </CardBody>
                      </Card>
                    }
                    {advLive.advertisement_type == "Labhazir" &&
                      <Card>
                        <CardBody>
                          <div className="mt-4 text-center">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                advLive.poster
                              }
                              alt="Lab Logo"
                              style={{
                                width: "200px",
                                height: "300px",
                                objectFit: "cover",
                              }}
                              className="img-fluid mx-right d-block"
                            />
                          </div>
                        </CardBody>
                      </Card>
                    }
                  </Col>
                ))}
              {!isEmpty(nearbyLabs) && (!this.state.user_id) &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                        )
                      }
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                          }
                        >
                          <div style={{
                            width: '200px',
                            height: '100px',
                          }}>
                            <img
                              src={process.env.REACT_APP_BACKENDURL + nearbyLab.logo}
                              alt="Lab Logo"
                              className=" text-end"
                              style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0">
                            <span className="text-muted me-2">
                              <i className="mdi mdi-google-maps"></i>{" "}
                              {nearbyLab.address}
                            </span>
                          </div>

                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {nearbyLab.opening_time}
                              </span>
                            </div>
                          )}

                          {!nearbyLab.is_247_opened && nearbyLab.closing_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {nearbyLab.closing_time}
                              </span>
                            </div>
                          )}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div> */}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="bx bx-mobile"></i>{" "}
                                  {nearbyLab.phone}
                                </span>
                              </div> */}

                          <div className="my-0">
                            <span className="text-muted me-2">
                              <i className="mdi mdi-phone"></i>{" "}
                              {nearbyLab.landline}
                            </span>
                          </div>
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger" >
                                <i className="mdi mdi-account-question"></i>{" "}
                                Lab has female sample collectors
                              </span>
                            </div>
                          )}
                          <div className="my-0 mt-2">
                            <StarRatings
                              rating={nearbyLab.rating}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="14px"
                              starSpacing="3px"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {!isEmpty(nearbyLabs) && (this.state.user_id) &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      }
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          }
                        >
                          <div style={{
                            width: '200px',
                            height: '100px',
                          }}>
                            <img
                              src={process.env.REACT_APP_BACKENDURL + nearbyLab.logo}
                              alt="Lab Logo"
                              className=" text-end"
                              style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0">
                            <span className="text-muted me-2">
                              <i className="mdi mdi-google-maps"></i>{" "}
                              {nearbyLab.address}
                            </span>
                          </div>

                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {nearbyLab.opening_time}
                              </span>
                            </div>
                          )}

                          {!nearbyLab.is_247_opened && nearbyLab.closing_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {nearbyLab.closing_time}
                              </span>
                            </div>
                          )}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div> */}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="bx bx-mobile"></i>{" "}
                                  {nearbyLab.phone}
                                </span>
                              </div> */}

                          <div className="my-0">
                            <span className="text-muted me-2">
                              <i className="mdi mdi-phone"></i>{" "}
                              {nearbyLab.landline}
                            </span>
                          </div>
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger" >
                                <i className="mdi mdi-account-question"></i>{" "}
                                Lab has female sample collectors
                              </span>
                            </div>
                          )}
                          <div className="my-0 mt-2">
                            <StarRatings
                              rating={nearbyLab.rating}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="14px"
                              starSpacing="3px"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}

              {isEmpty(nearbyLabs) && (
                <Row>
                  <Col lg="12">
                    <div className=" mb-5">
                      <h4 className="text-uppercase">
                        {/* <i className="bx bx-loader-circle"></i>{" "} */}
                        Loading.....
                      </h4>
                    </div>
                  </Col>
                </Row>
              )}
              {/* <ScrollButton /> */}
            </Row>

            {/* <Row>
                  <Col lg="12">
                    <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                      <PaginationItem disabled={page === 1}>
                        <PaginationLink
                          previous
                          href="#"
                          onClick={() => this.handlePageClick(page - 1)}
                        />
                      </PaginationItem>
                      {map(Array(totalPage), (item, i) => (
                        <PaginationItem active={i + 1 === page} key={i}>
                          <PaginationLink
                            onClick={() => this.handlePageClick(i + 1)}
                            href="#"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem disabled={page === totalPage}>
                        <PaginationLink
                          next
                          href="#"
                          onClick={() => this.handlePageClick(page + 1)}
                        />
                      </PaginationItem>
                    </Pagination>
                  </Col>
                </Row> */}
            {/* </Col> */}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabs.propTypes = {
  history: any,
  location: any,
  match: PropTypes.object,
  carts: PropTypes.array,
  advLives: PropTypes.array,
  nearbyLabs: PropTypes.array,
  onGetNearbyLabs: PropTypes.func,
  onGetAdvLive: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = state => ({
  nearbyLabs: state.LabMarket.nearbyLabs,
  advLives: state.LabMarket.advLives,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: locationDetails => dispatch(getNearbyLabs(locationDetails)),
  onGetAdvLive: id => dispatch(getAdvLive(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyLabs));
