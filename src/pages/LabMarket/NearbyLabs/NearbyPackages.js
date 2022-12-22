import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
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
import { getNearbyPackages, getPackages } from "store/packagemarket/actions";
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
      ratingvalues: [],
      nearbyPackages: [],
      Packages: [],
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
    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });
    const { Packages, onGetPackages } = this.props;
    if (Packages && !Packages.length) {
      console.log(onGetPackages(this.state.user_id));
    }
    const { onGetNearbyPackages } = this.props;

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
        onGetNearbyPackages(data);

        setTimeout(() => {
          this.setState({ nearbyPackages: this.props.nearbyPackages });
        }, 1000);
      }
    }, 1000);
  }
  openDescriptionModal = (e, arg) => {
    this.setState({
      DescriptionModal: true,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
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
    const { nearbyPackages } = this.props;
    if (
      isEmpty(prevProps.nearbyPackages) &&
      !isEmpty(nearbyPackages) &&
      size(nearbyPackages) !== size(prevProps.nearbyPackages)
    ) {
      this.setState({ nearbyPackages });
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
    this.setState({ nearbyPackages: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyPackages: productsData.filter(
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
      nearbyPackages: productsData.filter(
        nearbyPackage => nearbyPackage.rating >= value
      ),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyPackages: productsData.filter(
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
    this.setState({ nearbyPackages: filteredProducts });
  };

  handlePageClick = page => {
    this.setState({ page });
  };

  handleBlur = () => {
    // Calling API when focus is out of test name and setting nearby tests array
    const { onGetNearbyPackages } = this.props;

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

    onGetNearbyPackages(data);

    setTimeout(() => {
      this.setState({ nearbyPackages: this.props.nearbyPackages });
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
        const { onGetNearbyPackages } = this.props;

        var data = {
          latitude: "",
          longitude: "",
          search_type: this.state.search_type,
          address: e.target.value,
          city: this.state.city,
          test_name: this.state.test_name,
        };

        onGetNearbyPackages(data);

        setTimeout(() => {
          this.setState({ nearbyPackages: this.props.nearbyPackages });
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

      const { onGetNearbyPackages } = this.props;

      var data = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: e.target.value,
        address: this.state.address,
        city: this.state.city,
        test_name: this.state.test_name,
      };

      onGetNearbyPackages(data);

      setTimeout(() => {
        this.setState({ nearbyPackages: this.props.nearbyPackages });
      }, 1000);
    }
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyPackages } = this.props;

    // ------------- Call API on city name START -------------
    var data = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
      test_name: this.state.test_name,
    };

    onGetNearbyPackages(data);

    setTimeout(() => {
      this.setState({ nearbyPackages: this.props.nearbyPackages });
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
      this.props.history.push("/login");
    } else {
      onAddToCart(cart, this.state.user_id);
    }

    setTimeout(() => {
      this.setState({ success: this.props.success });
      this.setState({ error: this.props.error });
    }, 2000);
  };

  render() {
    const { page, totalPage } = this.state;
    const { Packages } = this.props;

    const cityList = [];
    for (let i = 0; i < this.props.Packages.length; i++) {
      cityList.push({
        label: this.props.Packages[i].name,
        value: this.props.Packages[i].id,
      });
    }
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Search by Packages | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Search byPackages" />
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
                                  Packages.test_name,
                                value:
                                  Packages.test_name,
                              }}
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
                {!isEmpty(this.props.nearbyPackages) &&
                  this.props.nearbyPackages.map((nearbyPackage, key) => (
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
                              {/* <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Lab:{" "}
                                {nearbyPackage.lab_name}
                              </span> */}
                            </div>
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

                {isEmpty(this.props.nearbyPackages) && (
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
  nearbyPackages: PropTypes.array,
  onGetNearbyPackages: PropTypes.func,
  onAddToCart: PropTypes.func,
  onGetPackages: PropTypes.func,
  Packages: PropTypes.array,
  success: PropTypes.any,
  className: PropTypes.any,
  error: PropTypes.any,
  PackageMarket: PropTypes.any,
};

const mapStateToProps = ({ PackageMarket, carts }) => ({
  nearbyPackages: PackageMarket.nearbyPackages,
  Packages: PackageMarket.Packages,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyPackages: data => dispatch(getNearbyPackages(data)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetPackages: () => dispatch(getPackages()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyPackage));
