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
// import "../../../components/HorizontalLayout/horizontal-navbar.scss";
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
import { getNearbyLabs, getAdvLive, getRegionWiseAdvertisement } from "store/labmarket/actions";
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
      regionWiseAdvertisement: [],
      isMenuOpened: false,
      nearbyLabs: [],
      advLives: [],
      advLive: "",
      activeTab: "1",
      address: "",
      search_type: "Current Location",
      km: "30",
      LabType: "Main",
      city: "",
      latitude: "",
      longitude: "",
      location: "",
      currentLatitude: "",
      currentLongitude: "",
      autoplay: true,
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
    console.log("yaha ani chahi hai uuid", this.props.match.params.guest_id)
    console.log(this.state.user_type)
  }
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
    console.log(this.state.isMenuOpened)
  };

  componentDidMount() {
    // const { onGetAdvLive } = this.props;
    // onGetAdvLive(this.state.user_id);
    // this.setState({ advLives: this.props.advLives });


    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      //https://www.geeksforgeeks.org/how-to-reload-page-only-once-in-javascript/
      if (window.localStorage) {

        // If there is no item as 'reload'
        // in localstorage then create one &
        // reload the page
        if (!localStorage.getItem('reload')) {
          localStorage['reload'] = true;
          window.location.reload();
        } else {

          // If there exists a 'reload' item
          // then clear the 'reload' item in
          // local storage
          localStorage.removeItem('reload');
        }
      }

    });

    // region Wise Advertisement 
    const { onGetAdvLive } = this.props;

    setTimeout(() => {

      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });


      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
      };

      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetAdvLive(locationDetails);
        setTimeout(() => {
          this.setState({ advLives: this.props.advLives });
        }, 2000);
      }
    }, 1000);

    const { onGetNearbyLabs } = this.props;
    // near by labs

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
        km: this.state.km,
        LabType: this.state.LabType
      };
      if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
        const guest_id = uuidv4();
        locationDetails.guest_id = guest_id
        console.log("guestid in nearby lab:", guest_id, locationDetails.guest_id)
        // guest_id = locationDetails.guest_id
        console.log("differ:", guest_id)
        this.setState({ guest_id: guest_id });
        console.log("differ:", this.state.guest_id)
        console.log(window.location.href)

        // locationDetails.guest_id =  guest_id

        // onGetNearbyLabs(locationDetails, guest_id);
        // setTimeout(() => {
        //   // const guest_id = uuidv4();
        //   // console.log("uuid in nearby lab:",guest_id)
        //   // locationDetails.guest_id =  guest_id
        //   this.setState({ nearbyLabs: this.props.nearbyLabs });
        //   // console.log("guest id in near by labs and backend;", { nearbyLabs: this.props.nearbyLabs, guest_id })

        // }, 1000);
      }
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
        // locationDetails.guest_id =  this.state.guest_id
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

    // region Wise Advertisement 
    const { onGetRegionWiseAdvertisement } = this.props;

    setTimeout(() => {

      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });


      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
      };

      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetRegionWiseAdvertisement(locationDetails);
        setTimeout(() => {
          this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
        }, 2000);
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
    const { carts } = this.props;
    if (
      !isEmpty(carts) &&
      size(prevProps.carts) !== size(carts)
    ) {
      this.setState({ carts: {} });
    }
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
      const { onGetAdvLive } = this.props;
      const { onGetRegionWiseAdvertisement } = this.props;



      var locationDetails = {
        latitude: "",
        longitude: "",
        search_type: this.state.search_type,
        address: e.target.value,
        city: this.state.city,
        LabType: this.state.LabType,
        km: this.state.km,

      };

      onGetNearbyLabs(locationDetails);
      onGetAdvLive(locationDetails);
      onGetRegionWiseAdvertisement(locationDetails);



      setTimeout(() => {
        this.setState({ nearbyLabs: this.props.nearbyLabs, advLives: this.props.advLives, regionWiseAdvertisement: this.props.regionWiseAdvertisement });
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
      const { onGetAdvLive } = this.props;
      const { onGetRegionWiseAdvertisement } = this.props;

      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: e.target.value,
        address: this.state.address,
        city: this.state.city,
        LabType: this.state.LabType,
        km: this.state.km,
      };
      // region wise advertisement
      onGetNearbyLabs(locationDetails);
      onGetAdvLive(locationDetails);
      onGetRegionWiseAdvertisement(locationDetails);


      setTimeout(() => {
        this.setState({ nearbyLabs: this.props.nearbyLabs, advLives: this.props.advLives, regionWiseAdvertisement: this.props.regionWiseAdvertisement });
      }, 1000);
    }
  };

  onChangeKm = e => {
    this.setState({ km: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      km: e.target.value,
      LabType: this.state.LabType,
      address: this.state.address,
      city: this.state.city,
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);
  };
  onChangeType = e => {
    this.setState({ LabType: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      LabType: e.target.value,
      km: this.state.km,
      address: this.state.address,
      city: this.state.city,
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyLabs } = this.props;
    const { onGetAdvLive } = this.props;
    const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
      LabType: this.state.LabType,
      km: this.state.km,
    };

    onGetNearbyLabs(locationDetails);
    onGetAdvLive(locationDetails);
    onGetRegionWiseAdvertisement(locationDetails);


    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs, advLives: this.props.advLives, regionWiseAdvertisement: this.props.regionWiseAdvertisement });
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

  resetVideo = (event) => {
    event.target.currentTime = 0;
  };

  render() {
    const { history } = this.props;
    const { discountData, nearbyLabs, page, totalPage, regionWiseAdvertisement, } = this.state;

    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.user_id && this.state.user_type === "CSR"
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.uuid}`
                              : `/labs`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-tests/${this.props.match.params.uuid}`
                              : `/nearby-tests`
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
                              ? `/nearby-profiles/${this.props.match.params.uuid}`
                              : `/nearby-profiles`
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
                              ? `/nearby-packages/${this.props.match.params.uuid}`
                              : `/nearby-packages`
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
                              : `/nearby-radiology`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={"/test-appointments"} className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                      )}
                    </ul>
                  </Collapse>
                ) : null}
              {!this.state.user_id
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/labs/${this.state.guest_id}`
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
                              ? `/nearby-tests/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-tests/${this.state.guest_id}`
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
                              ? `/nearby-profiles/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-profiles/${this.state.guest_id}`
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
                              ? `/nearby-packages/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-packages/${this.state.guest_id}`
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
                              ? `/nearby-radiology/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-radiology/${this.state.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={"/test-appointments"} className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                      )}
                    </ul>
                  </Collapse>

                ) : this.state.user_id && this.state.user_type !== "CSR" ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
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

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={"/test-appointments"} className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                      )}
                    </ul>
                  </Collapse>
                ) : null}

            </nav>
          </div>
        </div>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link
                  to={
                    this.props.match.params.uuid
                      ? `/nearby-labs/${this.state.guest_id}/${this.props.match.params.uuid}`
                      : `/nearby-labs/${this.state.guest_id}`
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
                      ? `/nearby-labs/${this.state.guest_id}/${this.props.match.params.uuid}`
                      : `/nearby-labs/${this.state.guest_id}`
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
                onClick={this.openMenu}
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
                        ? `/cart/${this.state.guest_id}/${this.props.match.params.uuid}`
                        : `/cart/${this.state.guest_id}`
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
                        ? `/login/${this.state.guest_id}/${this.props.match.params.uuid}`
                        : `/login/${this.state.guest_id}`
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
                        {this.state.patient_name.split(" ")[0]}
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
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                      {!isEmpty(this.props.carts) &&

                        this.props.carts.slice(-1).pop().cart_quantity + this.state.count
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
                      <div className="dropdown d-lg-inline-block ms-4 mt-4">

                        <Link
                          to={"/dashboard-csr"}
                          className="btn header-items noti-icon right-bar-toggle"
                        >
                          <i className="mdi mdi-home me-1 font-size-24" />{" "}
                        </Link>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/cart/${this.props.match.params.uuid}`
                              : `/cart`
                          }
                          className="btn header-items noti-icon right-bar-toggle"
                        >
                          <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                          {!isEmpty(this.props.carts) &&

                            this.props.carts.slice(-1).pop().cart_quantity + this.state.count
                          }
                        </Link>
                        {/* <Link
                     to={
                       this.props.match.params.uuid
                         ? `/login/${this.props.match.params.uuid}`
                         : `/login`
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
                   </Link> */}
                      </div>
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

          <Row style={{ marginLeft: "20px" }}>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>

            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
            <Col lg="9">
              <Row className="mb-3">
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    search_type:
                      (this.state && this.state.search_type) ||
                      "Current Location",
                    city: (this.state && this.state.city) || "",
                    location: (this.state && this.state.location) || "",
                    LabType: (this.state && this.state.LabType) ||
                      "Main",
                    km: (this.state && this.state.km) ||
                      "30",
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
                          {/* <Col lg="3"> */}
                          <div className="mb-3">
                            <Label>Search By Kilo Meters</Label>
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={e => this.onChangeKm(e)}
                                id="pac-input"
                                type="text"
                                className="form-control"
                                placeholder="Search By Km..."
                              />
                              <div className="input-group-append">
                                <span className="input-group-text">Km</span>
                              </div>
                            </div>
                          </div>
                          {/* </Col> */}
                          <div className="mt-4" style={{ display: 'none' }}>
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
                        <Col lg="3">
                          <div className="mb-3">
                            <Label for="LabType" className="form-label">
                              Search By Labs Type
                            </Label>
                            <Field
                              name="LabType"
                              component="select"
                              onChange={e => this.onChangeType(e)}
                              value={this.state.LabType}
                              className="form-select"
                            >
                              <option value="Main">Main Labs</option>
                              <option value="Collection">Collection Points
                              </option>
                              <option value="Others">Both</option>
                            </Field>
                          </div>
                        </Col>

                        {/* City field */}
                        <Col lg="3">
                          <div className="mb-3">
                            <Label for="LabType" className="form-label">
                              Search By City
                            </Label>
                            <Select
                              name="city "
                              comp onent="Select"
                              onChange={this.onChangeCity}
                              className="defautSelectParent is-invalid"
                              options={CITIES}
                              placeholder="Select City..."
                            />
                          </div>
                        </Col>

                        {/* Custom Address field */}
                        {/* <Col lg="3">
                          {this.state.city != "" && (
                            <div className="mt-4">
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
                        </Col> */}

                      </Row>
                    </Form>
                  )}
                </Formik>
              </Row>

              <Row>
                {!isEmpty(nearbyLabs) && (!this.state.user_id) &&
                  nearbyLabs.map((nearbyLab, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card
                        onClick={() =>
                          history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                          )
                        }
                      >
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                           
                              className="img-thumbnail mx-auto d-block rounded"
                              />
                          </div> */}
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
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") &&
                  nearbyLabs.map((nearbyLab, key) => (
                    <Col xl="4" sm="9" key={"col" + key}>
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

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-email"></i>{" "}
                                {nearbyLab.email}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="bx bx-mobile"></i>{" "}
                                {nearbyLab.phone}
                              </span>
                            </div>

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
                {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type === "CSR") &&
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
                            {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                           
                              className="img-thumbnail mx-auto d-block rounded"
                              />
                          </div> */}
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
              </Row>
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
            </Col>

            <Col lg="3">
              {!isEmpty(this.props.advLives) &&
                this.props.advLives.map((advLive, key) => (
                  <Col lg="9" key={"col" + key}>
                    <Card>
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-tests-discountedlh/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-tests-discountedlh/${this.state.guest_id}`
                          }
                        >
                          <div>
                            {advLive.poster ? (
                              advLive.poster.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                <img
                                  src={
                                    process.env.REACT_APP_BACKENDURL + advLive.poster
                                  }
                                  alt="Advertisement"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "cover",
                                  }}
                                  className="img-fluid mx-auto d-block"
                                />
                              ) : (
                                <video
                                  width="100%"
                                  height="100%"
                                  controls
                                  autoPlay={this.state.autoplay}
                                  loop
                                >
                                  <source
                                    src={process.env.REACT_APP_BACKENDURL + advLive.poster}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>

                                // <video width="100%" height="100%" controls autoPlay>
                                // <source
                                // src={
                                // process.env.REACT_APP_BACKENDURL + advLive.poster
                                // }
                                // type="video/mp4"
                                // />
                                // Your browser does not support the video tag.
                                // </video>
                              )
                            ) : (
                              <div>No media found.</div>
                            )}
                          </div></Link>
                      </CardBody>
                    </Card>
                  </Col>
                ))}

              {this.props.regionWiseAdvertisement.map((regionWiseAdvertisement, key) => (
                <>
                  {regionWiseAdvertisement.nearby_adv_list.map(
                    (nearby_adv_list, key) => (
                      <Col lg="9" key={"col" + key}>
                        {!isEmpty(regionWiseAdvertisement) && (
                          <Card>
                            <CardBody>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearby_adv_list.account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearby_adv_list.account_id}`
                                }
                              >
                                {/* <div className="product-img position-relative">
                                  <img
                                    src={
                                      process.env.REACT_APP_BACKENDURL +
                                      nearby_adv_list.poster
                                    }
                                    alt="Advertisement"
                                    style={{
                                      width: "250px",
                                      height: "250px",
                                      objectFit: "cover",
                                    }}
                                    className="img-fluid mx-auto d-block" />
                                </div> */}
                                <div>
                                  <img
                                    src={process.env.REACT_APP_BACKENDURL +
                                      nearby_adv_list.poster}
                                    alt="Lab Advertisement"
                                    // className=" text-end"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: "cover" }}
                                  />
                                </div>
                              </Link>
                            </CardBody>
                          </Card>
                        )}
                      </Col>
                    )
                  )}
                </>
              ))}



            </Col>
          </Row>
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
  regionWiseAdvertisement: PropTypes.array,
  nearbyLabs: PropTypes.array,
  onGetNearbyLabs: PropTypes.func,
  onGetRegionWiseAdvertisement: PropTypes.func,
  onGetAdvLive: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = state => ({
  nearbyLabs: state.LabMarket.nearbyLabs,
  regionWiseAdvertisement: state.LabMarket.regionWiseAdvertisement,
  advLives: state.LabMarket.advLives,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: locationDetails => dispatch(getNearbyLabs(locationDetails)),
  onGetRegionWiseAdvertisement: locationDetails => dispatch(getRegionWiseAdvertisement(locationDetails)),
  onGetAdvLive: locationDetails => dispatch(getAdvLive(locationDetails)),
  offeredTestsList: guest_id => dispatch(offeredTestsList(guest_id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => {
    // Return an object that merges stateProps, dispatchProps, and ownProps
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps
    };
  }
)(withRouter(NearbyLabs));

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(NearbyLabs));
