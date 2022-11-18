import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import {
  Card,
  Button,
  CardBody,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Alert,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { any } from "prop-types";

import { getOfferedTestsReferrel } from "store/offered-tests/actions";
import { addToCart } from "store/actions";

class TestsOffered extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      activeTab: "1",
      offeredTests: [],
      success: "",
      error: "",
      applied: true,
      page: 1,
      totalPage: 5, //replace this with total pages of data
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    const { ongetOfferedTestsReferrel } = this.props;
    if (this.state.applied) {
      ongetOfferedTestsReferrel();
      this.setState({ offeredTests: this.props.offeredTests });
    }
  }

  // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // const { offeredTests } = this.props;
  //   // if (
  //   //   isEmpty(prevProps.offeredTests) &&
  //   //   !isEmpty(offeredTests) &&
  //   //   size(offeredTests) !== size(prevProps.offeredTests)
  //   // ) {
  //   //   this.setState({ offeredTests });
  //   // }
  //   // Timeout functions to hide alerts after sometime......
  //   // setTimeout(() => {
  //   //   this.setState({ success: "" });
  //   // }, 10000);
  //   // setTimeout(() => {
  //   //   this.setState({ error: "" });
  //   // }, 10000);
  // }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handlePageClick = page => {
    this.setState({ page });
  };

  handleAddToCart = cart => {
    const { onAddToCart } = this.props;

    if (!this.state.user_id) {
      this.props.history.push(
        this.props.match.params.uuid
          ? `/login/${this.props.match.params.uuid}`
          : `/login`
      );
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
    const { offeredTests } = this.props.offeredTests;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Tests Offered | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Nearby Labs" breadcrumbItem="Tests Offered" />

            {this.state.success ? (
              <Alert color="success" className="col-md-4">
                {this.state.success}
              </Alert>
            ) : this.state.error ? (
              <Alert color="danger" className="col-md-5">
                {this.state.error}
              </Alert>
            ) : null}

            <Row>
              <Row>
                {!isEmpty(this.props.offeredTests) &&
                  this.props.offeredTests.map((offeredTest, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                "/media/" +
                                offeredTest.lab_logo
                              }
                              alt="Lab Logo"
                              style={{
                                width: "300px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                              className="img-fluid mx-auto d-block"
                            />
                          </div> */}

                          <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {offeredTest.test_name}{" "}
                            </h5>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                                {offeredTest.price} Rs

                              </span>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                {/* <i className="fas fa-money-bill"></i>{" "} */}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                                {offeredTest.discount} % Discount

                              </span>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                {/* <i className="fas fa-money-bill"></i>{" "} */}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                                {offeredTest.discount_by_labhazir} % Discount By LabHazir

                              </span>
                            </div>

                            <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="fas fa-hand-holding-medical"></i>{" "}
                                  Offered by {" "}{offeredTest.lab_name}
                                </span>
                              </div>

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {offeredTest.is_home_sampling_available}
                              </span>
                            </div> */}

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-medal"></i> EQA
                                Participation:{" "}
                                {offeredTest.is_eqa_participation}
                              </span>
                            </div> */}

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Test Performed:{" "}
                                {offeredTest.is_test_performed}
                              </span>
                          </div> */}

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {offeredTest.duration_required}{" "}
                                {offeredTest.duration_type}
                              </span>
                            </div> 
                           
                            <div className="mt-3 text-center">
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/test-descriptions/${offeredTest.test_id}/${this.props.match.params.uuid}`
                                    : `/test-descriptions/${offeredTest.test_id}`
                                }
                                className="fw-medium text-primary"
                              >
                                {" "}
                                View Test Description
                              </Link>{" "}
                            </div>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(offeredTest)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.offeredTests) && (
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
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

TestsOffered.propTypes = {
  match: PropTypes.object,
  history: any,
  location: PropTypes.any,
  offeredTests: PropTypes.array,
  ongetOfferedTestsReferrel: PropTypes.func,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
};

const mapStateToProps = ({ offeredTests, carts }) => ({
  offeredTests: offeredTests.offeredTests,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetOfferedTestsReferrel: () =>
    dispatch(getOfferedTestsReferrel(ownProps.match.params.lab_account_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsOffered));
