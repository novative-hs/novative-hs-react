import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
import { Collapse } from "reactstrap";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Container,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";
// import ScrollButton from "components/Common/Scrollbutton";

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
import { getNearbyRadiology, getRadiology } from "store/radiologymarket/actions";
import { addToCart } from "store/actions";
import { any } from "prop-types";
import "./nearbylabs.scss";

import { CITIES } from "helpers/global_variables_helper";

class NearbyPackage extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      ratingvalues: [],
      nearbyRadiology: [],
      Radiology: [],
      activeTab: "1",
      address: "",
      test_name: "",
      test_type:"",
      search_type: "Current Location",
      city: "",
      latitude: "",
      longitude: "",
      currentLatitude: "",
      currentLongitude: "",
      location: "",
      km: "30",
      LabType: "Main",
      success: "",
      error: "",
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
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id)
    console.log(this.state.user_type)
  }

  componentDidMount() {
    // let matchingMenuItem = null;
    // const ul = document.getElementById("navigation");
    // const items = ul.getElementsByTagName("a");
    // for (let i = 0; i < items.length; ++i) {
    //   if (this.props.location.pathname === items[i].pathname) {
    //     matchingMenuItem = items[i];
    //     break;
    //   }
    // }
    // if (matchingMenuItem) {
    //   this.activateParentDropdown(matchingMenuItem);
    // }
    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });
    const { Radiology, onGetRadiology } = this.props;
    if (Radiology && !Radiology.length) {
      console.log(onGetRadiology(this.state.user_id));
    }
    const { onGetNearbyRadiology } = this.props;

    setTimeout(() => {
      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });

      var data = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
        test_name: this.state.test_name,
        km: this.state.km,
        LabType: this.state.LabType,


      };

      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetNearbyRadiology(data);

        setTimeout(() => {
          this.setState({ nearbyRadiology: this.props.nearbyRadiology });
        }, 1000);
      }
    }, 1000);
  }
  // activateParentDropdown = item => {
  //   item.classList.add("active");
  //   const parent = item.parentElement;
  //   if (parent) {
  //     parent.classList.add("active"); // li
  //     const parent2 = parent.parentElement;
  //     parent2.classList.add("active"); // li
  //     const parent3 = parent2.parentElement;
  //     if (parent3) {
  //       parent3.classList.add("active"); // li
  //       const parent4 = parent3.parentElement;
  //       if (parent4) {
  //         parent4.classList.add("active"); // li
  //         const parent5 = parent4.parentElement;
  //         if (parent5) {
  //           parent5.classList.add("active"); // li
  //           const parent6 = parent5.parentElement;
  //           if (parent6) {
  //             parent6.classList.add("active"); // li
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // };
  // openDescriptionModal = (e, arg) => {
  //   this.setState({
  //     DescriptionModal: true,
  //     description_in_english: arg.description_in_english,
  //     description_in_urdu: arg.description_in_urdu,
  //   });
  // };

  toggleDescriptionModal = () => {
    this.setState(prevState => ({
      DescriptionModal: !prevState.DescriptionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
    });
  };
  
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { nearbyRadiology } = this.props;
    if (
      isEmpty(prevProps.nearbyRadiology) &&
      !isEmpty(nearbyRadiology) &&
      size(nearbyRadiology) !== size(prevProps.nearbyRadiology)
    ) {
      this.setState({ nearbyRadiology });
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
        nearbyPackage => nearbyPackage.offer < 10
      );
    } else if (discount.length > 0) {
      filteredProducts = productsData.filter(
        nearbyPackage => nearbyPackage.offer >= Math.min(...discount)
      );
    }
    this.setState({ nearbyRadiology: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyPackage =>
          nearbyPackage.newPrice >= value[0] && nearbyPackage.newPrice <= value[1]
      ),
    });
  };

  /*
  on change rating checkbox method
  */
  onChangeRating = value => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyPackage => nearbyPackage.rating >= value
      ),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyPackage => nearbyPackage.rating === value
      ),
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
          nearbyPackage => nearbyPackage.rating >= minValue
        );

        this.setState({ ratingvalues: modifiedData });
      }
    } else {
      filteredProducts = productsData;
    }
    this.setState({ nearbyRadiology: filteredProducts });
  };

  handlePageClick = page => {
    this.setState({ page });
  };

  handleBlur = () => {
    // Calling API when focus is out of test name and setting nearby tests array
    const { onGetNearbyRadiology } = this.props;

    var latitude;
    var longitude;

    if (this.state.search_type == "Current Location") {
      latitude = this.state.currentLatitude;
      longitude = this.state.currentLongitude;
    } else {
      latitude = "";
      longitude = "";
    }

    if (this)
      var data = {
        latitude: latitude,
        longitude: longitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
        test_name: this.state.test_name,
        LabType: this.state.LabType,
        km: this.state.km,

      };

    onGetNearbyRadiology(data);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);
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
      this.setState({ address: e.target.value });

      // Calling API whenever address changes and setting nearby tests array
      setTimeout(() => {
        const { onGetNearbyRadiology } = this.props;

        var data = {
          latitude: "",
          longitude: "",
          search_type: this.state.search_type,
          address: e.target.value,
          city: this.state.city,
          test_name: this.state.test_name,
          LabType: this.state.LabType,
          km: this.state.km,

        };

        onGetNearbyRadiology(data);

        setTimeout(() => {
          this.setState({ nearbyRadiology: this.props.nearbyRadiology });
        }, 1000);
      }, 1000);
    });
  };

  onChangeSearchType = e => {
    this.setState({ search_type: e.target.value });

    // Call nearby labs API only if the search type changes to current location
    if (e.target.value === "Current Location") {
      this.setState({ city: "" });
      this.setState({ address: "" });

      const { onGetNearbyRadiology } = this.props;

      var data = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: e.target.value,
        address: this.state.address,
        city: this.state.city,
        test_name: this.state.test_name,
        LabType: this.state.LabType,
        km: this.state.km,

      };

      onGetNearbyRadiology(data);

      setTimeout(() => {
        this.setState({ nearbyRadiology: this.props.nearbyRadiology });
      }, 1000);
    }
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyRadiology } = this.props;

    // ------------- Call API on city name START -------------
    var data = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
      test_name: this.state.test_name,
      LabType: this.state.LabType,
      km: this.state.km,

    };

    onGetNearbyRadiology(data);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);

    // ------------- Call API on city name END -------------

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

  handleAddToCart = cart => {
    const { onAddToCart } = this.props;

    if (!this.state.user_id) {
      // this.props.history.push("/login");
      this.setState({ guest_id: this.props.match.params.guest_id });
      cart.guest_id = this.props.match.params.guest_id
      onAddToCart(cart, cart.guest_id);

      console.log("uuid:", cart.guest_id, this.props.match.params.guest_id)
    } 
    if(this.state.user_id && this.state.user_type !== "CSR") {
      onAddToCart(cart, this.state.user_id);
    }
    if(this.state.user_id && this.state.user_type === "CSR") {
      onAddToCart(cart, this.props.match.params.guest_id);
    }

    setTimeout(() => {
      this.setState({ success: "Item added to the cart successfully.", });
      this.setState({ error: this.props.error });
    }, 2000);
  };

  onChangeKm = e => {
    this.setState({ km: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyRadiology } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var data = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      km: e.target.value,
      LabType: this.state.LabType,
      address: this.state.address,
      city: this.state.city,
      test_name: this.state.test_name,

    };
    // region wise advertisement
    onGetNearbyRadiology(data);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);
  };

  onChangeType = e => {
    this.setState({ LabType: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyRadiology } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var data = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      LabType: e.target.value,
      km: this.state.km,
      address: this.state.address,
      city: this.state.city,
      test_name: this.state.test_name,

    };
    // region wise advertisement
    onGetNearbyRadiology(data);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);
  };

  render() {
    const { page, totalPage } = this.state;
    const { Radiology } = this.props;

    const cityList = [];
    for (let i = 0; i < this.props.Radiology.length; i++) {
      cityList.push({
        label: this.props.Radiology[i].name,
        value: this.props.Radiology[i].id,
      });
    }
    return (
      <React.Fragment>
              <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
             {this.state.user_id && this.state.user_type ==="CSR"
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
                            this.props.match.params.guest_id
                              ? `/labs/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-tests/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-profiles/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-packages/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-radiology/${this.props.match.params.guest_id}`
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
                ): null}
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
                         : `/labs/${console.log(this.props.match.params.guest_id)}`
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

              ): this.state.user_id && this.state.user_type !== "CSR"  ? (
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
              ):null}
             
            </nav>
          </div>
        </div>
        <div className="page-content">
          <MetaTags>
            <title>Search by Radiology | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Search by Radiology" />
            <Row>
            <Modal
                isOpen={this.state.DescriptionModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggleDescriptionModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">Description in english</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_english"
                                id="description_in_english"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_english}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">Description in urdu</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_urdu"
                                id="description_in_urdu"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_urdu}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>
            <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-6">
                                                    <Label className="form-label">
                                                    Test Description
                                                    </Label>
                                                  </div>
                                                  <textarea
                                  name="test_details"
                                  id="test_details"
                                  rows="10"
                                  cols="10"
                                  value={this.state.test_details}
                                  className="form-control"
                                  readOnly={true}
                                />
                                                  {/* <div >
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.test_details
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                  </Modal>
              {/* <Col lg="3">
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Filter</CardTitle>
                  </CardBody>
                </Card>
              </Col> */}

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
                    <Form
                      onSubmit={this.handleSubmit}
                      className="form-horizontal"
                    >
                      {/* Type field */}
                      <Row>

              <Col lg="3">
              <Label>Search By Radiology Name</Label>
                          <div className="mb-3">
                            <Select
                              name="profile"
                              component="Select"
                              
                              onChange={selectedGroup =>
                                this.setState({
                                  test_name: selectedGroup.value,
                                })
                              }
                              onBlur={this.handleBlur}
                              value={this.state.test_name}
                              className="defautSelectParent"
                              options={
                                cityList
                              }
                              defaultValue={{
                                label:
                                  Radiology.test_name,
                                value:
                                  Radiology.test_name,
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg="3">
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

              {/* Alerts to show success and error messages when item is added to the cart */}
              {this.state.success ? (
                window.location.reload()>
                <Alert color="success" className="col-md-5">
                  {this.state.success}
                </Alert>
              ) : this.state.error ? (
                <Alert color="danger" className="col-md-6">
                  {this.state.error}
                </Alert>
              ) : null}

              <Row>
                {!isEmpty(this.props.nearbyRadiology) &&
                  this.props.nearbyRadiology.map((nearbyPackage, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                "/media/" +
                                nearbyPackage.lab_logo
                              }
                              alt="Lab Logo"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                              className="img-fluid mx-auto d-block"
                            />
                          </div> */}

                          <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {nearbyPackage.test_name}{" "}
                            </h5>
                            <div className="my-0">
                              <Link
                                to="#"
                                onClick={e => this.openPatientModal(e, nearbyPackage)}
                              >
                                <span>
                                Test Description
                                </span>
                              </Link>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                Rs {nearbyPackage.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              </span>
                            </div>
                            {nearbyPackage.discount>=0.01 && (
                              <div className="my-0">
                              <span className="text-danger" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount: {(nearbyPackage.discount*100).toFixed()} % 
                              </span>
                            </div>
                            )}
                            {nearbyPackage.all_discount_by_labhazir + nearbyPackage.discount_by_labhazir>=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount LabHazir: {((nearbyPackage.all_discount_by_labhazir*100)+(nearbyPackage.discount_by_labhazir*100)).toFixed()} % 
                              </span>
                              
                            </div>
                            )}
                              {/* {nearbyPackage.discount_by_labhazir>=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                discount labhazir to Lab: {(nearbyPackage.discount_by_labhazir*100).toFixed()} % 
                              </span>
                              
                            </div>
                            )} */}
                            
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {nearbyPackage.duration_required}{" "}
                                {nearbyPackage.duration_type}
                              </span>
                            </div>
                           
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {nearbyPackage.is_home_sampling_available}
                              </span>
                            </div>
                            <div className="my-0">
                            {(this.state.user_id) && (this.state.user_type ==="CSR") && (
                       <Link
                       to={
                         this.props.match.params.guest_id
                           ? `/nearby-lab-detail/${nearbyPackage.lab_account_id}/${this.props.match.params.guest_id}`
                           : `/nearby-lab-detail/${nearbyPackage.lab_account_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         {nearbyPackage.lab_name}{" "}

                       </span>
                     </Link>
                      )}
                            {(this.state.user_id) && (this.state.user_type !=="CSR") && (
                       <Link
                       to={
                         this.props.match.params.uuid
                           ? `/nearby-lab-detail/${nearbyPackage.lab_account_id}/${this.props.match.params.uuid}`
                           : `/nearby-lab-detail/${nearbyPackage.lab_account_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         {nearbyPackage.lab_name}{" "}

                       </span>
                     </Link>
                      )}
                              {/* <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Lab:{" "}
                                {nearbyPackage.lab_name}
                              </span> */}
                            </div>
                            <div className="my-0 mt-2">
                            <StarRatings
                              rating={nearbyPackage.rating}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="14px"
                              starSpacing="3px"
                            />
                          </div>

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-medal"></i> EQA
                                Participation: {nearbyPackage.is_eqa_participation}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Test Performed:{" "}
                                {nearbyPackage.is_test_performed}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Duration
                                Required: {nearbyPackage.duration_required}{" "}
                                {nearbyPackage.duration_type}
                              </span>
                            </div> */}
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(nearbyPackage)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.nearbyRadiology) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry, no result found.
                        </h4>
                      </div>
                    </Col>
                  </Row>
                )}
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
              {/* <ScrollButton /> */}
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

NearbyPackage.propTypes = {
  history: any,
  location: any,
  match: PropTypes.object,
  nearbyRadiology: PropTypes.array,
  onGetNearbyRadiology: PropTypes.func,
  onAddToCart: PropTypes.func,
  onGetRadiology: PropTypes.func,
  Radiology: PropTypes.array,
  success: PropTypes.any,
  className: PropTypes.any,
  error: PropTypes.any,
  RadiologyMarket: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ RadiologyMarket, carts }) => ({
  nearbyRadiology: RadiologyMarket.nearbyRadiology,
  Radiology: RadiologyMarket.Radiology,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyRadiology: data => dispatch(getNearbyRadiology(data)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetRadiology: () => dispatch(getRadiology()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyPackage));
