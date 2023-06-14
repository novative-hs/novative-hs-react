import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
import { connect } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
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

import { every, isEmpty, map, size } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  getHomeSampledTests,
  getCheckoutItems,
  addCheckoutData,
  getDonationCheck,
} from "store/checkout/actions";
import { getTerritoriesList } from "store/territories-list/actions";

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";


class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeSampledTests: [],
      checkoutItems: [],
      territoriesList: [],
      donationCheck: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      patient_name: "",
      patient_age: "",
      patient_gender: "Male",
      patient_phone: "",
      booked_by: "",
      csr_id: "",
      // relationsip_with_patient: "Self",
      patient_address: "",
      city_id: "",
      // patient_district: "",
      appointment_requested_at: "",
      is_home_sampling_availed: "",
      is_state_sampling_availed: "",
      payment_method: "",
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
    console.log("guest_id", this.props.match.params.guest_id);
    console.log("uuid", this.props.match.params.uuid);
    console.log("id", this.props.match.params.id);
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

  handleStateSamplingChange = e => {
    this.setState({
      is_state_sampling_availed: e.target.value,
    });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.state.user_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    }
    setTimeout(() => {
      this.setState({ checkoutItems: this.props.checkoutItems });
    }, 2000);
  };

  handleHomeSamplingChange = e => {
    this.setState({
      is_home_sampling_availed: e.target.value,
    });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.state.user_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    }

    setTimeout(() => {
      this.setState({ checkoutItems: this.props.checkoutItems });
    }, 2000);
  };

  handleFullProceedClick = () => {
    const canProceed = this.checkForFullValidations();
    if (canProceed) {
      if (this.state.user_id && this.state.user_type !== "CSR") {
        this.setState({
          checkoutData: {
            uuid: this.props.match.params.uuid
              ? this.props.match.params.uuid
              : "",
            patient_name: this.state.patient_name,
            patient_age: this.state.patient_age,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            // relationsip_with_patient: this.state.relationsip_with_patient,
            // patient_address: this.state.patient_address,
            city_id: this.state.city_id,
            // patient_district: this.state.patient_district,
            appointment_requested_at: this.state.appointment_requested_at,
            is_home_sampling_availed: this.state.is_home_sampling_availed,
            is_state_sampling_availed: this.state.is_state_sampling_availed,
            payment_method: this.state.payment_method,
            card_number: this.state.card_number,
            name_on_card: this.state.name_on_card,
            expiry_date: this.state.expiry_date,
            cvv_code: this.state.cvv_code,
          },
        });
      } else if (this.state.user_id && this.state.user_type === "CSR") {
        this.setState({
          checkoutData: {
            uuid: this.props.match.params.uuid
              ? this.props.match.params.uuid
              : "",
            csr_id: this.state.user_id,
            booked_by: "CSR",
            patient_name: this.state.patient_name,
            patient_age: this.state.patient_age,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            // relationsip_with_patient: this.state.relationsip_with_patient,
            // patient_address: this.state.patient_address,
            city_id: this.state.city_id,
            // patient_district: this.state.patient_district,
            appointment_requested_at: this.state.appointment_requested_at,
            is_home_sampling_availed: this.state.is_home_sampling_availed,
            is_state_sampling_availed: this.state.is_state_sampling_availed,
            payment_method: this.state.payment_method,
            card_number: this.state.card_number,
            name_on_card: this.state.name_on_card,
            expiry_date: this.state.expiry_date,
            cvv_code: this.state.cvv_code,
          },
        });
      }

      // API call to get the checkout items
      const { onAddCheckoutData } = this.props;
      if (this.state.user_id && this.state.user_type !== "CSR") {
        setTimeout(() => {
          onAddCheckoutData(this.state.checkoutData, this.state.user_id);
        }, 2000);
      } else if (this.state.user_id && this.state.user_type === "CSR") {
        setTimeout(() => {
          onAddCheckoutData(
            this.state.checkoutData,
            this.props.match.params.id
          );
        }, 2000);
      }

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.setState({
            checkoutSuccess:
              "Order has been placed successfully! Thank you for choosing Labhazir.",
          });
        }
      }, 1000);
    //   setTimeout(() => {
    //     this.props.history.push("/nearby-labs");
    // }, 2000)
    }
  };

  checkForFullValidations = () => {
    // Check if patient's name, age and appointment Booked for is filled
    if (
      this.state.patient_name &&
      // this.state.patient_address &&
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
          // this.setState({ isRequiredFilled: false });
          this.toggleTab("3"); // Redirect to Tab "3" if card information is missing
          return false;
        }
      }
      if (this.state.payment_method) {
        this.setState({ isRequiredFilled: true });
        return true;
      } else {
        // this.setState({ isRequiredFilled: false });
        this.toggleTab("3"); // Redirect to Tab "3" if card information is missing
        return false;
      }
      // // If patient's payment method is not Card (Cash) then set isRequiredFilled to true
      this.setState({ isRequiredFilled: true });
      return true;
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };

  handleProceedClick4 = () => {
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
          patient_phone: this.state.patient_phone,

          // relationsip_with_patient: this.state.relationsip_with_patient,
          // patient_address: this.state.patient_address,
          city_id: this.state.city_id,
          // patient_district: this.state.patient_district,
          appointment_requested_at: this.state.appointment_requested_at,
          // payment_method: this.state.payment_method,
          // card_number: this.state.card_number,
          // name_on_card: this.state.name_on_card,
          // expiry_date: this.state.expiry_date,
          // cvv_code: this.state.cvv_code,
        },
      });

      // API call to get the checkout items
      // const { onAddCheckoutData } = this.props;
      // setTimeout(() => {
      //   onAddCheckoutData(this.state.checkoutData, this.state.user_id);
      // }, 2000);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.toggleTab("4");
        }
      }, 1000);

      // setTimeout(() => {
      //   this.setState({ checkedoutData: this.props.checkedoutData });

      //   // If checkout operation is successful.
      //   if (this.props.checkedoutData) {
      //     this.props.history.push("/nearby-labs");
      //   }
      // }, 4000);
    }
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
          patient_phone: this.state.patient_phone,

          // relationsip_with_patient: this.state.relationsip_with_patient,
          // patient_address: this.state.patient_address,
          city_id: this.state.city_id,
          // patient_district: this.state.patient_district,
          appointment_requested_at: this.state.appointment_requested_at,
          // payment_method: this.state.payment_method,
          // card_number: this.state.card_number,
          // name_on_card: this.state.name_on_card,
          // expiry_date: this.state.expiry_date,
          // cvv_code: this.state.cvv_code,
        },
      });

      // API call to get the checkout items
      // const { onAddCheckoutData } = this.props;
      // setTimeout(() => {
      //   onAddCheckoutData(this.state.checkoutData, this.state.user_id);
      // }, 2000);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.toggleTab("2");
        }
      }, 1000);

      // setTimeout(() => {
      //   this.setState({ checkedoutData: this.props.checkedoutData });

      //   // If checkout operation is successful.
      //   if (this.props.checkedoutData) {
      //     this.props.history.push("/nearby-labs");
      //   }
      // }, 4000);
    }
  };

  checkForValidations = () => {
    // Check if patient's name, age and appointment Booked for is filled
    if (
      this.state.patient_name &&
      // this.state.patient_address &&
      this.state.city_id &&
      // this.state.patient_district &&
      this.state.patient_age &&
      this.state.appointment_requested_at
    ) {
      // Check if patient's card information is filled in case of payment method is Card
      // if (this.state.payment_method == "Card") {
      //   if (
      //     this.state.card_number &&
      //     this.state.name_on_card &&
      //     this.state.expiry_date &&
      //     this.state.cvv_code
      //   ) {
      //     this.setState({ isRequiredFilled: true });
      //     return true;
      //   } else {
      //     this.setState({ isRequiredFilled: false });
      //     return false;
      //   }
      // }
      // // If patient's payment method is not Card (Cash) then set isRequiredFilled to true
      this.setState({ isRequiredFilled: true });
      return true;
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };

  
  

  componentDidMount() {
    const { onGetDonationCheck } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        onGetDonationCheck(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        onGetDonationCheck(this.props.match.params.id);
      }, 1000);
    }
    this.setState({ donationCheck: this.props.donationCheck });
    console.log("heeeeeee", this.props.donationCheck);
    // API call to get the home sampled tests
    const { onGetHomeSampledTests } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        onGetHomeSampledTests(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        onGetHomeSampledTests(this.props.match.params.id);
      }, 1000);
    }
    this.setState({ homeSampledTests: this.props.homeSampledTests });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        onGetCheckoutItems(this.props.match.params.id);
      }, 1000);
    }
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

  handleClickAddPayment = () => {
    this.toggleTab("3"); // Switch to the "Payment Info" tab with the id of "3"
  };

  handlePaymentMethodChange = (e) => {
    const { value, name } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (this.state.payment_method === 'Card') {
          const {
            card_number,
            name_on_card,
            expiry_date,
            cvv_code
          } = this.state;
  
          // Check if all the required fields for card payment are filled
          if (card_number && name_on_card && expiry_date && cvv_code) {
            // Delay the switch to Tab 4 by 2 seconds
            setTimeout(() => {
              this.toggleTab('4');
            }, 2000);
          }
        } else {
          setTimeout(() => {
            this.toggleTab('4');
          }, 2000);
          // For other payment methods, do not switch to Tab 4
        }
      }
    );
  };
  
  
  
  

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
      console.log(this.state.donationCheck),
      (
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
                  <Col>
                    <Nav className="mt-4 mb-2 gap-4" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "1",
                          })}
                          onClick={() => {
                            this.toggleTab("1");
                          }}
                        >
                          <i className="bx bx-user d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Patient Info</p> */}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "2",
                          })}
                          onClick={this.handleProceedClick}

                        >
                          <i className="bx bx-home d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Home Sample</p> */}
                        </NavLink>
                      </NavItem>
                      <NavItem style={{ display: 'none' }}>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "3",
                          })}
                          onClick={() => {
                            this.toggleTab("3");
                          }}


                        >
                          <i className="bx bx-money d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Payment Info</p> */}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "4",
                          })}
                          onClick={this.handleProceedClick4}
                        >
                          <i className="bx bx-badge-check d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Confirmation</p> */}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
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
                                    Patient Phone
                                    <span
                                      style={{ color: "#f46a6a" }}
                                      className="font-size-18"
                                    >
                                      *
                                    </span>
                                  </Label>
                                  <Col md={10}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="patient_phone"
                                      placeholder="Enter Contact no of Patient"
                                      onChange={e =>
                                        this.setState({
                                          patient_phone: e.target.value,
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
                                      <option value="Other">Other</option>
                                    </select>
                                  </Col>
                                </FormGroup>
                                {/* 
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
                                      options={cityList}
                                      defaultValue={{
                                        label: this.state.city,
                                        value: this.state.id,
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
                              <Row className="mt-4">
                                <Col sm="6"></Col>
                                <Col sm="6">
                                  <div className="text-end">
                                    <button
                                      component={Link}
                                      onClick={this.handleProceedClick}
                                      to="/checkout"
                                      className="btn btn-success mb-4"
                                    // component={Link}
                                    // onClick={() => {
                                    //   this.toggleTab("2");
                                    // }}
                                    // to="/checkout"
                                    // className="btn btn-success mb-4"
                                    >
                                      <i className="mdi mdi-truck-fast me-1" />{" "}
                                      Next{" "}
                                    </button>
                                  </div>
                                </Col>
                              </Row>
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
                                  <option value="">Please Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </FormGroup>

                              {this.state.is_home_sampling_availed == "Yes" && (
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
                                    ></span>
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
                              )}

                              {this.state.is_home_sampling_availed == "Yes" && (
                                <FormGroup className="mb-4" row>
                                  <Label
                                    htmlFor="patient-name"
                                    md="2"
                                    className="col-form-label"
                                  >
                                    Urgent Sampling
                                    <span
                                      style={{ color: "#f46a6a" }}
                                      className="font-size-18"
                                    ></span>
                                  </Label>
                                  <Col md="10">
                                    <select
                                      className="form-control select2"
                                      title="state-sampling"
                                      name="is_state_sampling_availed"
                                      onChange={this.handleStateSamplingChange}
                                    >
                                      <option value="">Please Select</option>
                                      <option value="No">No</option>
                                      <option value="Yes">Yes</option>
                                    </select>
                                    <span className="text-primary font-size-12">
                                      <strong>
                                        Note: Please choose whether you want to
                                        avail Urgent sampling service, this will
                                        include extra charges.
                                      </strong>
                                    </span>
                                  </Col>
                                </FormGroup>
                              )}

                              <Table>
                                <Thead className="table-light">
                                  <Tr>
                                    <Th scope="col">Home Sampling Offered</Th>
                                    <Th scope="col">Test name</Th>
                                    <Th scope="col">Lab name</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {this.state.homeSampledTests.map(
                                    (homeSampledTest, key) => (
                                      // homeSampledTest.is_home_sampling_available == "Yes" &&(
                                      <Tr key={"_homeSampledTest_" + key}>
                                        <p className="font-size-14 float-start">
                                          <Td>
                                            {
                                              homeSampledTest.is_home_sampling_available
                                            }
                                          </Td>
                                        </p>

                                        <Td>
                                          <h5 className="font-size-14 float-start">
                                            <a
                                              href="/ecommerce-product-details/1"
                                              className="text-dark"
                                            >
                                              {homeSampledTest.test_name}{" "}
                                            </a>
                                          </h5>
                                        </Td>
                                        <p className="font-size-14 float-start">
                                          <Td>{homeSampledTest.lab_name}</Td>
                                        </p>
                                      </Tr>
                                    )
                                    // )
                                  )}
                                </Tbody>
                              </Table>
                              <div style={{ height: "20px" }}></div>
                              {this.state.is_state_sampling_availed ==
                                "Yes" && (
                                  <Table>
                                    <Thead className="table-light">
                                      <Tr>
                                        <Th scope="col">Lab name</Th>
                                        <Th scope="col">Urgent Sampling Time</Th>
                                        <Th scope="col">
                                          Urgent Sampling Charges
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {this.state.homeSampledTests.map(
                                        (homeSampledTest, key) => {
                                          // Check if sampling charges and fees exist
                                          if (
                                            homeSampledTest.state_sampling_charges &&
                                            homeSampledTest.state_sampling_time
                                          ) {
                                            return (
                                              <Tr key={"_homeSampledTest_" + key}>
                                                <Td>
                                                  <p className="font-size-14 float-start">
                                                    {homeSampledTest.lab_name}
                                                  </p>
                                                </Td>
                                                <Td>
                                                  <h5 className="font-size-14 float-start">
                                                    <a
                                                      href="/ecommerce-product-details/1"
                                                      className="text-dark"
                                                    >
                                                      {
                                                        homeSampledTest.state_sampling_time
                                                      }{" "}
                                                      hours
                                                    </a>
                                                  </h5>
                                                </Td>
                                                <Td>
                                                  <p className="font-size-14 float-start">
                                                    {
                                                      homeSampledTest.state_sampling_charges
                                                    }
                                                  </p>
                                                </Td>
                                              </Tr>
                                            );
                                          } else {
                                            return null; // Skip rendering if sampling charges and fees are missing
                                          }
                                        }
                                      )}
                                    </Tbody>
                                  </Table>
                                )}

                              <Row className="mt-4">
                                <Col sm="6"></Col>
                                <Col sm="6">
                                  <div className="text-end">
                                    <button
                                      component={Link}
                                      onClick={() => {
                                        this.toggleTab("4");
                                      }}
                                      to="/checkout"
                                      className="btn btn-success mb-4"
                                    >
                                      <i className="mdi mdi-truck-fast me-1" />{" "}
                                      Next{" "}
                                    </button>
                                  </div>
                                </Col>
                              </Row>
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
                                Fill the card payment only if your payment
                                method is card
                              </p>
                              <div>
                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Cash"
                                    // defaultChecked
                                    name="payment_method"
                                    id="customRadioInline1"
                                    className="form-check-input"
                                    onChange={this.handlePaymentMethodChange}

                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline1"
                                  >
                                    {/* <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "} */}
                                    <i className="fas fa-money-bill-alt me-1 font-size-18 align-top" style={{ color: 'green' }} />

                                    Cash on Spot
                                  </Label>
                                </div>
                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Card"
                                    // defaultChecked
                                    id="customRadioInline2"
                                    name="payment_method"
                                    className="form-check-input"
                                    onChange={this.handlePaymentMethodChange}

                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline2"
                                  >
                                    <i
                                      className="fab fa-cc-mastercard me-1 font-size-20 align-top"
                                      style={{
                                        color: 'white', // Set the yellow color for the circles
                                        background: '#FFA800', // Set the red color for the background
                                      }}
                                    />
                                    Credit / Debit Card
                                  </Label>
                                </div>
                                <div className="form-check form-check-inline font-size-16">
                                  {!isEmpty(this.props.donationCheck) &&
                                    this.props.donationCheck.map(
                                      (donationcheck, key) => {
                                        return (
                                          <div key={"_donationcheck_" + key}>
                                            {donationcheck.bankaccount ===
                                              true ? (
                                              <div>
                                                <Input
                                                  type="radio"
                                                  value="Donation"
                                                  name="payment_method"
                                                  id="customRadioInline1"
                                                  className="form-check-input"
                                                  onChange={this.handlePaymentMethodChange}

                                                />
                                                <Label
                                                  className="form-check-label font-size-13"
                                                  htmlFor="customRadioInline1"
                                                >
                                                  <i className="fas fa-hand-holding-heart me-1 font-size-20 align-top" style={{ color: 'red' }} />
                                                  Avail Donation
                                                </Label>
                                              </div>
                                            ) : donationcheck.bankaccount ===
                                              false ? (
                                              <div style={{ display: 'none' }}></div>
                                            ) : null}
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                                <div className="form-check form-check-inline font-size-16">
                                  {this.props.donationCheck.map(
                                    (donationcheck, key) => {
                                      return (
                                        <div key={"_donationcheck_" + key}>
                                          {donationcheck.available_credit >= donationcheck.grand_total_test_cost ? (
                                            <div>
                                              <Input
                                                type="radio"
                                                value="My Wallet"
                                                name="payment_method"
                                                id="customRadioInline1"
                                                className="form-check-input"
                                                onChange={this.handlePaymentMethodChange}

                                              />
                                              <Label
                                                className="form-check-label font-size-13"
                                                htmlFor="customRadioInline1"
                                              >
                                                <i className="mdi mdi-wallet align-middle me-1 font-size-20" style={{ color: '#0000FF' }} />
                                                My Wallet
                                              </Label>
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>

                                <div className="d-flex justify-content-center">
                                  {this.state.payment_method === "My Wallet" && (
                                    this.props.donationCheck.map((donationcheck, key) => (
                                      <div key={key} className="card" style={{ background: '#ADD8E6', width: '300px', height: '200px' }}>
                                        <div className="card-body d-flex flex-column justify-content-center">
                                          <h5 className="card-title text-center font-weight-bold">Available Credit in your Wallet</h5>
                                          <div className="card-text text-center" style={{ fontSize: '30px' }}>
                                            Rs. {donationcheck.available_credit}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>




                                {this.state.payment_method == "Donation" ? (
                                  <div>
                                    <h5 className="mt-5 mb-3 font-size-15">
                                      For Donation
                                    </h5>
                                    <div className="p-4 border">
                                      <Form>
                                        <FormGroup className="mb-0">
                                          <input
                                            name="donation"
                                            type="checkbox"
                                            required={true}
                                            // checked={false}
                                            checked={this.state.isChecked}
                                          />
                                          <b>
                                            {" "}
                                            I hereby confirm that I am deserving
                                            individual who fall into eligible
                                            category to avail obligatory charity
                                            / donation money.
                                          </b>
                                        </FormGroup>
                                      </Form>
                                    </div>
                                  </div>
                                ) : null}

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
                                            onChange={this.handlePaymentMethodChange}

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
                                                onChange={this.handlePaymentMethodChange}

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
                                                onChange={this.handlePaymentMethodChange}

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
                                                onChange={this.handlePaymentMethodChange}

                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </Form>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {/* <Row className="mt-4">
                              <Col sm="6"></Col>

                              <Col sm="6">
                                <div className="text-end">
                                  <button
                                    component={Link}
                                    onClick={() => {
                                      this.toggleTab("4");
                                    }}
                                    to="/checkout"
                                    className="btn btn-success mb-4"
                                  >
                                    <i className="mdi mdi-truck-fast me-1" />{" "}
                                    Next{" "}
                                  </button>
                                </div>
                              </Col>
                            </Row> */}
                          </TabPane>

                          <TabPane
                            tabId="4"
                            id="v-pills-confir"
                            role="tabpanel"
                          >
                            <Card className="shadow-none border mb-0">
                              <CardBody>
                                <CardTitle className="mb-4">
                                  Order Summary
                                </CardTitle>

                                <div className="table-responsive">
                                  <Table className="align-end mb-0 table-nowrap">
                                    <Thead className="table-light">
                                      <Tr>
                                        <Th
                                          scope="col"
                                          style={{ width: "20%" }}
                                          className="text-start px-4"
                                        >
                                          Test Name
                                        </Th>
                                        <Th
                                          scope="col"
                                          style={{ width: "25%" }}
                                          className="text-end px-4"
                                        >
                                          Price
                                        </Th>
                                        <Th
                                          scope="col"
                                          style={{ width: "25%" }}
                                          className="text-end px-4"
                                        >
                                          Sum Of Discount (Lab+LabHazir)
                                        </Th>
                                        <Th
                                          scope="col"
                                          style={{ width: "25%" }}
                                          className="text-end px-4"
                                        >
                                          Net Payable
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {this.state.checkoutItems.map(
                                        (checkoutItem, key) => (
                                          <>
                                            {checkoutItem.items.map(
                                              (item, key) => (
                                                <Tr key={"_item_" + key}>
                                                  <Td>
                                                    <p className="text-start px-4">
                                                      <h5 className="font-size-14 text-truncate">
                                                        {item.test_name}{" "}
                                                      </h5>
                                                      <p className="text-muted mb-0">
                                                        {item.lab_name}
                                                      </p>
                                                    </p>
                                                  </Td>

                                                  <Td>
                                                    <p className="text-end px-4">
                                                      {item.price
                                                        .toString()
                                                        .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ","
                                                        )}
                                                    </p>
                                                  </Td>
                                                  <Td>
                                                    <p className="text-end px-4">
                                                      {item.discount_per +
                                                        item.discount_by_labhazir_per +
                                                        item.discount_by_labhazird_by_test_per}
                                                    </p>
                                                  </Td>
                                                  <Td>
                                                    <p className="text-end px-4">
                                                      {item.current_amount
                                                        .toString()
                                                        .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ","
                                                        )}
                                                    </p>
                                                  </Td>
                                                </Tr>
                                              )
                                            )}
                                          </>
                                        )
                                      )}
                                    </Tbody>
                                    <tfoot>
                                      {this.state.checkoutItems.map(
                                        (checkoutItem, key) => (
                                          <>
                                            {checkoutItem.lab_home_sampling_charges !=
                                              0 && (
                                                <tr key={"_checkoutItem_" + key}>
                                                  <td colSpan="4">
                                                    {this.state
                                                      .is_home_sampling_availed ==
                                                      "Yes" &&
                                                      this.state
                                                        .is_state_sampling_availed ==
                                                      "Yes" && (
                                                        <div className="bg-primary bg-soft p-3 rounded">
                                                          <h5 className="font-size-14 text-primary mb-0">
                                                            <i className="fas fa-shipping-fast me-2" />{" "}
                                                            Sum of Home Sampling +
                                                            Urgent Sampling
                                                            Charges{" "}
                                                            {/* {
                                                        checkoutItem.lab_name
                                                      } */}
                                                            <span className="float-end">
                                                              Rs.{" "}
                                                              {checkoutItem.total_sampling_charges
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}
                                                            </span>
                                                          </h5>
                                                        </div>
                                                      )}
                                                    {this.state
                                                      .is_home_sampling_availed ==
                                                      "Yes" &&
                                                      this.state
                                                        .is_state_sampling_availed !=
                                                      "Yes" && (
                                                        <div className="bg-primary bg-soft p-3 rounded">
                                                          <h5 className="font-size-14 text-primary mb-0">
                                                            <i className="fas fa-shipping-fast me-2" />{" "}
                                                            Sum of Home Sampling
                                                            Charges{" "}
                                                            {/* {
                                                        checkoutItem.lab_name
                                                      } */}
                                                            <span className="float-end">
                                                              Rs.{" "}
                                                              {checkoutItem.total_sampling_charges
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}
                                                            </span>
                                                          </h5>
                                                        </div>
                                                      )}
                                                  </td>
                                                </tr>
                                              )}

                                            {checkoutItem.total_test_cost && (
                                              <Tr>
                                                <Td colSpan="4">
                                                  <div className="bg-success bg-soft p-3 rounded">
                                                    <h5 className="font-size-14 text-success mb-0">
                                                      <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                      Sub Total{" "}
                                                      <span className="float-end">
                                                        Rs.{" "}
                                                        {checkoutItem.total_test_cost
                                                          .toString()
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )}
                                                      </span>
                                                    </h5>
                                                  </div>
                                                </Td>
                                              </Tr>
                                            )}
                                          </>
                                        )
                                      )}
                                    </tfoot>
                                  </Table>
                                </div>
                              </CardBody>
                            </Card>

                            {!isEmpty(this.state.payment_method) &&

                              <Card className="shadow-none border mb-0">
                                <CardBody className="text-center">
                                  <CardTitle className="mb-1">
                                    <i className="mdi mdi-wallet me-1 font-size-18 align-middle" style={{ color: 'red' }} />
                                    Payment method
                                  </CardTitle>

                                  {this.state.payment_method !== "card" && (
                                    <div>
                                      <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                        <span style={{ color: 'red', marginLeft: '10px' }}>{this.state.payment_method}</span>
                                      </p>
                                    </div>
                                  )}

                                  {this.state.payment_method === "Card" && (
                                    <div>
                                      <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                        {/* <span style={{ color: 'red', marginLeft: '10px' }}>{this.state.payment_method}</span> */}
                                        <span style={{ marginLeft: '10px' }}>{this.state.card_number}</span>
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <div className="table-responsive">
                                      <a
                                        href="#"
                                        onClick={this.handleClickAddPayment}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                      >
                                        <i className="mdi mdi-pencil me-1 font-size-18 align-middle" style={{ color: 'red' }} />
                                        Update Payment method
                                      </a>
                                    </div>

                                    {/* Rest of your component code */}
                                  </div>
                                </CardBody>
                              </Card>

                            }

                            {isEmpty(this.state.payment_method) &&

                              <Card className="shadow-none border mb-0">
                                <CardBody className="text-center">
                                  <CardTitle className="mb-1">
                                    <i className="mdi mdi-wallet me-1 font-size-18 align-middle" style={{ color: 'red' }} />
                                    Payment method
                                  </CardTitle>
                                  <div>
                                    <div className="table-responsive">
                                      <a
                                        href="#"
                                        onClick={this.handleClickAddPayment}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                      >
                                        <i className="mdi mdi-plus me-1 font-size-18 align-middle" style={{ color: 'red' }} />
                                        Add Payment method
                                      </a>
                                    </div>

                                    {/* Rest of your component code */}
                                  </div>
                                </CardBody>
                              </Card>

                            }
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
                                    onClick={this.handleFullProceedClick}
                                    to="/checkout"
                                    className="btn btn-success mb-4"
                                    disabled={this.state.checkoutSuccess}
                                  >
                                    <i className="mdi mdi-truck-fast me-1" />{" "}
                                    Book Appointment{" "}
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
      )
    );
  }
}

Checkout.propTypes = {
  match: PropTypes.object,
  history: any,
  homeSampledTests: PropTypes.array,
  donationCheck: PropTypes.array,
  onGetHomeSampledTests: PropTypes.func,
  onGetDonationCheck: PropTypes.func,
  checkoutItems: PropTypes.array,
  onGetCheckoutItems: PropTypes.func,
  onAddCheckoutData: PropTypes.func,
  checkedoutData: PropTypes.array,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => ({
  homeSampledTests: state.checkout.homeSampledTests,
  donationCheck: state.checkout.donationCheck,
  checkoutItems: state.checkout.checkoutItems,
  checkedoutData: state.checkout.checkedoutData,
  territoriesList: state.territoriesList.territoriesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetHomeSampledTests: id => dispatch(getHomeSampledTests(id)),
  onGetDonationCheck: id => dispatch(getDonationCheck(id)),
  onGetCheckoutItems: (
    id,
    is_home_sampling_availed,
    is_state_sampling_availed
  ) =>
    dispatch(
      getCheckoutItems(id, is_home_sampling_availed, is_state_sampling_availed)
    ),
  onAddCheckoutData: (checkoutData, id) =>
    dispatch(addCheckoutData(checkoutData, id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Checkout));
