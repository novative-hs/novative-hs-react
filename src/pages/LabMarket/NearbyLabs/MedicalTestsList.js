import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Select from "react-select";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  Label,
  Input,
} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { isEmpty, map, size } from "lodash";
import { addToCart } from "store/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { onlyMedicalTestList } from "store/only-medical-tests-list/actions";
import { getTerritoriesList } from "store/territories-list/actions";
import { getQuotes } from "store/quotes/actions";

import "assets/scss/table.scss";
import quotes from "store/quotes/reducer";

class MedicalTestList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      territoriesList: [],
      onlyMedicalTestList: [],
      test_name: [], // Use an array to store multiple selections
      quotes: [],
      quote: "",
      id: "",
      searchQuery: "", // New state property for search query
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      onlyMedicalTestList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      loading: true, // Add loading state proper
      page: "1",
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { onlyMedicalTestList, onGetonlyMedicalTestList } = this.props;
    onGetonlyMedicalTestList(this.state.user_id);
    this.setState({ onlyMedicalTestList });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000); // Set loading state to false after 7 seconds
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
  onchangename = selectedOptions => {
    const selectedValues = selectedOptions.map(option => option.value);
    this.setState({
      test_name: selectedValues,
    });
  };
  handleAddToCart = cart => {
    console.log("1stttt", cart);
    const { onAddToCart } = this.props;
    const { offered_tests } = cart;
    console.log("2nd", offered_tests);
    // Check if there are offered tests in the nearbyTest
    if (offered_tests && offered_tests.length > 0) {
      offered_tests.forEach(offeredTest => {
        console.log("3rddd", offeredTest);
        // const { id:id } = offeredTest;
        if (!this.state.user_id) {
          // Check if the item is already in the cart
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          this.setState({ guest_id: this.props.match.params.guest_id });
          offeredTest.guest_id = this.props.match.params.guest_id;
          onAddToCart(offeredTest, offeredTest.guest_id);

          console.log(
            "uuid:",
            offeredTest.guest_id,
            this.props.match.params.guest_id
          );
        } else if (
          this.state.user_type !== "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the cart
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.state.user_id);
        } else if (
          this.state.user_type === "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.guest_id);
        } else if (
          this.state.user_type === "b2bclient" &&
          this.state.user_type !== "CSR"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.uuid);
        }
      });
      this.showSuccessMessage("Item added Successfully");
    } else {
      // Show error message if there are no offered tests
      this.showErrorMessage("No offered tests to add to the cart");
    }
  };
  showErrorMessage = message => {
    this.showPopup(message, "red");
  };

  showSuccessMessage = message => {
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
  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  render() {
    const { SearchBar } = Search;
    const { loading } = this.state;

    const { onlyMedicalTestList, quotes } = this.props;
    const { onGetonlyMedicalTestList, onGetQuotes } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: onlyMedicalTestList.length, // replace later with size(onlyMedicalTestList),
      custom: true,
    };
    const { searchQuery } = this.state;
    // const filteredTests = this.props.onlyMedicalTestList.filter(test =>
    //   test.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    const testList = [];
    for (let i = 0; i < this.props.onlyMedicalTestList.length; i++) {
      testList.push({
        label: this.props.onlyMedicalTestList[i].name,
        value: this.props.onlyMedicalTestList[i].id,
      });
    }

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            {/* <title>Approved Donors | Lab Hazir</title> */}
          </MetaTags>
          <Container fluid>
            <Row>
              <Col xs="4" sm="4" md="2" lg="2">
                <div className="mb-3">
                  <Label for="city" className="form-label">
                    Select City
                  </Label>
                  <Select
                    name="city"
                    component="Select"
                    onChange={selectedGroup => {
                      const selectedCityId = selectedGroup.value;
                      this.setState({ city_id: selectedCityId });

                      // Check if both city and test name are selected before making the API call
                      if (selectedCityId && this.state.test_id) {
                        // Call your API here
                        console.log(
                          "Calling API with City:",
                          selectedCityId,
                          "and Test ID:",
                          this.state.test_id
                        );
                        const { onGetQuotes } = this.props;
                        onGetQuotes(selectedCityId, this.state.test_id);

                        // Set loading state
                        this.setState({ loading: true });

                        // Clear previous quotes
                        this.setState({ quotes: [] });

                        // Set loading state to false after 7 seconds
                        setTimeout(() => {
                          this.setState({ loading: false });
                        }, 7000);
                      } else {
                        console.log(
                          "City or Test ID not selected. API call not made."
                        );
                      }
                    }}
                    className="defautSelectParent"
                    options={cityList}
                    defaultValue={{
                      label: "Select City...",
                      value: this.state.id,
                    }}
                  />
                </div>
              </Col>

              <Col xs="4" sm="4" md="2" lg="2">
                <div className="mb-3">
                  <Label for="test_id" className="form-label">
                    Select Test Names
                  </Label>
                  <Select
                    name="test"
                    component="Select"
                    onChange={selectedTests => {
                      const selectedTestIds = selectedTests.map(
                        test => test.value
                      );
                      this.setState({ test_id: selectedTestIds });

                      // Check if both city and test name are selected before making the API call
                      if (this.state.city_id && selectedTestIds.length > 0) {
                        // Call your API here
                        console.log(
                          "Calling API with City:",
                          this.state.city_id,
                          "and Test IDs:",
                          selectedTestIds
                        );
                        const { onGetQuotes } = this.props;
                        onGetQuotes(this.state.city_id, selectedTestIds);

                        // Set loading state
                        this.setState({ loading: true });

                        // Clear previous quotes
                        this.setState({ quotes: [] });

                        // Set loading state to false after 7 seconds
                        setTimeout(() => {
                          this.setState({ loading: false });
                        }, 7000);
                      } else {
                        console.log(
                          "City or Test IDs not selected. API call not made."
                        );
                      }
                    }}
                    // value={testList.filter((item) => this.state.test_id.includes(item.value))}
                    isMulti={true}
                    className="defautSelectParent"
                    options={testList}
                  />
                </div>
              </Col>

              <div className="table-responsive">
                <Table className="table-nowrap">
                  <thead>
                    <tr>
                      <th className="text-start">Lab Name</th>
                      <th className="text-start">Test Name</th>
                      <th className="text-start">Price</th>
                      <th className="text-center"> Total Price</th>
                    </tr>
                  </thead>
                  {!isEmpty(quotes) &&
                    Array.isArray(quotes.top_lab_details_with_tests) &&
                    quotes.top_lab_details_with_tests.map(
                      (referrelFeeLab, key) => (
                        // console.log(
                        //   "hhshshhshshsh22222222",
                        //   quotes,
                        //   this.props.quotes
                        // ),
                        <tr key={"_row_" + key}>
                          <td className="text-start py-2 pl-3 pr-4">
                            {referrelFeeLab.name}
                          </td>
                          <td
                            className="text-start py-2 pl-3 pr-4"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {!isEmpty(referrelFeeLab.offered_tests) &&
                              referrelFeeLab.offered_tests.map(
                                (offeredTest, index) => (
                                  <div key={index}>{offeredTest.test_name}</div>
                                )
                              )}
                          </td>
                          <td className="text-start py-2 pl-3 pr-4">
                            {!isEmpty(referrelFeeLab.offered_tests) &&
                              referrelFeeLab.offered_tests.map(
                                (offeredTest, index) => (
                                  <div key={index}>{offeredTest.price}</div>
                                )
                              )}
                          </td>
                          <td className="text-center py-2 pl-3 pr-4">
                            {/* Calculate the total price */}
                            Rs.{" "}
                            {referrelFeeLab.offered_tests.reduce(
                              (total, offeredTest) => total + offeredTest.price,
                              0
                            )}
                          </td>
                          <td>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1 text-white bg-primary btn-outline-primary"
                              onClick={() => {
                                this.handleAddToCart(referrelFeeLab);
                              }}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  {isEmpty(quotes) && (
                    <Row>
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry no result found.
                        </h4>
                      </div>
                    </Row>
                  )}
                </Table>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MedicalTestList.propTypes = {
  match: PropTypes.object,
  onlyMedicalTestList: PropTypes.array,
  className: PropTypes.any,
  quotes: PropTypes.array,
  onGetQuotes: PropTypes.func,
  onGetonlyMedicalTestList: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({
  onlyMedicalTestList,
  territoriesList,
  quotes,
  carts,
}) => ({
  onlyMedicalTestList: onlyMedicalTestList.onlyMedicalTestList,
  territoriesList: territoriesList.territoriesList,
  quotes: quotes.quotes,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetonlyMedicalTestList: () => dispatch(onlyMedicalTestList()),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetQuotes: (city_id, test_id) => dispatch(getQuotes(city_id, test_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MedicalTestList));
