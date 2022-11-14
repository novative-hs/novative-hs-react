import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
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
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

import "nouislider/distribute/nouislider.css";

// import Header
import Header from "components/HorizontalLayout/Header";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { any } from "prop-types";

import { getQualityCertificates } from "store/quality-certificates/actions";
import HorizontalLayout from "components/HorizontalLayout";

class LabQualityCertificates extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      qualityCertificates: [],
      qualityCertificate: "",
      certificateImg: "",
      modal: false,
      deleteModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { qualityCertificates, onGetQualityCertificates } = this.props;
    onGetQualityCertificates();
    this.setState({ qualityCertificates });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { qualityCertificates } = this.props;
  //   if (
  //     isEmpty(prevProps.qualityCertificates) &&
  //     !isEmpty(qualityCertificates) &&
  //     size(qualityCertificates) !== size(prevProps.qualityCertificates)
  //   ) {
  //     this.setState({ qualityCertificates });
  //   }
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

  render() {
    const { page, totalPage } = this.state;
    const { qualityCertificates } = this.props.qualityCertificates;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Quality Certificates List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Quality Certificates"
              breadcrumbItem="Certificates List"
            />
            <Row>
              <Row>
                {!isEmpty(this.props.qualityCertificates) &&
                  this.props.qualityCertificates.map(
                    (qualityCertificate, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card>
                          <CardBody>
                            {/* <div className="product-img position-relative">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  qualityCertificate.certificate
                                }
                                alt="Lab Cartificate"
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
                                {qualityCertificate.name}{" "}
                              </h5>
                              <h5 className="mb-2 text-truncate">
                                {qualityCertificate.lab_id.name}{" "}
                              </h5>

                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="fas fa-vial"></i> Certificate
                                  For : {qualityCertificate.type}{" "}
                                </span>
                              </div>

                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-calendar-month"></i>{" "}
                                  Expiry Date:{" "}
                                  {new Date(
                                    qualityCertificate.expiry_date
                                  ).toLocaleDateString("en-US")}
                                </span>
                              </div>

                              <div className="mt-3 text-center">
                                <Link
                                  to={{
                                    pathname:
                                      process.env.REACT_APP_BACKENDURL +
                                      qualityCertificate.certificate,
                                  }}
                                  className="fw-medium text-primary"
                                  target="_blank"
                                >
                                  {" "}
                                  View Certificate
                                </Link>{" "}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    )
                  )}

                {isEmpty(this.props.qualityCertificates) && (
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

LabQualityCertificates.propTypes = {
  match: PropTypes.object,
  qualityCertificates: PropTypes.array,
  className: PropTypes.any,
  onGetQualityCertificates: PropTypes.func,
};

const mapStateToProps = ({ qualityCertificates }) => ({
  qualityCertificates: qualityCertificates.qualityCertificates,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetQualityCertificates: () =>
    dispatch(getQualityCertificates(ownProps.match.params.lab_account_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabQualityCertificates));
