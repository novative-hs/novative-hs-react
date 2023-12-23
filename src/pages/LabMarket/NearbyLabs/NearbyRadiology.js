import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
import { Collapse } from "reactstrap";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

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
import ScrollButton from "components/Common/Scrollbutton";

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
import { getTerritoriesList } from "store/territories-list/actions";
import { getLabNamesList } from "store/lab-names/actions";

class nearbyRadiology extends Component {
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
      territoriesList: [],
      Radiology: [],
      labNamesList: [],
      name: "",
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
      page: "1",
      LabType: "Main",
      success: "",
      error: "",
      discountData: [],
      itemsInCart: [],
      loading: true, // Add loading state property
      filters: {
        discount: [],
        price: { min: 0, max: 500 },
      },
      page: 1,
      // totalPage: 5, //replace this with total pages of data
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.onSelectRating = this.onSelectRating.bind(this);
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid)
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id)
    console.log(this.state.user_type)
  }

  componentDidMount() {
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
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
  
    const url = window.location.href;
    const queryString = url.substring(url.indexOf('&') + 1);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params)
  
    const latitudeFromUrl = params.get('lat');
    const longitudeFromUrl = params.get('lon');
  
    console.log('Latitude:', latitudeFromUrl);
    console.log('Longitude:', longitudeFromUrl);
  
    // Check if latitude and longitude values are present in URL parameters
    if (latitudeFromUrl && longitudeFromUrl) {
      // Use latitude and longitude from URL
      latitude = parseFloat(latitudeFromUrl);
      longitude = parseFloat(longitudeFromUrl);
      console.log("print lat log in app", latitude, longitude);
  
      // Call the dependent code here or pass the latitude and longitude values as arguments
      this.handleLocationUpdate(latitude, longitude);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log("web", latitude, longitude);
  
        // Call the dependent code here or pass the latitude and longitude values as arguments
        this.handleLocationUpdate(latitude, longitude);
      });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000); // Set loading state to false after 7 seconds

  }

  handleLocationUpdate(latitude, longitude) {
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
        page: this.state.page,
        name: this.state.name,

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
        nearbyRadiology => nearbyRadiology.offer < 10
      );
    } else if (discount.length > 0) {
      filteredProducts = productsData.filter(
        nearbyRadiology => nearbyRadiology.offer >= Math.min(...discount)
      );
    }
    this.setState({ nearbyRadiology: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyRadiology =>
          nearbyRadiology.newPrice >= value[0] && nearbyRadiology.newPrice <= value[1]
      ),
    });
  };

  /*
  on change rating checkbox method
  */
  onChangeRating = value => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyRadiology => nearbyRadiology.rating >= value
      ),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyRadiology: productsData.filter(
        nearbyRadiology => nearbyRadiology.rating === value
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
          nearbyRadiology => nearbyRadiology.rating >= minValue
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
  onChangeLabName = (selectedGroup) => {
    this.setState({ name: selectedGroup.value });

    // Call nearby labs API only if the search type changes to current location

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
        name: selectedGroup.value,
        test_name: this.state.test_name,
        LabType: this.state.LabType,
        km: this.state.km,
        page: this.state.page,
      };

      onGetNearbyRadiology(data);
  
      setTimeout(() => {
        this.setState({ nearbyRadiology: this.props.nearbyRadiology });
      }, 1000);
  };

  onchangename = (selectedGroup) => {
    this.setState({ test_name: selectedGroup.value });
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
        page: this.state.page,
        name: this.state.name,

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
          page: this.state.page,
          name: this.state.name,

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
        page: this.state.page,
        name: this.state.name,

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
      page: this.state.page,
      name: this.state.name,

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

  handleAddToCart = (cart) => {
    const { onAddToCart } = this.props;
  
    // Check if the item is already in the cart based on user type
    if (!this.state.user_id) {
      // Check if the item is already in the cart
      if (cart.guest_id === this.props.match.params.guest_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      this.setState({ guest_id: this.props.match.params.guest_id });
      cart.guest_id = this.props.match.params.guest_id;
      onAddToCart(cart, cart.guest_id);
  
      console.log("uuid:", cart.guest_id, this.props.match.params.guest_id);
    } else if (this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      // Check if the item is already in the cart
      if (cart.user_id === this.state.user_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.state.user_id);
    } else if (this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      // Check if the item is already in the cart
      if (cart.guest_id === this.props.match.params.guest_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.props.match.params.guest_id);
    } else if (this.state.user_type === "b2bclient" && this.state.user_type !== "CSR") {
      // Check if the item is already in the cart
      if (cart.user_id === this.state.user_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.props.match.params.uuid);
    }
  
    // Update the state to include the newly added item in the cart
    const updatedItemsInCart = [...this.state.itemsInCart, cart];
    this.setState({ itemsInCart: updatedItemsInCart });

  
    this.showSuccessMessage("Item added Successfully");
  };
  
  showErrorMessage = (message) => {
    this.showPopup(message, "red");
  };
  
  showSuccessMessage = (message) => {
    this.showPopup(message, "green");
  };
  
  showPopup = (message, textColor) => {
    // Create and style the popup
    const popup = document.createElement("div");
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";
  
    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.top = "50%";
    popupContent.style.left = "50%";
    popupContent.style.transform = "translate(-50%, -50%)";
    popupContent.style.background = "#fff";
    popupContent.style.padding = "20px";
    popupContent.style.borderRadius = "5px";
    popupContent.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  
    const messageElement = document.createElement("div");
    messageElement.style.fontSize = "18px";
    messageElement.style.textAlign = "center";
    messageElement.style.color = textColor; // Set the text color
  
    // Set the message
    messageElement.textContent = message;
  
    // Append elements to the DOM
    popupContent.appendChild(messageElement);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
  
    // Show the popup
    popup.style.display = "block";
  
    // Hide the popup after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000); // 3000 milliseconds = 3 seconds
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
      page: this.state.page,
      name: this.state.name,

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
      page: this.state.page,
      name: this.state.name,

    };
    // region wise advertisement
    onGetNearbyRadiology(data);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);
  };
  onChangepage = async (e, pageNumber) => {
    e.preventDefault();
    this.setState({ page: pageNumber }); // Update the page in the state
    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyRadiology } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var data = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      page: pageNumber, // Use the updated page number
      km: this.state.km,
      LabType: this.state.LabType,
      address: this.state.address,
      city: this.state.city,
      test_name: this.state.test_name,
      name: this.state.name,

    };
    // region wise advertisement
    onGetNearbyRadiology(data);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({ nearbyRadiology: this.props.nearbyRadiology });
    }, 1000);
  };
  calculateTotalPage = (items) => {
    const itemsPerPage = Math.min(5, items.length); // Number of items to display per page, up to a maximum of 50
      const totalItems = items.length;
      console.log("total pahe number", totalItems)
      return Math.ceil(totalItems / itemsPerPage);
    };

shouldHighlightTestsLink() {
  const { location } = this.props;
  const currentURL = location.pathname;

  // Check if the URL contains "nearby-test"
  return currentURL.includes('/nearby-radiology/');
}
  render() {
    const isSmallScreen = window.innerWidth < 490;

    const isTestsLinkHighlighted = this.shouldHighlightTestsLink();

    const linkStyles = {
      color: isTestsLinkHighlighted ? 'black' : 'black', // Text color
      // backgroundColor: isTestsLinkHighlighted ? '#ffcc00' : 'transparent', // Background color
      fontWeight: isTestsLinkHighlighted ? 'bold' : 'normal',
    };

    const totalPage = !isEmpty(this.props.nearbyRadiology) ? this.calculateTotalPage(this.props.nearbyRadiology) : 1;
    console.log("total pahe number", totalPage)
    const isLargeScreen = window.innerWidth < 490;

    const { page } = this.state;
    const { Radiology } = this.props;

    const radiologyList = [];
    for (let i = 0; i < this.props.Radiology.length; i++) {
      radiologyList.push({
        label: this.props.Radiology[i].name,
        value: this.props.Radiology[i].name,
      });
    }
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].city,
      });
    }
    const { loading } = this.state;
    const labNames = this.props.labNamesList.map((labnameslist) => ({
      label: labnameslist.name,
      value: labnameslist.name, // Use the profile ID as the value
    }));
    return (
      <React.Fragment>
              <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
            {this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient"
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
                              ? `/nearby-test/${this.props.match.params.guest_id}`
                              : `/nearby-test`
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
                          <span className="pt-4 font-size-12" style={linkStyles}>Radiology</span>  

                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Book a Test</span>
                        </Link>
                      </li>
                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          } className="dropdown-item">
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
                 isOpen={this.props.menuOpen}
                 className="navbar-collapse"
                 id="topnav-menu-content"
               >
                 <ul className="navbar-nav">
                    {this.props.match.params.filnalurl ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    ) : (
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
                    )}

{this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-test/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : null}
                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
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
                          </Link>
                        </li>
                      ) : null}

                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
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
                          </Link>
                        </li>
                      ) : null}

                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12" style={linkStyles}>Radiology</span>  

                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-radiology/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12" style={linkStyles}>Radiology</span>  

                          </Link>
                        </li>
                      ) : null}
{this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Book a Test</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Book a Test</span>
                          </Link>
                        </li>
                      ) : null}
               
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
                       <Link to="/nearby-test" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          } className="dropdown-item">
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

              ): 
              this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient"  ? (
                <Collapse
                isOpen={this.props.menuOpen}
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
                          {/* {this.props.t("Labs")} */}
                        </Link>
                      </li>

                      <li className="nav-item">
                        {/* <Link to="/nearby-test" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-test/${this.props.match.params.guest_id}`
                              : `/nearby-test/`
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
                            this.props.match.params.guest_id
                              ? `/nearby-profiles/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-packages/${this.props.match.params.guest_id}`
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
                            this.props.match.params.guest_id
                              ? `/nearby-radiology/${this.props.match.params.guest_id}`
                              : `/nearby-radiology/`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12" style={linkStyles}>Radiology</span>  

                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Book a Test</span>
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
                      <Link to="/nearby-test" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          } className="dropdown-item">
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
              ):
              this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient" ? (
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
                            ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
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
                            ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-test`
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
                            ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
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
                            ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
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
                            ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>Radiology</span>  

                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>  
                    <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Book a Test</span>
                        </Link>
                      </li> 
                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          } className="dropdown-item">
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
                                                    Radiology Description
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
              {!isSmallScreen ? (
                <Row className="mb-3">
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      search_type:
                        (this.state && this.state.search_type) ||
                        "Current Location",
                      city: (this.state && this.state.city) || "",
                      name: (this.state && this.state.name) ||
                        "",
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
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Radiology Name
                              </Label>
                              <Select
                              name="profile"
                              component="Select"
                              onChange={this.onchangename}
                              className="defautSelectParent"
                              options={
                                radiologyList
                              }
                              defaultValue={{
                                label:
                                  Radiology.test_name,
                                value:
                                  Radiology.test_name,
                              }}
                               styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: '2px solid blue',
                                  borderRadius: '5px',
                                }),
                                // Add more style overrides as needed
                              }}
                              />
                            </div>
                          </Col>
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Lab Name
                              </Label>
                              <Select
                               name="labnamwslist"
                               component="Select"
                               onChange={this.onChangeLabName}
                               value={labNames.find(
                                 (item) => item.value === this.state.name
                               )} // Use find to match the selected value in the options
                               className="defautSelectParent"
                               options={labNames}
                               styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: '2px solid blue',
                                  borderRadius: '5px',
                                }),
                                // Add more style overrides as needed
                              }}

                            />
                            </div>
                          </Col>
                          <Col xs="3" sm="3" md="2" lg="2">
                            <div className="mb-3">
                              <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Labs Type
                              </Label>
                              <Field
                                name="LabType"
                                component="select"
                                onChange={(e) => this.onChangeType(e)}
                                value={this.state.LabType}
                                className="form-select"
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="Main">Main Labs</option>
                                <option value="Collection">Collection Points</option>
                                <option value="Others">Both</option>
                              </Field>
                            </div>
                          </Col>
                          <Col xs="3" sm="3" md="2" lg="2">
                            <div className="mb-3">
                              <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search Types
                              </Label>
                              <Field
                                name="search_type"
                                component="select"
                                onChange={e => this.onChangeSearchType(e)}
                                value={this.state.search_type}
                                className="form-select"
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="Current Location">
                                  Current Location
                                </option>
                                <option value="City">Search By City</option>
                                <option value="Custom Address">Custom Address</option>
                              </Field>
                            </div>
                          </Col>
                          {this.state.search_type === 'City' && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}>By City </span>
                                </Label>
                                <Select
                                  name="city"
                                  component="Select"
                                  onChange={this.onChangeCity}
                                  className="defautSelectParent is-invalid"
                                  options={cityList}
                                  placeholder=""
                                  styles={{
                                    control: (provided, state) => ({
                                      ...provided,
                                      border: '2px solid blue',
                                      borderRadius: '5px',
                                    }),
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === 'Custom Address' && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px', }}>Custom Address </span>
                                </Label>
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={(e) => this.onChangeAddress(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  style={{
                                    border: '2px solid blue',
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {(this.state.search_type === 'Current Location' || this.state.search_type === 'Custom Address') && (
                            <Col xs="1" sm="2" md="1" lg="1">
                              <div className="mb-3">
                                <Label
                                  for="LabType"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}>Km </span>
                                </Label>
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={(e) => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"  // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder=""
                                    style={{
                                      border: '2px solid blue',
                                      borderRadius: '5px',
                                      fontSize: '14px'
                                      // Add more style overrides as needed
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              ) : <Row>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    search_type:
                      (this.state && this.state.search_type) ||
                      "Current Location",
                    city: (this.state && this.state.city) || "",
                    location: (this.state && this.state.location) || "",
                    LabType: (this.state && this.state.LabType) || "Main",
                    km: (this.state && this.state.km) || "30",
                  }}
                  validationSchema={Yup.object().shape({
                    city: Yup.string().when("search_type", {
                      is: val => val === "Custom Address",
                      then: Yup.string().required("Please enter your City"),
                    }),
                    location: Yup.string().when("city", {
                      is: val => val != "",
                      then: Yup.string().required(
                        "Please enter your Location"
                      ),
                    }),
                  })}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      {/* Type field */}
                      {/* Type field */}
                      <h4 style={{ background: "#3B71CA", color: "white", fontWeight: "bold" }}> Search Radiology for more result in Pakistan!</h4>
                      <Row className="g-0">
                        <Col>
                          <div>
                            <Select
                              name="profile"
                              component="Select"
                              onChange={this.onchangename}
                              className="defautSelectParent"
                              options={
                                radiologyList
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
                        <Col xs="4" sm="4" md="3" lg="3">
                          <div>
                            <Field
                              name="LabType"
                              component="select"
                              onChange={e => this.onChangeType(e)}
                              value={this.state.LabType}
                              className="form-select"
                            >
                              <option value="Main">Main Labs</option>
                              <option value="Collection">
                                Collection Points
                              </option>
                              <option value="Others">Both</option>
                            </Field>
                          </div>
                        </Col>
                      </Row>
                      <Row className="g-0">
                        <Col xs="6" sm="6" md="3" lg="3">
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
                              <option value="City">By City</option>
                              <option value="Custom Address">
                                Custom Address
                              </option>
                            </Field>
                          </div>
                        </Col>

                        {this.state.search_type === "Current Location" && (
                          <Col xs="2" sm="2" md="2" lg="2">
                            <div className="mb-3">
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={e => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  style={{ fontSize: "14px" }} // Set input font size to 14 pixels
                                  placeholder="Search By Km..."
                                />
                              </div>
                            </div>
                          </Col>
                        )}
                        {this.state.search_type === "Custom Address" && (
                          <Col xs="2" sm="2" md="2" lg="2">
                            <div className="mb-3">
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={e => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  style={{ fontSize: "14px" }} // Set input font size to 14 pixels
                                  placeholder="Search By Km..."
                                />
                              </div>
                            </div>
                          </Col>
                        )}
                        {/* City field */}
                        {this.state.search_type === "City" && (
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Select
                                name="city"
                                component="Select"
                                onChange={this.onChangeCity}
                                className="defautSelectParent is-invalid"
                                options={cityList}
                                placeholder="City..."
                              />
                            </div>
                          </Col>
                        )}
                        {/* Custom Address field */}
                        {this.state.search_type === "Custom Address" && (
                          <Col xs="4" sm="4" md="3" lg="3">
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
                          </Col>
                        )}
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Row>}

              {/* Alerts to show success and error messages when item is added to the cart */}
              {this.state.success ? (
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
                  this.props.nearbyRadiology.map((nearbyRadiology, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card style={{ height: "95%" }}>
                        <CardBody>
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                "/media/" +
                                nearbyRadiology.lab_logo
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
                            <Tooltip title={nearbyRadiology.test_name}>
                              <span> {nearbyRadiology.test_name} </span>
                              </Tooltip>
                            </h5>
                            <div className="my-0">
                              <Link
                                to="#"
                                onClick={e => this.openPatientModal(e, nearbyRadiology)}
                              >
                                <span>
                                Radiology Description
                                </span>
                              </Link>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                Rs {nearbyRadiology.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              </span>
                            </div>
                            {nearbyRadiology.discount>=0.01 && (
                              <div className="my-0">
                              <span className="text-danger" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount: {(nearbyRadiology.discount*100).toFixed()} % 
                              </span>
                            </div>
                            )}
                            {nearbyRadiology.all_discount_by_labhazir + nearbyRadiology.discount_by_labhazir>=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount LabHazir: {((nearbyRadiology.all_discount_by_labhazir*100)+(nearbyRadiology.discount_by_labhazir*100)).toFixed()} % 
                              </span>
                              
                            </div>
                            )}
                              {/* {nearbyRadiology.discount_by_labhazir>=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                discount labhazir to Lab: {(nearbyRadiology.discount_by_labhazir*100).toFixed()} % 
                              </span>
                              
                            </div>
                            )} */}
                            
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {nearbyRadiology.duration_required}{" "}
                                {nearbyRadiology.duration_type}
                              </span>
                            </div>
                           
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {nearbyRadiology.is_home_sampling_available}
                              </span>
                            </div>
                            <div className="my-0">
                            {!this.state.user_id ? (
                                <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  {nearbyRadiology.lab_name}{" "}
                                  
                                </span>
                              </Link>
                              ):null}
                              {(this.state.user_id) && (this.state.user_type ==="CSR") && (this.state.user_type !=="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.filnalurl
                           ? `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.filnalurl}`
                           : `/nearby-lab-detail/${nearbyRadiology.lab_account_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         {nearbyRadiology.lab_name}{" "}

                       </span>
                     </Link>
                      )}
                            {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type !=="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.uuid
                           ? `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                           : `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         {nearbyRadiology.lab_name}{" "}

                       </span>
                     </Link>
                      )}
                      {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type ==="b2bclient") && (
                       <Link
                       to={
                         this.props.match.params.guest_id
                           ? `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                           : `/nearby-lab-detail/${nearbyRadiology.lab_account_id}/${this.props.match.params.guest_id}`
                       }

                       className="text-dark"
                     >
                       <span className="text-primary">
                         {nearbyRadiology.lab_name}{" "}

                       </span>
                     </Link>
                      )}
                            </div>
                            <div className="my-0 mt-2">
                            <StarRatings
                              rating={nearbyRadiology.rating}
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
                                Participation: {nearbyRadiology.is_eqa_participation}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Test Performed:{" "}
                                {nearbyRadiology.is_test_performed}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Duration
                                Required: {nearbyRadiology.duration_required}{" "}
                                {nearbyRadiology.duration_type}
                              </span>
                            </div> */}
                            <Button
  type="button"
  color={this.state.itemsInCart.includes(nearbyRadiology) ? 'secondary' : 'primary'}
  className={`btn mt-3 me-1${this.state.itemsInCart.includes(nearbyRadiology) ? ' disabled' : ''}`}
  onClick={() => this.handleAddToCart(nearbyRadiology)}
  disabled={this.state.itemsInCart.includes(nearbyRadiology)} // Disable the button if the item is in the cart
>
  <i className="bx bx-cart me-2" /> {this.state.itemsInCart.includes(nearbyRadiology) ? 'Already Added' : 'Add to cart'}
</Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                {/* {loading ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px' }}>
                          Please Wait.....
                        </div>
                      </Col>
                    </Row>
                  ) : isEmpty(this.props.nearbyRadiology) ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                         Sorry No Result Found.....
                        </div>
                      </Col>
                    </Row>
                  ) : null} */}
                  {isEmpty(this.props.nearbyRadiology) && (
                    loading ? (
                      <Row>
                        <Col lg="12">
                          <div className="mb-5" style={{ fontSize: '24px' }}>
                            Please Wait.....
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col lg="12">
                          <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                          Sorry, No Radiology Found In Your Specific Area.....
                          </div>
                        </Col>
                      </Row>
                    )
                  )}
                  {!isEmpty(this.props.nearbyRadiology) ? (
                   <Row>
                   <Col lg="12">
                     <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                       <PaginationItem disabled={page === 1}>
                         <PaginationLink
                           previous
                           href="#"
                           onClick={(e) => this.onChangepage(e, page - 1)}
                         />
                       </PaginationItem>
                       {Array.from({ length: totalPage }, (_, i) => {
                         const pageNumber = i + 1;
                         return (
                           <PaginationItem key={i} active={pageNumber === this.state.page}>
                             <PaginationLink onClick={(e) => this.onChangepage(e, pageNumber)} href="#">
                               {pageNumber}
                             </PaginationLink>
                           </PaginationItem>
                         );
                       })}
                       <PaginationItem disabled={page === totalPage}>
                         <PaginationLink
                           next
                           href="#"
                           onClick={(e) => this.onChangepage(e, page + 1)}
                         />
                       </PaginationItem>
                     </Pagination>
                   </Col>
                 </Row>
                
                  ) : null}
              </Row>
              <ScrollButton />
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

nearbyRadiology.propTypes = {
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
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onGetLabNamesList: PropTypes.func,
  labNamesList: PropTypes.array,
};

const mapStateToProps = ({ RadiologyMarket, carts, labNamesList }) => ({
  nearbyRadiology: RadiologyMarket.nearbyRadiology,
  Radiology: RadiologyMarket.Radiology,
  success: carts.success,
  error: carts.error,
  territoriesList: RadiologyMarket.territoriesList,
  labNamesList: labNamesList.labNamesList,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyRadiology: data => dispatch(getNearbyRadiology(data)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetRadiology: () => dispatch(getRadiology()),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetLabNamesList: () => dispatch(getLabNamesList()),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(nearbyRadiology));
