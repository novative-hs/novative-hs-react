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
import { Button, Collapse } from "reactstrap";
import classname from "classnames";
import logo from "../../../assets/images/logo.svg";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



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
import { getNearbyLabs, getAdvLive, getRegionWiseAdvertisement, getPatientProfile } from "store/labmarket/actions";
// import { getPatientProfile } from "store/auth/patientprofile/actions";

import { any } from "prop-types";
import "./nearbylabs.scss";

import { getTerritoriesList } from "store/territories-list/actions";


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
      territoriesList: [],
      advLives: [],
      patientProfile: [],
      advLive: "",
      activeTab: "1",
      isDropdownOpen: false,
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
    console.log("guest_id", this.props.match.params.guest_id);
    console.log("uuid", this.props.match.params.uuid);
    console.log("id", this.props.match.params.id);
    console.log("fid", this.props.match.params.filnalurl);
    console.log("type", this.state.user_type);

  }
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
    console.log(this.state.isMenuOpened)
  };

  componentDidMount() {
    const { territoriesList, onGetTerritoriesList, onGetAdvLive, onGetNearbyLabs, onGetRegionWiseAdvertisement } = this.props;

    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }

    const { patientProfile, onGetPatientProfile } = this.props;
    onGetPatientProfile(this.state.user_id);
    this.setState({
      patientProfile
    });
    console.log("state", patientProfile);

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

      const url = `http://localhost:3000/nearby-labs/&lat=${latitude}&lon=${longitude}`;
      const queryString = url.substring(url.indexOf("&") + 1);
      const finalUrl = ("&") + queryString; // Remove the leading question mark ('?')        
      this.setState({ finalUrl: finalUrl });
      console.log("differ with the final url state:", this.state.finalUrl);

      console.log(finalUrl);
      console.log("whsuqi", latitude, longitude, this.props.match.params.uuid);

      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });

      // region Wise Advertisement
      const advLiveLocationDetails = {
        latitude,
        longitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
      };

      if (latitude && longitude) {
        onGetAdvLive(advLiveLocationDetails);
        setTimeout(() => {
          this.setState({ advLives: this.props.advLives });
        }, 500);
      }

      const nearbyLabsLocationDetails = {
        latitude,
        longitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
        km: this.state.km,
        LabType: this.state.LabType,
        guest_id,
      };
      if (latitude && longitude) {
        onGetNearbyLabs(nearbyLabsLocationDetails);
        setTimeout(() => {
          this.setState({ nearbyLabs: this.props.nearbyLabs });
        }, 500);
      }

      // near by labs
      if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
        const guest_id = uuidv4();
        const nearbyLabsLocationDetails = {
          latitude,
          longitude,
          search_type: this.state.search_type,
          address: this.state.address,
          city: this.state.city,
          km: this.state.km,
          LabType: this.state.LabType,
          guest_id,
        };
        console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
        this.setState({ guest_id });
        console.log("differ:", this.state.guest_id)
        console.log(window.location.href);
        if (latitude && longitude) {
          onGetNearbyLabs(nearbyLabsLocationDetails);
          setTimeout(() => {
            this.setState({ nearbyLabs: this.props.nearbyLabs });
          }, 500);
        }
      }

      // near by labs
      if (this.state.user_id || this.state.user_type === "b2bclient") {
        const nearbyLabsLocationDetails = {
          latitude,
          longitude,
          search_type: this.state.search_type,
          address: this.state.address,
          city: this.state.city,
          km: this.state.km,
          LabType: this.state.LabType,
        };
        if (latitude && longitude) {
          onGetNearbyLabs(nearbyLabsLocationDetails);
          setTimeout(() => {
            this.setState({ nearbyLabs: this.props.nearbyLabs });
          }, 500);
        }
      }

      // region Wise Advertisement 
      const regionWiseAdvLocationDetails = {
        latitude,
        longitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
      };
      if (latitude && longitude) {
        onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
        setTimeout(() => {
          this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
        }, 500);
      }
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log("web", latitude, longitude);

        this.setState({ currentLatitude: latitude });
        this.setState({ currentLongitude: longitude });

        // region Wise Advertisement
        const advLiveLocationDetails = {
          latitude,
          longitude,
          search_type: this.state.search_type,
          address: this.state.address,
          city: this.state.city,
        };

        if (latitude && longitude) {
          onGetAdvLive(advLiveLocationDetails);
          setTimeout(() => {
            this.setState({ advLives: this.props.advLives });
          }, 500);
        }
        const nearbyLabsLocationDetails = {
          latitude,
          longitude,
          search_type: this.state.search_type,
          address: this.state.address,
          city: this.state.city,
          km: this.state.km,
          LabType: this.state.LabType,
          guest_id,
        };
        if (latitude && longitude) {
          onGetNearbyLabs(nearbyLabsLocationDetails);
          setTimeout(() => {
            this.setState({ nearbyLabs: this.props.nearbyLabs });
          }, 500);
        }
        // near by labs
        if (this.state.user_id || this.state.user_type === "b2bclient") {
          const nearbyLabsLocationDetails = {
            latitude,
            longitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,
            km: this.state.km,
            LabType: this.state.LabType,
          };
          if (latitude && longitude) {
            onGetNearbyLabs(nearbyLabsLocationDetails);
            setTimeout(() => {
              this.setState({ nearbyLabs: this.props.nearbyLabs });
            }, 500);
          }
        }

        // near by labs
        if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
          const guest_id = uuidv4();
          const nearbyLabsLocationDetails = {
            latitude,
            longitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,
            km: this.state.km,
            LabType: this.state.LabType,
            guest_id,
          };
          console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
          this.setState({ guest_id });
          console.log("differ:", this.state.guest_id)
          console.log(window.location.href);
          if (latitude && longitude) {
            onGetNearbyLabs(nearbyLabsLocationDetails);
            setTimeout(() => {
              this.setState({ nearbyLabs: this.props.nearbyLabs });
            }, 500);
          }
        }

        // region Wise Advertisement 
        const regionWiseAdvLocationDetails = {
          latitude,
          longitude,
          search_type: this.state.search_type,
          address: this.state.address,
          city: this.state.city,
        };
        if (latitude && longitude) {
          onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
          setTimeout(() => {
            this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
          }, 500);
        }
      });
    }

    console.log("url with ln and log", window.location.href);
  }





  // handleLocationUpdate(latitude, longitude) {
  //   const { onGetAdvLive, onGetNearbyLabs, onGetRegionWiseAdvertisement } = this.props;

  //   this.setState({ currentLatitude: latitude });
  //   this.setState({ currentLongitude: longitude });

  //   // region Wise Advertisement
  //   const advLiveLocationDetails = {
  //     latitude: this.state.currentLatitude,
  //     longitude: this.state.currentLongitude,
  //     search_type: this.state.search_type,
  //     address: this.state.address,
  //     city: this.state.city,
  //   };

  //   if (this.state.currentLatitude && this.state.currentLongitude) {
  //     onGetAdvLive(advLiveLocationDetails);
  //     setTimeout(() => {
  //       this.setState({ advLives: this.props.advLives });
  //     }, 500);
  //   }

  //   // near by labs
  //   if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
  //     const guest_id = uuidv4();
  //     const nearbyLabsLocationDetails = {
  //       latitude: this.state.currentLatitude,
  //       longitude: this.state.currentLongitude,
  //       search_type: this.state.search_type,
  //       address: this.state.address,
  //       city: this.state.city,
  //       km: this.state.km,
  //       LabType: this.state.LabType,
  //       guest_id: guest_id,
  //     };
  //     console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
  //     this.setState({ guest_id: guest_id });
  //     console.log("differ:", this.state.guest_id)
  //     console.log(window.location.href);
  //     // onGetNearbyLabs(nearbyLabsLocationDetails).then(() => {
  //     //   this.setState({ nearbyLabs: this.props.nearbyLabs });
  //     // }).catch((error) => {
  //     //   console.log("Error fetching nearby labs:", error);
  //     //   // Handle error if necessary
  //     // });
  //     if (this.state.currentLatitude && this.state.currentLongitude) {
  //       onGetNearbyLabs(nearbyLabsLocationDetails);
  //       setTimeout(() => {
  //         this.setState({ nearbyLabs: this.props.nearbyLabs });
  //       }, 500);
  //     }
  //   }

  //   // region Wise Advertisement 
  //   const regionWiseAdvLocationDetails = {
  //     latitude: this.state.currentLatitude,
  //     longitude: this.state.currentLongitude,
  //     search_type: this.state.search_type,
  //     address: this.state.address,
  //     city: this.state.city,
  //   };
  //   if (this.state.currentLatitude && this.state.currentLongitude) {
  //     onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
  //     setTimeout(() => {
  //       this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
  //     }, 500);
  //   }
  // }
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

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };


  render() {
    const { isDropdownOpen } = this.state;
    const isLargeScreen = window.innerWidth > 992;
    const sliderStyles = {
      maxWidth: '100%',
      maxHeight: '100%', // Adjust the height as per your requirements
      objectFit: 'cover',

    };
    const settings = {
      autoplay: true,
    };


    const { history } = this.props;
    const { patientProfile } = this.props;
    const { discountData, nearbyLabs, page, totalPage, regionWiseAdvertisement, } = this.state;
    const { onGetPatientProfile } = this.props;
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].city,
      });
    }

    const openModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
    };

    const closeModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "none";
    };

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
                              ? `/nearby-test/${this.props.match.params.uuid}`
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
                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/labs/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/labs/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Labs</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
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
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-test/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-test/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-profiles/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
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
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-packages/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
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
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-radiology/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
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
                          </Link>
                        </li>
                      ) : null}

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

                ) :
                this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient" ? (
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
                        {/* <Link to="/nearby-test" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.uuid}`
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
                ) :
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
                              this.props.match.params.uuid
                                ? `/labs/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/labs/`
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
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                ? `/nearby-packages/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                ? `/nearby-radiology/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                {isLargeScreen ? (

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

                ) : null}
              </div>
              {!isLargeScreen ? (

                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  style={{ left: '12px' }} // Set left position to 10 pixels
                  data-toggle="collapse"
                  onClick={this.openMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>

              ) : <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                data-toggle="collapse"
                onClick={this.openMenu}
                data-target="#topnav-menu-content"
              >
                <i className="fa fa-fw fa-bars" />
              </button>}
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
                    <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                  </Link>

                </div>
              )
                : this.state.user_type == "patient" ? (
                  <div className="dropdown d-lg-inline-block ms-4 mt-2">
                    <Link
                      // to={"/profile"}
                      to={
                        this.props.match.params.uuid
                          ? `/profile/${this.props.match.params.uuid}`
                          : `/profile`
                      }
                      className="dropdown-content me-2 text-light"
                    >
                      <i className="mdi mdi-account-box align-middle font-size-20" />{" "}
                      <span className="pt-4 font-size-12">
                        {this.state.patient_name.split(" ")[0]}                    </span>
                    </Link>{" "}
                    <button
                      className="btn header-items noti-icon right-bar-toggle"
                      style={{ position: 'relative' }}
                      onClick={this.toggleDropdown}
                    >
                      <i className="mdi mdi-menu-down align-middle me-1 font-size-20" />
                    </button>

                    {isDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '50px', // Adjust this value to set the distance between the button and the dropdown
                        right: '20px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        minWidth: '150px',
                        zIndex: 1,
                      }}>
                        <ul style={{ listStyleType: "none", padding: '2px' }}>
                          <li>
                          <a
                            href="#"
                            className="header-items noti-icon right-bar-toggle"
                            onClick={openModal}
                            style={{ textDecoration: 'none', color: 'blue', display: 'flex', alignItems: 'center' }}
                          >
                            <i className="mdi mdi-wallet align-middle me-1 font-size-20" style={{ color: 'blue' }} />
                            <span className=" font-size-12" style={{ marginLeft: '4px' }}>
                              My Wallet
                            </span>
                          </a>
                            <div  id="modal" className="modal mt-4" style={{ display: "none", maxWidth: "100%", width: "500px", minHeight: "200px", maxHeight: "80vh", margin: "0 auto"}} >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 auto' }}>Available Credit</h5>
                                  </div>
                                  <div className="modal-body" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
                                    Rs. {this.props.patientProfile.available_credit}
                                  </div>
                                  <div className="my-0" style={{ textAlign: 'center' }}>
                                    <span className="text-danger">
                                      <i className="mdi mdi-information"></i>{" "}
                                      You have received this money in case of a refund.
                                    </span><br />
                                    <span className="text-danger">
                                      Which you can use only for testing.
                                    </span>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={closeModal}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </li>

                          <li>
                            <Link to="/change-password" className="dropdown-content me-2 text-light">
                              <i className="mdi mdi-key align-middle me-1 font-size-20" style={{ color: 'blue' }} />{" "}
                              <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                                Password
                              </span>
                              <hr style={{ margin: '0 0' }} />
                            </Link>
                          </li>
                          <li>
                            <Link to="/contact-us" className="dropdown-content me-2 text-light">
                              <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" style={{ color: 'blue' }} />{" "}
                              <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                                Contact Us                  </span>
                              <hr style={{ margin: '0 0' }} />
                            </Link>
                          </li>
                          {/* <li>
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
                    this.props.carts.slice(-1).pop().cart_quantity + count}
                </Link>
              </li> */}
                          <li>
                            <Link to="/logout" className="dropdown-content text-light">
                              <i className="mdi mdi-power align-middle font-size-20" style={{ color: 'blue' }} />{" "}
                              <span className="pt-2 font-size-12" style={{ color: 'blue', marginLeft: '5px' }}>
                                Log Out
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
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
                      <i className="mdi mdi-headset align-middle me-1 font-size-20" />{" "}
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
        {isLargeScreen && isEmpty(this.props.advLives) && isEmpty(regionWiseAdvertisement) ? (
          <div className="page-content">
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Container fluid>
              <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
              <Row>
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
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                }}
                              >Search By Kilometers</Label>
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={(e) => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  style={{ fontSize: '14px' }} // Set input font size to 14 pixels
                                  placeholder="Search By Km..."

                                />
                              </div>
                            </div>
                          </Col>

                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
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
                              >
                                <option value="Main">Main Labs</option>
                                <option value="Collection">Collection Points</option>
                                <option value="Others">Both</option>
                              </Field>
                            </div>
                          </Col>
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType1"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                }}
                              >
                                Search By City
                              </Label>
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
                        </Row>

                      </Form>
                    )}
                  </Formik>
                </Row>

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

                {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") &&
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
                {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") &&
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
                {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") &&
                  nearbyLabs.map((nearbyLab, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card
                        onClick={() =>
                          history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )
                        }
                      >
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
            </Container>
          </div>
        ) : isLargeScreen && (!isEmpty(this.props.advLives) || !isEmpty(regionWiseAdvertisement)) ? (
          <div className="page-content">
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginLeft: "20px", marginRight: "20px" }}>
              <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
              <Col lg="9">
                <Row>
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
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                }}
                              >Search By Kilometers</Label>
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={(e) => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  style={{ fontSize: '14px' }} // Set input font size to 14 pixels
                                  placeholder="Search By Km..."

                                />
                              </div>
                            </div>
                          </Col>

                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
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
                              >
                                <option value="Main">Main Labs</option>
                                <option value="Collection">Collection Points</option>
                                <option value="Others">Both</option>
                              </Field>
                            </div>
                          </Col>
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType1"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                }}
                              >
                                Search By City
                              </Label>
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

                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") &&
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
                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") &&
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
                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          }
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
            </Row></div>
        ) : !isLargeScreen && isEmpty(this.props.advLives) && isEmpty(regionWiseAdvertisement) ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginTop: "80px", marginLeft: "20px", marginRight: "20px" }}>
              <Row className="mb-2">
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
                        <Col xs="4" sm="4" md="3" lg="3">
                          <div className="mb-3">
                            <Label
                              for="LabType"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              }}
                            >Search By Kilometers</Label>
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={(e) => this.onChangeKm(e)}
                                id="pac-input"
                                type="text"
                                className="form-control"
                                style={{ fontSize: '14px' }} // Set input font size to 14 pixels
                                placeholder="Search By Km..."

                              />
                            </div>
                          </div>
                        </Col>

                        <Col xs="4" sm="4" md="3" lg="3">
                          <div className="mb-3">
                            <Label
                              for="LabType2"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '7px' : '12px',
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
                            >
                              <option value="Main">Main Labs</option>
                              <option value="Collection">Collection Points</option>
                              <option value="Others">Both</option>
                            </Field>
                          </div>
                        </Col>
                        <Col xs="4" sm="4" md="3" lg="3">
                          <div className="mb-3">
                            <Label
                              for="LabType1"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                              }}
                            >
                              Search By City
                            </Label>
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
                      </Row>

                    </Form>
                  )}
                </Formik>
              </Row>

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

              {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") &&
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
              {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") &&
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
              {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      }
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
            </Row></div>
        ) : !isLargeScreen && (!isEmpty(this.props.advLives) || !isEmpty(regionWiseAdvertisement)) ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginTop: "70px" }}>
              <Slider {...settings}>
                {!isEmpty(this.props.advLives) &&
                  this.props.advLives.map((advLive, key) => (
                    <div key={"advLive-" + key}>
                      <Link
                        to={this.props.match.params.uuid
                          ? `/nearby-tests-discountedlh/${this.state.guest_id}/${this.props.match.params.uuid}`
                          : `/nearby-tests-discountedlh/${this.state.guest_id}`}
                        style={sliderStyles}
                      >
                        {advLive.poster ? (
                          advLive.poster.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img
                              src={process.env.REACT_APP_BACKENDURL + advLive.poster}
                              alt="Advertisement"
                              style={sliderStyles}
                              className="img-fluid mx-auto d-block" />
                          ) : (
                            <video
                              width="100%"
                              height="100%"
                              controls
                              autoPlay={this.state.autoplay}
                              loop
                              style={sliderStyles}
                              key={"video-" + key} // Add unique key for video element
                            >
                              <source
                                src={process.env.REACT_APP_BACKENDURL + advLive.poster}
                                type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )
                        ) : (
                          <div key={"no-media-" + key}>No media found.</div>
                        )}
                      </Link>
                    </div>
                  ))}

                {this.props.regionWiseAdvertisement.map(
                  (regionWiseAdvertisement, key) => (
                    <div key={"regionWiseAdvertisement-" + key}>
                      {regionWiseAdvertisement.nearby_adv_list.map(
                        (nearby_adv_list, index) => (
                          <Link
                            to={this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearby_adv_list.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearby_adv_list.account_id}`}
                            style={sliderStyles}
                            key={"image-" + index} // Add unique key for image element
                          >
                            <img
                              src={process.env.REACT_APP_BACKENDURL +
                                nearby_adv_list.poster}
                              alt="Lab Advertisement"
                              style={sliderStyles} />
                          </Link>
                        )
                      )}
                    </div>
                  )
                )}
              </Slider>
            </Row>
            <Row style={{ marginLeft: "20px", marginRight: "20px" }}>
              <Col lg="9">
                <Row>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      search_type: (this.state && this.state.search_type) ||
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
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                }}
                              >Search By Kilometers</Label>
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={(e) => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  style={{ fontSize: '14px' }} // Set input font size to 14 pixels
                                  placeholder="Search By Km..." />
                              </div>
                            </div>
                          </Col>

                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
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
                              >
                                <option value="Main">Main Labs</option>
                                <option value="Collection">Collection Points</option>
                                <option value="Others">Both</option>
                              </Field>
                            </div>
                          </Col>
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType1"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                }}
                              >
                                Search By City
                              </Label>
                              <Select
                                name="city"
                                component="Select"
                                onChange={this.onChangeCity}
                                className="defautSelectParent is-invalid"
                                options={cityList}
                                placeholder="City..." />
                            </div>
                          </Col>
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
                          onClick={() => history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                          )}
                        >
                          <CardBody>
                            <Link
                              to={this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`}
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
                                  style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }} />
                              </div>



                            </Link>

                            <div className="mt-4 text-center">
                              <h5 className="mb-3 text-truncate">
                                <Link
                                  to={this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`}
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
                                  <span className="text-danger">
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
                                  starSpacing="3px" />
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}

                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="9" key={"col" + key}>
                        <Card
                          onClick={() => history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )}
                        >
                          <CardBody>
                            <Link
                              to={this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`}
                            >
                              <div style={{
                                width: '200px',
                                height: '100px',
                              }}>
                                <img
                                  src={process.env.REACT_APP_BACKENDURL + nearbyLab.logo}
                                  alt="Lab Logo"
                                  className=" text-end"
                                  style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }} />
                              </div>
                            </Link>

                            <div className="mt-4 text-center">
                              <h5 className="mb-3 text-truncate">
                                <Link
                                  to={this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}`}
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
                                  <span className="text-danger">
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
                                  starSpacing="3px" />
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() => history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )}
                        >
                          <CardBody>
                            <Link
                              to={this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`}
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
                                  style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }} />
                              </div>



                            </Link>

                            <div className="mt-4 text-center">
                              <h5 className="mb-3 text-truncate">
                                <Link
                                  to={this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}`}
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
                                  <span className="text-danger">
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
                                  starSpacing="3px" />
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  {!isEmpty(nearbyLabs) && (this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() => history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )}
                        >
                          <CardBody>
                            <Link
                              to={this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`}
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
                                  style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }} />
                              </div>



                            </Link>

                            <div className="mt-4 text-center">
                              <h5 className="mb-3 text-truncate">
                                <Link
                                  to={this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}`}
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
                                  <span className="text-danger">
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
                                  starSpacing="3px" />
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
            </Row></div>
        ) : null}
      </React.Fragment>
    );
  }
}

NearbyLabs.propTypes = {
  patientProfile: PropTypes.array,
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
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onGetPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,
  onGetPatientProfile: PropTypes.func,

};

const mapStateToProps = state => ({
  nearbyLabs: state.LabMarket.nearbyLabs,
  regionWiseAdvertisement: state.LabMarket.regionWiseAdvertisement,
  advLives: state.LabMarket.advLives,
  territoriesList: state.territoriesList.territoriesList,
  patientProfile: state.LabMarket.patientProfile,


});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: locationDetails => dispatch(getNearbyLabs(locationDetails)),
  onGetRegionWiseAdvertisement: locationDetails => dispatch(getRegionWiseAdvertisement(locationDetails)),
  onGetAdvLive: locationDetails => dispatch(getAdvLive(locationDetails)),
  offeredTestsList: guest_id => dispatch(offeredTestsList(guest_id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetPatientProfile: id => dispatch(getPatientProfile(id)),

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
