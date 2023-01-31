import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
// import ScrollButton from "components/Common/Scrollbutton";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  ModalBody,
  ModalHeader,
  Modal,
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
import { getAdvertisementLives } from "store/advertisement-live/actions";
import { getNearbyTests } from "store/testmarket/actions";
import { addToCart } from "store/actions";
import { any } from "prop-types";
import "./nearbylabs.scss";

import { CITIES } from "helpers/global_variables_helper";

class NearbyTests extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      ratingvalues: [],
      nearbyTests: [],
      advertisementLives: [],
      advertisementLive: "",
      activeTab: "1",
      address: "",
      test_name: "",
      test_type: "",
      search_type: "Current Location",
      city: "",
      latitude: "",
      longitude: "",
      currentLatitude: "",
      currentLongitude: "",
      location: "",
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
  }

  componentDidMount() {
    const { advertisementLives, onGetAdvertisementLives } = this.props;
    onGetAdvertisementLives(this.state.user_id);
    this.setState({ advertisementLives });

    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });

    const { onGetNearbyTests } = this.props;

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
      };

      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetNearbyTests(data);

        setTimeout(() => {
          this.setState({ nearbyTests: this.props.nearbyTests });
        }, 1000);
      }
    }, 1000);
  }
  openDescriptionModal = (e, arg) => {
    this.setState({
      DescriptionModal: true,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
      test_name:arg.test_name,
    });
  };

  toggleDescriptionModal = () => {
    this.setState(prevState => ({
      DescriptionModal: !prevState.DescriptionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { nearbyTests } = this.props;
    if (
      isEmpty(prevProps.nearbyTests) &&
      !isEmpty(nearbyTests) &&
      size(nearbyTests) !== size(prevProps.nearbyTests)
    ) {
      this.setState({ nearbyTests });
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
        nearbyTest => nearbyTest.offer < 10
      );
    } else if (discount.length > 0) {
      filteredProducts = productsData.filter(
        nearbyTest => nearbyTest.offer >= Math.min(...discount)
      );
    }
    this.setState({ nearbyTests: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyTests: productsData.filter(
        nearbyTest =>
          nearbyTest.newPrice >= value[0] && nearbyTest.newPrice <= value[1]
      ),
    });
  };

  /*
  on change rating checkbox method
  */
  onChangeRating = value => {
    this.setState({
      nearbyTests: productsData.filter(
        nearbyTest => nearbyTest.rating >= value
      ),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyTests: productsData.filter(
        nearbyTest => nearbyTest.rating === value
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
          nearbyTest => nearbyTest.rating >= minValue
        );

        this.setState({ ratingvalues: modifiedData });
      }
    } else {
      filteredProducts = productsData;
    }
    this.setState({ nearbyTests: filteredProducts });
  };

  handlePageClick = page => {
    this.setState({ page });
  };

  handleBlur = () => {
    // Calling API when focus is out of test name and setting nearby tests array
    const { onGetNearbyTests } = this.props;

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
      };

    onGetNearbyTests(data);

    setTimeout(() => {
      this.setState({ nearbyTests: this.props.nearbyTests });
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
        const { onGetNearbyTests } = this.props;

        var data = {
          latitude: "",
          longitude: "",
          search_type: this.state.search_type,
          address: e.target.value,
          city: this.state.city,
          test_name: this.state.test_name,
        };

        onGetNearbyTests(data);

        setTimeout(() => {
          this.setState({ nearbyTests: this.props.nearbyTests });
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

      const { onGetNearbyTests } = this.props;

      var data = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: e.target.value,
        address: this.state.address,
        city: this.state.city,
        test_name: this.state.test_name,
      };

      onGetNearbyTests(data);

      setTimeout(() => {
        this.setState({ nearbyTests: this.props.nearbyTests });
      }, 1000);
    }
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyTests } = this.props;

    // ------------- Call API on city name START -------------
    var data = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
      test_name: this.state.test_name,
    };

    onGetNearbyTests(data);

    setTimeout(() => {
      this.setState({ nearbyTests: this.props.nearbyTests });
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
      cart.guest_id= this.props.match.params.guest_id
      onAddToCart(cart, cart.guest_id);

     console.log("uuid:", cart.guest_id, this.props.match.params.guest_id   ) 
    } else {
      onAddToCart(cart, this.state.user_id);
    }

    setTimeout(() => {
      this.setState({ success: this.props.success });
      this.setState({ error: this.props.error });
    }, 2000);
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
    handlePageClick = page => {
    this.setState({ page });
  };
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    const { page, totalPage } = this.state;

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
        <div className="page-content">
          <MetaTags>
            <title>Search by Tests | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Lab Marketplace"
              breadcrumbItem="Search by Tests"
            />
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
                            <div className="col-md-6">
                            <Label className="form-label">{this.state.test_name}</Label>
                            <br></br>
                              <Label className="form-label">English</Label>
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
                              <Label className="form-label">Urdu</Label>
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
                          <div className="mb-3">
                            <Input
                              type="text"
                              className="form-control"
                              name="test_name"
                              placeholder="Search Test..."
                              onChange={e =>
                                this.setState({
                                  test_name: e.target.value,
                                })
                              }
                              onBlur={this.handleBlur}
                              value={this.state.test_name}
                            />
                          </div>
                        </Col>

                        <Col lg="3">
                          {/* {this.state.test_name && ( */}
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
                          {/* )} */}
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
                {!isEmpty(this.props.nearbyTests) &&
                  this.props.nearbyTests.map((nearbyTest, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                "/media/" +
                                nearbyTest.lab_logo
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
                              {nearbyTest.test_name}
                            </h5>
                            {/* <div className="mt-3 text-center"> */}
                              <Link
                                to="#"
                                onClick={e =>
                                  this.openDescriptionModal(e, nearbyTest)
                                }
                              >
                                <span>Test Description</span>
                              </Link>
                            {/* </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                Rs {nearbyTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              </span>
                            </div>
                            {nearbyTest.discount>=0.01 && (
                              <div className="my-0">
                              <span className="text-danger" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount Lab: {(nearbyTest.discount*100).toFixed()} % 
                              </span>
                              
                            </div>
                            )}
                            {nearbyTest.all_discount_by_labhazir + nearbyTest.discount_by_labhazir >=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount LabHazir: {((nearbyTest.all_discount_by_labhazir*100)+(nearbyTest.discount_by_labhazir*100)).toFixed()} % 
                              </span>
                              
                            </div>
                            )}
                               {/* {nearbyTest.discount_by_labhazir>=0.01 && (
                              <div className="my-0">
                              <span className="text-success" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount Lab: {(nearbyTest.discount_by_labhazir*100).toFixed()} % 
                              </span>
                              
                            </div>
                            )} */}
                            <div className="my-0">
                              {" "}
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyTest.lab_account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyTest.lab_account_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  {nearbyTest.lab_name}{" "}
                                  
                                </span>
                              </Link>
                              {/* <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Lab:{" "}
                                {nearbyTest.lab_name}
                              </span> */}
                            </div>
                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {nearbyTest.discount_by_labhazir} % Discount By Labhazir
                              </span>
                            </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {nearbyTest.duration_required}{" "}
                                {nearbyTest.duration_type}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {nearbyTest.is_home_sampling_available}
                              </span>
                            </div>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(nearbyTest)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.nearbyTests) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h4 className="text-uppercase">Loading.....</h4>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* ROW FOR ADVERTISEMENT */}
                {!isEmpty(this.props.advertisementLives) &&
                  this.props.advertisementLives.map(
                    (advertisementLive, key) => (
                      <Col xl="3" sm="12" key={"_col_" + key}>
                        <Card>
                          <CardBody>
                            <div className="mb-3 mt-3">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  advertisementLive.poster
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
                      </Col>
                    )
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

NearbyTests.propTypes = {
  history: any,
  location: any,
  match: PropTypes.object,
  nearbyTests: PropTypes.array,
  advertisementLives: PropTypes.array,
  onGetAdvertisementLives: PropTypes.func,
  onGetNearbyTests: PropTypes.func,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
  className: PropTypes.any,
  TestMarket: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ TestMarket, carts, advertisementLives }) => ({
  nearbyTests: TestMarket.nearbyTests,
  success: carts.success,
  error: carts.error,
  advertisementLives: advertisementLives.advertisementLives,
});
// const mapStateToProps = ({ nearbyTests }) => ({
//   nearbyTests: nearbyTests.nearbyTests,
// });

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyTests: data => dispatch(getNearbyTests(data)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetAdvertisementLives: id => dispatch(getAdvertisementLives(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyTests));