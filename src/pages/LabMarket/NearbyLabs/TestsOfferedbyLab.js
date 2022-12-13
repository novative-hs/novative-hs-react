import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form } from "formik";

// import ScrollButton from "components/Common/Scrollbutton";
import {
  Card,
  Button,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Alert,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";
import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

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
      carts: [],
      cart: "",
      success: "",
      error: "",
      applied: true,
      page: 1,
      // count: 0,
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

    const { onGetCarts } = this.props;
    onGetCarts(this.state.user_id);
    this.setState({ carts: this.props.carts });
  }
  // incrementCart = () =>{
  //   this.setState({count: this.state.count + 1})
  //    }

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
    }, 1000);

    setTimeout(() => {
      if (this.props.success) {
        this.setState({ count: this.state.count + 1 });
      } else {
        this.setState({ count: this.state.count });
      }
    }, 2000);
  };


  render() {
    const { page, totalPage } = this.state;
    const { offeredTests } = this.props.offeredTests;
    const { carts } = this.props;
    const offeredTest = this.state.offeredTest;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Tests Offered | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Nearby Labs" breadcrumbItem="Tests Offered" />

            {this.state.success ? (
              window.location.reload()>
              <Alert color="success" className="col-md-4">
                {this.state.success}
              </Alert>
            ) : this.state.error ? (
              <Alert color="danger" className="col-md-5">
                {this.state.error}
              </Alert>
            ) : null}

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
                <ModalHeader toggle={this.togglePatientModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">
                                Included Tests
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
              <div className="mt- text-left">
                <Link
                  to={
                    this.props.match.params.uuid
                      ? `/cart/${this.props.match.params.uuid}`
                      : `/cart`
                  }
                  className="btn btn-danger btn-rounded"
                >
                  <i className="bx bx-cart-alt bx-tada align-middle me-1 font-size-22" />{" "}
                  {/* {this.state.count} */}
                  {!isEmpty(this.props.carts) &&
                    this.props.carts.slice(-1).pop().cart_quantity +
                      this.state.count}
                </Link>
              </div>

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

                          {/* <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {offeredTest.test_name}{" "}
                            </h5>
                            {offeredTest.test_type != "Test" && (
                              <div className="mb-3">
                                <Link
                                  to="#"
                                  onClick={e =>
                                    this.openPatientModal(e, offeredTest)
                                  }
                                >
                                  <span>Included Tests</span>
                                </Link>
                              </div>
                            )}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-hand-holding-medical"></i>{" "}
                                {offeredTest.test_type}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                {offeredTest.price} Rs
                              </span>
                            </div>
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                {offeredTest.discount} % Discount By Lab
                              </span>
                            </div>
                            {/* <div className="my-0">
                              <span className="text-muted me-2"> */}
                            {/* <i className="fas fa-money-bill"></i>{" "} */}
                            {/* {offeredTest.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} */}
                            {/* {offeredTest.discount_by_labhazir} % Discount By LabHazir

                              </span>
                            </div> 

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-hand-holding-medical"></i>{" "}
                                Offered by {offeredTest.lab_name}
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
                          </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {offeredTest.duration_required}{" "}
                                {offeredTest.duration_type}
                              </span>
                            </div>

                            <div className="mt-3 text-center">
                              <Link
                                to="#"
                                onClick={e =>
                                  this.openDescriptionModal(e, offeredTest)
                                }
                              >
                                <span>Test Description</span>
                              </Link>
                            </div>
                            <Button
                              type="button"
                              color="primary"
                              className="btn mt-3 me-1"
                              onClick={() => this.handleAddToCart(offeredTest)}
                            >
                              <i className="bx bx-cart me-2" /> Add to cart
                            </Button>
                          </div> */}
                           <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                              {offeredTest.test_name}
                            </h5>
                            {/* <div className="mt-3 text-center"> */}
                              <Link
                                to="#"
                                onClick={e =>
                                  this.openDescriptionModal(e, offeredTest)
                                }
                              >
                                <span>Test Description</span>
                              </Link>
                            {/* </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                Rs {offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              </span>
                            </div>
                            {offeredTest.discount>=0.01 && (
                              <div className="my-0">
                              <span className="text-danger" >
                                <i className="fas fa-money-bill"></i>{" "}
                                Discount: {(offeredTest.discount*100).toFixed()} % 
                              </span>
                            </div>
                            )}
                            <div className="my-0">
                              {" "}
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${offeredTest.lab_account_id}`
                                }
                                
                                className="text-dark"
                              >
                                <span className="text-primary">
                                  {offeredTest.lab_name}{" "}
                                  
                                </span>
                              </Link>
                              {/* <span className="text-muted me-2">
                                <i className="fas fa-vial"></i> Lab:{" "}
                                {offeredTest.lab_name}
                              </span> */}
                            </div>
                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-money-bill"></i>{" "}
                                {offeredTest.discount_by_labhazir} % Discount By Labhazir
                              </span>
                            </div> */}
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-stopwatch"></i> Reporting
                                Time: {offeredTest.duration_required}{" "}
                                {offeredTest.duration_type}
                              </span>
                            </div>

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="fas fa-home"></i> Home Sampling:{" "}
                                {offeredTest.is_home_sampling_available}
                              </span>
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
              {/* <ScrollButton /> */}
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
  className: PropTypes.any,
  carts: PropTypes.array,
  onGetCarts: PropTypes.func,
};

const mapStateToProps = ({ offeredTests, carts }) => ({
  offeredTests: offeredTests.offeredTests,
  carts: carts.carts,
  success: carts.success,
  error: carts.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetOfferedTestsReferrel: () =>
    dispatch(getOfferedTestsReferrel(ownProps.match.params.lab_account_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetCarts: id => dispatch(getCarts(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsOffered));
