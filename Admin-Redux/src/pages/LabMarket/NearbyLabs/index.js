import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";
import classnames from "classnames";
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
import { getNearbyLabs } from "store/labmarket/actions";
import { any } from "prop-types";

let optionGroup = [
  {
    options: [
      { label: "Ahmadpur East", value: "Ahmadpur East" },
      { label: "Ahmed Nager Chatha", value: "Ahmed Nager Chatha" },
      { label: "Ali Khan Abad", value: "Ali Khan Abad" },
      { label: "Alipur", value: "Alipur" },
      { label: "Arifwala", value: "Arifwala" },
      { label: "Attock", value: "Attock" },
      { label: "Bhera", value: "Bhera" },
      { label: "Bhalwal", value: "Bhalwal" },
      { label: "Bahawalnagar", value: "Bahawalnagar" },
      { label: "Bahawalpur", value: "Bahawalpur" },
      { label: "Bhakkar", value: "Bhakkar" },
      { label: "Burewala", value: "Burewala" },
      { label: "Chenab Nagar", value: "Chenab Nagar" },
      { label: "Chillianwala", value: "Chillianwala" },
      { label: "Choa Saidanshah", value: "Choa Saidanshah" },
      { label: "Chakwal", value: "Chakwal" },
      { label: "Chichawatni", value: "Chichawatni" },
      { label: "Chiniot", value: "Chiniot" },
      { label: "Chishtian", value: "Chishtian" },
      { label: "Chunian", value: "Chunian" },
      { label: "Dajkot", value: "Dajkot" },
      { label: "Daska", value: "Daska" },
      { label: "Darya Khan", value: "Darya Khan" },
      { label: "Dera Ghazi Khan", value: "Dera Ghazi Khan" },
      { label: "Dhaular", value: "Dhaular" },
      { label: "Dina", value: "Dina" },
      { label: "Dinga", value: "Dinga" },
      { label: "Dhudial Chakwal", value: "Dhudial Chakwal" },
      { label: "Dipalpur", value: "Dipalpur" },
      { label: "Faisalabad", value: "Faisalabad" },
      { label: "Fateh Jang", value: "Fateh Jang" },
      { label: "Ghakhar Mandi", value: "Ghakhar Mandi" },
      { label: "Gojra", value: "Gojra" },
      { label: "Gujranwala", value: "Gujranwala" },
      { label: "Gujrat", value: "Gujrat" },
      { label: "Gujar Khan", value: "Gujar Khan" },
      { label: "Harappa", value: "Harappa" },
      { label: "Hafizabad", value: "Hafizabad" },
      { label: "Haroonabad", value: "Haroonabad" },
      { label: "Hasilpur", value: "Hasilpur" },
      { label: "Haveli Lakha", value: "Haveli Lakha" },
      { label: "Jampur", value: "Jampur" },
      { label: "Jaranwala", value: "Jaranwala" },
      { label: "Jhang", value: "Jhang" },
      { label: "Jhelum", value: "Jhelum" },
      { label: "Kallar Syedan", value: "Kallar Syedan" },
      { label: "Kalabagh", value: "Kalabagh" },
      { label: "Karor Lal Esan", value: "Karor Lal Esan" },
      { label: "Kasur", value: "Kasur" },
      { label: "Kamalia", value: "Kamalia" },
      { label: "Kāmoke", value: "Kāmoke" },
      { label: "Khanewal", value: "Khanewal" },
      { label: "Khanpur", value: "Khanpur" },
      { label: "Khanqah Sharif", value: "Khanqah Sharif" },
      { label: "Kharian", value: "Kharian" },
      { label: "Khushab", value: "Khushab" },
      { label: "Kot Adu", value: "Kot Adu" },
      { label: "Jauharabad", value: "Jauharabad" },
      { label: "Lahore", value: "Lahore" },
      { label: "Islamabad", value: "Islamabad" },
      { label: "Lalamusa", value: "Lalamusa" },
      { label: "Layyah", value: "Layyah" },
      { label: "Lawa Chakwal", value: "Lawa Chakwal" },
      { label: "Liaquat Pur", value: "Liaquat Pur" },
      { label: "Lodhran", value: "Lodhran" },
      { label: "Malakwal", value: "Malakwal" },
      { label: "Mamoori", value: "Mamoori" },
      { label: "Mailsi", value: "Mailsi" },
      { label: "Mandi Bahauddin", value: "Mandi Bahauddin" },
      { label: "Mian Channu", value: "Mian Channu" },
      { label: "Mianwali", value: "Mianwali" },
      { label: "Miani", value: "Miani" },
      { label: "Multan", value: "Multan" },
      { label: "Murree", value: "Murree" },
      { label: "Muridke", value: "Muridke" },
      { label: "Mianwali Bangla", value: "Mianwali Bangla" },
      { label: "Muzaffargarh", value: "Muzaffargarh" },
      { label: "Narowal", value: "Narowal" },
      { label: "Nankana Sahib", value: "Nankana Sahib" },
      { label: "Okara", value: "Okara" },
      { label: "Renala Khurd", value: "Renala Khurd" },
      { label: "Pakpattan", value: "Pakpattan" },
      { label: "Pattoki", value: "Pattoki" },
      { label: "Pindi Bhattian", value: "Pindi Bhattian" },
      { label: "Pind Dadan Khan", value: "Pind Dadan Khan" },
      { label: "Pir Mahal", value: "Pir Mahal" },
      { label: "Qaimpur", value: "Qaimpur" },
      { label: "Qila Didar Singh", value: "Qila Didar Singh" },
      { label: "Raiwind", value: "Raiwind" },
      { label: "Rajanpur", value: "Rajanpur" },
      { label: "Rahim Yar Khan", value: "Rahim Yar Khan" },
      { label: "Rawalpindi", value: "Rawalpindi" },
      { label: "Sadiqabad", value: "Sadiqabad" },
      { label: "Sagri", value: "Sagri" },
      { label: "Sahiwal", value: "Sahiwal" },
      { label: "Sambrial", value: "Sambrial" },
      { label: "Samundri", value: "Samundri" },
      { label: "Sangla Hill", value: "Sangla Hill" },
      { label: "Sarai Alamgir", value: "Sarai Alamgir" },
      { label: "Sargodha", value: "Sargodha" },
      { label: "Shakargarh", value: "Shakargarh" },
      { label: "Sheikhupura", value: "Sheikhupura" },
      { label: "Shujaabad", value: "Shujaabad" },
      { label: "Sialkot", value: "Sialkot" },
      { label: "Sohawa", value: "Sohawa" },
      { label: "Soianwala", value: "Soianwala" },
      { label: "Siranwali", value: "Siranwali" },
      { label: "Tandlianwala", value: "Tandlianwala" },
      { label: "Talagang", value: "Talagang" },
      { label: "Taxila", value: "Taxila" },
      { label: "Toba Tek Singh", value: "Toba Tek Singh" },
      { label: "Vehari", value: "Vehari" },
      { label: "Wah Cantonment", value: "Wah Cantonment" },
      { label: "Wazirabad", value: "Wazirabad" },
      { label: "Yazman", value: "Yazman" },
      { label: "Zafarwal", value: "Zafarwal" },
    ],
  },
];

// To remove thick blue border effect
const style = {
  control: (base, state) => ({
    ...base,
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 1,
    "&:hover": {
      border: state.isFocused ? 0 : 1,
    },
  }),
};

// To give error border effect on single value select
const errorStyle = {
  control: base => ({
    ...base,
    borderColor: "#f46a6a",
  }),
};

class NearbyLabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingvalues: [],
      nearbyLabs: [],
      apiURL: process.env.REACT_APP_BACKENDURL,
      activeTab: "1",
      address: "",
      type: "",
      city: "",
      location: "",
      cityError: "",
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
    const { nearbyLabs, onGetNearbyLabs } = this.props;
    setTimeout(() => {
      onGetNearbyLabs(this.state.address);
    }, 1000);
    this.setState({ nearbyLabs });
    // this.setState({ discountData });
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
      filteredProducts = productsData.filter(nearbyLab => nearbyLab.offer < 10);
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

  handleChange = e => {
    var cityBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(33.684422, 73.047882)
    );

    const options = {
      bounds: cityBounds,
      types: ["establishment"],
      componentRestrictions: { country: "pk" },
    };

    var searchBox = new window.google.maps.places.SearchBox(e.target, options);

    searchBox.addListener("places_changed", () => {
      setTimeout(() => {
        const { onGetNearbyLabs } = this.props;
        onGetNearbyLabs(e.target.value);
        setTimeout(() => {
          this.setState({ nearbyLabs: this.props.nearbyLabs });
        }, 3000);
      }, 1000);
    });
  };

  handleCityError = () => {
    if (!this.state.city) {
      this.setState({ cityError: "Please select city" });
    }
  };

  handleSelectGroup = selectedGroup => {
    this.setState({ city: selectedGroup.value });
    this.setState({ cityError: "" });
  };

  render() {
    const { history } = this.props;
    const { discountData, nearbyLabs, page, totalPage } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Nearby Labs | Ilaaj4u - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
            <Row>
              <Col lg="3">
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

                    <div className="mt-4 pt-3">
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
              </Col>

              <Col lg="9">
                <Row className="mb-3">
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      type: (this.state && this.state.type) || "",
                      city: (this.state && this.state.city) || "",
                      location: (this.state && this.state.location) || "",
                    }}
                    validationSchema={Yup.object().shape({
                      city: Yup.string().when("type", {
                        is: val => val === "Custom Address",
                        then: Yup.string().required("Please enter your City"),
                      }),
                      location: Yup.string().when("type", {
                        is: val => val === "Custom Address",
                        then: Yup.string().required(
                          "Please enter your Location"
                        ),
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
                                name="type"
                                component="select"
                                onChange={e =>
                                  this.setState({
                                    type: e.target.value,
                                  })
                                }
                                value={this.state.type}
                                className="form-select"
                              >
                                <option value="Current Location">
                                  Current Location
                                </option>
                                <option value="Registered Address">
                                  Registered Address
                                </option>
                                <option value="Custom Address">
                                  Custom Address
                                </option>
                              </Field>
                            </div>
                          </Col>

                          {/* Custom Address field */}
                          <Col lg="3">
                            {this.state.type === "Custom Address" && (
                              <div className="mb-3">
                                <Select
                                  styles={
                                    this.state.cityError ? errorStyle : style
                                  }
                                  name="city "
                                  component="Select"
                                  onChange={this.handleSelectGroup}
                                  className="defautSelectParent is-invalid"
                                  options={optionGroup}
                                  placeholder="Select City..."
                                />
                                {this.state.cityError && (
                                  <div
                                    style={{
                                      marginTop: "0.25rem",
                                      fontSize: "80%",
                                      color: "#f46a6a",
                                    }}
                                  >
                                    {this.state.cityError}
                                  </div>
                                )}
                              </div>
                            )}
                          </Col>

                          {/* Custom Address field */}
                          <Col lg="3">
                            {this.state.type === "Custom Address" && (
                              <div className="mb-3">
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={e => this.handleChange(e)}
                                  onFocus={this.handleCityError}
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
                <Row>
                  {!isEmpty(nearbyLabs) &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() =>
                            history.push(`nearby-lab-detail/${nearbyLab.id}`)
                          }
                        >
                          <CardBody>
                            <Link to="#">
                              <div className="product-img position-relative">
                                <img
                                  src={this.state.apiURL + nearbyLab.logo}
                                  alt="Lab Logo"
                                  style={{
                                    width: "200px",
                                    height: "200px",
                                    objectFit: "cover",
                                  }}
                                  className="img-fluid mx-auto d-block"
                                />
                              </div>
                            </Link>

                            <div className="mt-4 text-center">
                              <h5 className="mb-3 text-truncate">
                                <Link
                                  to={
                                    "/ecommerce-product-details/" + nearbyLab.id
                                  }
                                  className="text-dark"
                                >
                                  {nearbyLab.name}{" "}
                                </Link>
                              </h5>

                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-google-maps"></i>{" "}
                                  {nearbyLab.address}
                                </span>
                              </div>

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
                                  <i className="bx bx-phone"></i>{" "}
                                  {nearbyLab.landline}
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                </Row>

                <Row>
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
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabs.propTypes = {
  match: PropTypes.object,
  nearbyLabs: PropTypes.array,
  history: any,
  onGetNearbyLabs: PropTypes.func,
};

const mapStateToProps = state => ({
  nearbyLabs: state.ecommerce.nearbyLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: address =>
    dispatch(getNearbyLabs(address, ownProps.match.params.id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyLabs));
