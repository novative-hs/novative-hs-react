import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";


import classnames from "classnames";

import { isEmpty, map, size } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  getHomeSampledTests,
  getCheckoutItems,
  addCheckoutData,
} from "store/checkout/actions";
import {
  getTerritoriesList
  } from "store/territories-list/actions";


import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeSampledTests: [],
      checkoutItems: [],
      territoriesList: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      patient_name: "",
      patient_age: "",
      patient_gender: "Male",
      relationsip_with_patient: "Self",
      patient_address: "",
      city_id: "",
      // patient_district: "",
      appointment_requested_at: "",
      is_home_sampling_availed: "Yes",
      payment_method: "Card",
      card_number: "",
      name_on_card: "",
      expiry_date: "",
      cvv_code: "",
      isDisabled: true,
      isRequiredFilled: true,
      checkoutData: "",
      checkedoutData: "",
      activeTab: "1",
      selectedGroup: null,
      checkoutSuccess: "",
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup });
  };

  handleHomeSamplingChange = e => {
    this.setState({ is_home_sampling_availed: e.target.value });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    setTimeout(() => {
      onGetCheckoutItems(this.state.user_id, e.target.value);
    }, 1000);

    setTimeout(() => {
      this.setState({ checkoutItems: this.props.checkoutItems });
    }, 2000);
  };

  handleProceedClick = () => {
    const canProceed = this.checkForValidations();
    if (canProceed) {
      this.setState({
        checkoutData: {
          uuid: this.props.match.params.uuid
            ? this.props.match.params.uuid
            : "",
          patient_name: this.state.patient_name,
          patient_age: this.state.patient_age,
          patient_gender: this.state.patient_gender,
          relationsip_with_patient: this.state.relationsip_with_patient,
          patient_address: this.state.patient_address,
          city_id: this.state.city_id,
          // patient_district: this.state.patient_district,
          appointment_requested_at: this.state.appointment_requested_at,
          is_home_sampling_availed: this.state.is_home_sampling_availed,
          payment_method: this.state.payment_method,
          card_number: this.state.card_number,
          name_on_card: this.state.name_on_card,
          expiry_date: this.state.expiry_date,
          cvv_code: this.state.cvv_code,
        },
      });

      // API call to get the checkout items
      const { onAddCheckoutData } = this.props;
      setTimeout(() => {
        onAddCheckoutData(this.state.checkoutData, this.state.user_id);
      }, 2000);
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.setState({
            checkoutSuccess:
              "Order has been placed successfully! Thank you for choosing Labhazir.",
          });
        }
      }, 1000);

      setTimeout(() => {
        this.setState({ checkedoutData: this.props.checkedoutData });

        // If checkout operation is successful.
        if (this.props.checkedoutData) {
          this.props.history.push("/nearby-labs");
        }
      }, 4000);
    }
  };

  checkForValidations = () => {
    // Check if patient's name, age and appointment Booked for is filled
    if (
      this.state.patient_name &&
      this.state.patient_address &&
      this.state.city_id &&
      // this.state.patient_district &&
      this.state.patient_age &&
      this.state.appointment_requested_at
    ) {
      // Check if patient's card information is filled in case of payment method is Card
      if (this.state.payment_method == "Card") {
        if (
          this.state.card_number &&
          this.state.name_on_card &&
          this.state.expiry_date &&
          this.state.cvv_code
        ) {
          this.setState({ isRequiredFilled: true });
          return true;
        } else {
          this.setState({ isRequiredFilled: false });
          return false;
        }
      }
      // If patient's payment method is not Card (Cash) then set isRequiredFilled to true
      else {
        this.setState({ isRequiredFilled: true });
        return true;
      }
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };

  componentDidMount() {
    // API call to get the home sampled tests
    const { onGetHomeSampledTests } = this.props;
    onGetHomeSampledTests(this.state.user_id);
    this.setState({ homeSampledTests: this.props.homeSampledTests });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    onGetCheckoutItems(this.state.user_id, "Yes");
    this.setState({ checkoutItems: this.props.checkoutItems });

    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
  }
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { homeSampledTests } = this.props;
    if (
      isEmpty(prevProps.homeSampledTests) &&
      !isEmpty(homeSampledTests) &&
      size(homeSampledTests) !== size(prevProps.homeSampledTests)
    ) {
      this.setState({ homeSampledTests });
    }

    const { checkoutItems } = this.props;
    if (
      isEmpty(prevProps.checkoutItems) &&
      !isEmpty(checkoutItems) &&
      size(checkoutItems) !== size(prevProps.checkoutItems)
    ) {
      this.setState({ checkoutItems });
    }

    // Timeout functions to hide alerts after sometime......
    // setTimeout(() => {
    //   this.setState({ isRequiredFilled: true });
    // }, 10000);
  }

  render() {

    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    // let total =  0;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Checkout | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Test" breadcrumbItem="Checkout" />
            {this.state.checkoutSuccess && (
              <Alert color="success" className="col-md-8">
                {this.state.checkoutSuccess}
              </Alert>
            )}
            <div className="checkout-tabs">
              <Row>
                <Col lg="2" sm="3">
                  <Nav className="flex-column" pills>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "1",
                        })}
                        onClick={() => {
                          this.toggleTab("1");
                        }}
                      >
                        <i className="bx bx-user d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">Patient Info</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "2",
                        })}
                        onClick={() => {
                          this.toggleTab("2");
                        }}
                      >
                        <i className="bx bx-home d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">Home Sample</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "3",
                        })}
                        onClick={() => {
                          this.toggleTab("3");
                        }}
                      >
                        <i className="bx bx-money d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">Payment Info</p>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "4",
                        })}
                        onClick={() => {
                          this.toggleTab("4");
                        }}
                      >
                        <i className="bx bx-badge-check d-block check-nav-icon mt-4 mb-2" />
                        <p className="font-weight-bold mb-4">Confirmation</p>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col lg="10" sm="9">
                  {!this.state.isRequiredFilled ? (
                    <Alert color="danger" className="col-md-5">
                      Please fill the required fields.
                    </Alert>
                  ) : null}

                  <Card>
                    <CardBody>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <div>
                            <CardTitle className="h4">
                              Patient information
                            </CardTitle>
                            <p className="card-title-desc">
                              Fill all the information for the patient below
                            </p>
                            <Form>
                            <FormGroup className="mb-4" row>
                                <Label md="2" className="col-form-label">
                                  Testing For
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <select
                                    className="form-control select2"
                                    title="Gender"
                                    name="relationsip_with_patient"
                                    onChange={e =>
                                      this.setState({
                                        relationsip_with_patient:
                                          e.target.value,
                                      })
                                    }
                                  >
                                    <option value="Self">Self</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Father">Father</option>
                                    <option value="Sister">Sister</option>
                                    <option value="Brother">Brother</option>
                                    <option value="Daughter">Daughter</option>
                                    <option value="Son">Son</option>
                                    <option value="Grand Mother">
                                      Grand Mother
                                    </option>
                                    <option value="Grand Father">
                                      Grand Father
                                    </option>
                                    <option value="Others">Others</option>
                                  </select>
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="patient-name"
                                  md="2"
                                  className="col-form-label"
                                >
                                  Patient Name
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="patient_name"
                                    placeholder="Enter your name"
                                    onChange={e =>
                                      this.setState({
                                        patient_name: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup className="mb-4" row>
                                <Label md="2" className="col-form-label">
                                Patient Age
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md={10}>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="patient_age"
                                    min="0"
                                    max="150"
                                    placeholder="Enter your age"
                                    onChange={e =>
                                      this.setState({
                                        patient_age: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup className="mb-4" row>
                                <Label md="2" className="col-form-label">
                                Patient Gender
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <select
                                    className="form-control select2"
                                    title="Gender"
                                    name="patient_gender"
                                    onChange={e =>
                                      this.setState({
                                        patient_gender: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                  </select>
                                </Col>
                              </FormGroup>

                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="patient-name"
                                  md="2"
                                  className="col-form-label"
                                >
                                  Address
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="patient_address"
                                    placeholder="Enter your complete address"
                                    onChange={e =>
                                      this.setState({
                                        patient_address: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>

                              {/* <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="patient-name"
                                  md="2"
                                  className="col-form-label"
                                >
                                  City
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                <Select
                                name="city_id"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    city_id: selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (errors.city_id && touched.city_id
                                    ? " is-invalid"
                                    : "")
                                }
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderColor:
                                      errors.city_id && touched.city_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                  }),
                                }}
                                options={
                                  cityList
                                }
                                defaultValue={{
                                  label:
                                  this.state.city,
                                  value:
                                  this.state.id,                                       
                                }}
                                placeholder="Select City..."
                              />

                                </Col>
                              </FormGroup> */}

                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="patient-name"
                                  md="2"
                                  className="col-form-label"
                                >
                                  city
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Select
                                    name="city_id"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        city_id: selectedGroup.value,
                                      })
                                    }
                                    className="defautSelectParent"
                                    options={
                                      cityList
                                    }
                                    defaultValue={{
                                      label:
                                      this.state.city,
                                      value:
                                      this.state.id,                                       
                                    }}
                                    placeholder="Select City..."
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup className="mb-4" row>
                                <Label md="12" className="col-form-label">
                                  Please select suitable date and time for
                                  appointment?
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md={12}>
                                  <input
                                    name="appointment_requested_at"
                                    type="datetime-local"
                                    min={new Date(
                                      new Date().toString().split("GMT")[0] +
                                        " UTC"
                                    )
                                      .toISOString()
                                      .slice(0, -8)}
                                    className="form-control"
                                    onChange={e =>
                                      this.setState({
                                        appointment_requested_at:
                                          e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>
                            </Form>
                          </div>
                        </TabPane>
                         <TabPane
                          tabId="2"
                          id="v-pills-payment"
                          role="tabpanel"
                          aria-labelledby="v-pills-payment-tab"
                        >

                          <div>
                            <CardTitle className="h4">
                              Home Sampled Tests
                            </CardTitle>
                            <p className="card-title-desc">
                              Please choose whether you want to avail home
                              sampling services for the following tests
                            </p>
                            <FormGroup className="mb-4">
                              <select
                                className="form-control select2"
                                title="home-sampling"
                                name="is_home_sampling_availed"
                                onChange={this.handleHomeSamplingChange}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </FormGroup>

                            <Table >
                              <thead className="table-light">
                                <tr>
                                  <th scope="col">Test name</th>
                                  <th scope="col">Lab name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.homeSampledTests.map(
                                  (homeSampledTest, key) => (
                                    <tr key={"_homeSampledTest_" + key}>
                                      <td>
                                        <h5 className="font-size-14">
                                          <a
                                            href="/ecommerce-product-details/1"
                                            className="text-dark"
                                          >
                                            {homeSampledTest.test_name}{" "}
                                          </a>
                                        </h5>
                                      </td>
                                      <td>{homeSampledTest.lab_name}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </TabPane>
                      
                        <TabPane
                          tabId="3"
                          id="v-pills-payment"
                          role="tabpanel"
                          aria-labelledby="v-pills-payment-tab"
                        >
                          <div>
                            <CardTitle className="h4">
                              Payment information
                            </CardTitle>
                            <p className="card-title-desc">
                              Fill the card payment only if your payment method
                              is card
                            </p>
                            <div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cash"
                                  name="payment_method"
                                  id="customRadioInline1"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline1"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
                                  Cash on Spot
                                </Label>
                              </div>

                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Card"
                                  defaultChecked
                                  id="customRadioInline2"
                                  name="payment_method"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline2"
                                >
                                  <i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}
                                  Credit / Debit Card
                                </Label>
                              </div>

                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Donation"
                                  name="payment_method"
                                  id="customRadioInline1"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline1"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
                                  Avail Donation
                                </Label>
                              </div>
                            </div>

                            

                            {this.state.payment_method == "Card" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15">
                                  For card Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput">
                                        Card number
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="cardnumberInput"
                                        placeholder="0000 0000 0000 0000"
                                        name="card_number"
                                        onChange={e =>
                                          this.setState({
                                            card_number: e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                    <Row>
                                      <Col lg="6">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cardnameInput">
                                            Name on card
                                            <span
                                              style={{ color: "#f46a6a" }}
                                              className="font-size-18"
                                            >
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="cardnameInput"
                                            placeholder="Name on Card"
                                            name="name_on_card"
                                            onChange={e =>
                                              this.setState({
                                                name_on_card: e.target.value,
                                              })
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className=" mt-4 mb-0">
                                          <Label htmlFor="expirydateInput">
                                            Expiry date
                                            <span
                                              style={{ color: "#f46a6a" }}
                                              className="font-size-18"
                                            >
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="expirydateInput"
                                            placeholder="MM/YY"
                                            name="expiry_date"
                                            onChange={e =>
                                              this.setState({
                                                expiry_date: e.target.value,
                                              })
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cvvcodeInput">
                                            CVV code
                                            <span
                                              style={{ color: "#f46a6a" }}
                                              className="font-size-18"
                                            >
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="cvvcodeInput"
                                            placeholder="Enter CVV Code"
                                            name="cvv_code"
                                            onChange={e =>
                                              this.setState({
                                                cvv_code: e.target.value,
                                              })
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </TabPane>
                        <TabPane tabId="4" id="v-pills-confir" role="tabpanel">
                          <Card className="shadow-none border mb-0">
                            <CardBody>
                              <CardTitle className="mb-4">
                                Order Summary
                              </CardTitle>

                              <div className="table-responsive">
                                <Table className="align-middle mb-0 table-nowrap">
                                  <thead className="table-light">
                                    <tr>
                                      <th scope="col">Test Name</th>
                                      <th scope="col">Price (Rs)</th>
                                      <th scope="col">Discount by <br></br>(Lab)(Rs)</th>
                                      <th scope="col">Discount by <br></br>(LabHazir)(Rs)</th>
                                      {/* <th scope="col">Discount by <br></br>LabHazir(Against Test)</th>  */}
                                      <th scope="col">Net Payment</th>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.checkoutItems.map(
                                      (checkoutItem, key) => (
                                        <>
                                          {checkoutItem.items.map(
                                            (item, key) => (
                                              <tr key={"_item_" + key}>
                                                <td>
                                                  <h5 className="font-size-14 text-truncate">
                                                    {item.test_name}{" "}
                                                  </h5>
                                                  <p className="text-muted mb-0">
                                                    {item.lab_name}
                                                  </p>
                                            
                                                </td>
                                                
                                                <td><p className="float-end"> 
                                                {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                 </td>
                                                <td>
                                                  <p className="float-end">
                                                  {item.discount_per}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p className="float-end">
                                                  {item.discount_by_labhazir_per+item.discount_by_labhazird_by_test_per}
                                                  </p>
                                                </td>
                                                {/* <td>
                                                  <p className="float-end">
                                                  {item.discount_by_labhazird_by_test_per.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td> */}
                                                <td>
                                                  <p className="float-end bg-success bg-soft p-4">
                                                  {item.net_payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p>
                                                    
                                                  </p>
                                                </td>
                                              </tr>
                                            )
                                            
                                          )}
                                        </>
                                      )
                                    )}
                                  </tbody>
                                  <tfoot>
                                  {this.state.checkoutItems.map(
                                      (checkoutItem, key) => (
                                        <>
                                              {/* <tr className="table-light p-3 rounded">
                                                <td>
                                                  <h5 className="font-size-14 text-truncate float-center">
                                                    Total
                                                  </h5>
                                                </td>
                                                <td><p className="float-end"> 
                                                {checkoutItem.total_price_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                 </td>
                                                <td>
                                                  <p className="float-end">
                                                  {checkoutItem.total_discount_cost}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p className="float-end">
                                                  {checkoutItem.total_testdiscount_cost+checkoutItem.total_discount_by_labhazir}
                                                  </p>
                                                </td>
                                                {/* <td>
                                                  <p className="float-end">
                                                  {checkoutItem.total_discount_by_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td> */}
                                                {/* <td>
                                                  <p className="float-end">
                                                  {checkoutItem.total_discount_by_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p>
                                                    
                                                  </p>
                                                </td> */}
                                              {/* </tr>  */}
                                            

                                          {checkoutItem.lab_home_sampling_charges !=
                                            0 && (
                                            <tr key={"_checkoutItem_" + key}>
                                              <td colSpan="6">
                                                <div className="bg-primary bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-primary mb-0">
                                                    <i className="fas fa-shipping-fast me-2" />{" "}
                                                    Home Sampling Charges{" "}
                                                    {/* {
                                                        checkoutItem.lab_name
                                                      } */}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.lab_home_sampling_charges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          {checkoutItem.total_test_cost && (
                                            <tr>
                                              <td colSpan="6">
                                                <div className="bg-success bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-success mb-0">
                                                    <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                    Sub Total{" "}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.total_test_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </>
                                      )
                                    )}
                                  </tfoot>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>

                          <Row className="mt-4">
                            <Col sm="6">
                              <Link
                                to="/cart"
                                className="btn text-muted d-none d-sm-inline-block btn-link"
                              >
                                <i className="mdi mdi-arrow-left me-1" /> Back
                                to Shopping Cart{" "}
                              </Link>
                            </Col>
                            <Col sm="6">
                              <div className="text-end">
                                <button
                                  component={Link}
                                  onClick={this.handleProceedClick}
                                  to="/checkout"
                                  className="btn btn-success mb-4"
                                  disabled={this.state.checkoutSuccess}
                                >
                                  <i className="mdi mdi-truck-fast me-1" />{" "}
                                  Proceed to Shipping{" "}
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  match: PropTypes.object,
  history: any,
  homeSampledTests: PropTypes.array,
  onGetHomeSampledTests: PropTypes.func,
  checkoutItems: PropTypes.array,
  onGetCheckoutItems: PropTypes.func,
  onAddCheckoutData: PropTypes.func,
  checkedoutData: PropTypes.array,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state=> ({
  homeSampledTests: state.checkout.homeSampledTests,
  checkoutItems: state.checkout.checkoutItems,
  checkedoutData: state.checkout.checkedoutData,
  territoriesList: state.territoriesList.territoriesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetHomeSampledTests: id => dispatch(getHomeSampledTests(id)),
  onGetCheckoutItems: (id, is_home_sampling_availed) =>
    dispatch(getCheckoutItems(id, is_home_sampling_availed)),
  onAddCheckoutData: (checkoutData, id) =>
    dispatch(addCheckoutData(checkoutData, id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Checkout));
