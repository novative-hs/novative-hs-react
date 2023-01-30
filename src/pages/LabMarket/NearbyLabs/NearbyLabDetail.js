import React, { Component } from "react";
import PropTypes, { number, string } from "prop-types";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import * as Yup from "yup";

import { connect } from "react-redux";
import { Media } from "reactstrap";
import { map } from "lodash";

import FeedbackDetail from "pages/Feedbacks-List/FeedbackDetail";

import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./nearbylabs.scss";
//Import Star Ratings
import StarRatings from "react-star-ratings";

import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getLabProfile } from "store/auth/labprofile/actions";

class NearbyLabDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
      // guest_id: localStorage.getItem("guest_id")
      // ? JSON.parse(localStorage.getItem("guest_id")).guest_id
      // : "",
      activeTab: "1",
      logo: "",
      name: "",
      rating: undefined,
      address: "",
      city: "",
      phone: "",
      email: "",
    };
  }
  componentDidMount() {
    this.props.getLabProfile(this.props.match.params.lab_account_id);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Nearby Lab Detail | Lab Hazir - Dashboard</title>
          </MetaTags>

          {this.props.success ? (
            <Container fluid>
              <Breadcrumbs
                title="Lab Marketplace"
                breadcrumbItem="Nearby Lab Details"
              />

              <Row>
                <Col xl="9">
                  <Card>
                    <CardBody>
                      <div className="product-detai-imgs">
                        <Row>
                          <Col lx="5">
                            <div className="me-3">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  this.props.success.logo
                                }
                                alt=""
                                className="img-thumbnail mx-auto d-block rounded"
                              />
                            </div>
                          </Col>
                          <Col lx="3">
                            <h2>{this.props.success.name}</h2>
                            {this.props.success ? (
                              <div className="text-muted float-start me-3">
                                <StarRatings
                                  rating={this.props.success.rating}
                                  starRatedColor="#F1B44C"
                                  starEmptyColor="#2D363F"
                                  numberOfStars={5}
                                  name="rating"
                                  starDimension="14px"
                                  starSpacing="3px"
                                />
                              </div>
                            ) : null}

                            <p className="font-size-16">
                              {this.props.success.rating}
                            </p>
                            <div className="text-muted float-start">
                              <p>
                                <i className="bx bxs-home-circle me-1" />
                                {this.props.success.address}
                              </p>
                              <p>
                                <i className="bx bxs-buildings me-1" />{" "}
                                {this.props.success.city}
                              </p>
                              <p>
                                <i className="bx bxs-phone-call me-1" />
                                {this.props.success.landline}
                              </p>
                              <p>
                                <i className="mdi mdi-email me-1" />
                                {this.props.success.email}
                              </p>
                              <p>
                                <i className="bx bxs-badge-check me-1" />
                                We have {this.props.success.lab_experience}{" "}
                                years of experience in the market
                              </p>
                            </div>
                          </Col>
                        </Row>
                        {!this.state.user_id ? (
                          <Row className="mt-4">
                            <div className=" mb-3">
                              <Col sm="6">
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.guest_id}`
                                  }
                                  className=" linklist btn btn-primary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right " /> Offered
                                  Tests{" "}
                                </Link>
                              </Col>
                            </div>
                            <div className="mb-3">
                              <Col sm="6">
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.guest_id}`
                                  }
                                  className="linklist btn btn-primary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Quality-Certificates{" "}
                                </Link>
                              </Col>
                            </div>
                            <div className="mb-3">
                              <Col sm="6">
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.guest_id}`
                                  }
                                  className="linklist btn btn-primary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Sample-Collectors{" "}
                                </Link>
                              </Col>
                            </div>
                            <div className="mb-3">
                              <Col sm="6">
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                      : `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.guest_id}`
                                  }
                                  className="linklist btn btn-primary btn-md"
                                >
                                  <i className="mdi mdi-arrow-right btn-block" />{" "}
                                  Pathologists{" "}
                                </Link>
                              </Col>
                            </div>

                            {/* <Col sm="6">
    <Link
      to={
        this.props.match.params.uuid
          ? `/nearby-labs/${this.props.match.params.uuid}`
          : `/nearby-labs`
      }
      className="btn btn-secondary"
    >
      <i className="bx bxs-shopping-bags me-1" />{" "}
      Continue Shopping{" "}
    </Link>
  </Col>
  <Col sm="6">
    <div className="text-sm-end mt-2 mt-sm-0">
      <Link
        to={{
          pathname: `http://maps.google.com/?q=${this.props.success.address}`,
        }}
        className="btn btn-success mb-2 mt-2"
        target="_blank"
      >
        <i className="bx bxs-navigation" /> Navigate to
        the Lab
      </Link>
    </div>
  </Col> */}
                          </Row>
                        ) : this.state.user_id ? (
                          <Row className="mt-4">
                          <div className=" mb-3">
                            <Col sm="6">
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/offered-test-by-lab`
                                }
                                className=" linklist btn btn-primary btn-md"
                              >
                                <i className="mdi mdi-arrow-right " /> Offered
                                Tests{" "}
                              </Link>
                            </Col>
                          </div>
                          <div className="mb-3">
                            <Col sm="6">
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/lab-quality-certificates`
                                }
                                className="linklist btn btn-primary btn-md"
                              >
                                <i className="mdi mdi-arrow-right btn-block" />{" "}
                                Quality-Certificates{" "}
                              </Link>
                            </Col>
                          </div>
                          <div className="mb-3">
                            <Col sm="6">
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/lab-sample-collectors`
                                }
                                className="linklist btn btn-primary btn-md"
                              >
                                <i className="mdi mdi-arrow-right btn-block" />{" "}
                                Sample-Collectors{" "}
                              </Link>
                            </Col>
                          </div>
                          <div className="mb-3">
                            <Col sm="6">
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.uuid}`
                                    : `/${this.props.match.params.lab_account_id}/lab-pathologists`
                                }
                                className="linklist btn btn-primary btn-md"
                              >
                                <i className="mdi mdi-arrow-right btn-block" />{" "}
                                Pathologists{" "}
                              </Link>
                            </Col>
                          </div>

                          {/* <Col sm="6">
                           <Link
                             to={
                               this.props.match.params.uuid
                                 ? `/nearby-labs/${this.props.match.params.uuid}`
                                 : `/nearby-labs`
                             }
                             className="btn btn-secondary"
                           >
                             <i className="bx bxs-shopping-bags me-1" />{" "}
                             Continue Shopping{" "}
                           </Link>
                         </Col>
                         <Col sm="6">
                           <div className="text-sm-end mt-2 mt-sm-0">
                             <Link
                               to={{
                                 pathname: `http://maps.google.com/?q=${this.props.success.address}`,
                               }}
                               className="btn btn-success mb-2 mt-2"
                               target="_blank"
                             >
                               <i className="bx bxs-navigation" /> Navigate to
                               the Lab
                             </Link>
                           </div>
                         </Col> */}
                        </Row>
                        ): null}
                        {/* {this.state.user_id && ( */}
                       
                        {/* )} */}

                        {/* <GoogleMaps /> */}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Insert Review Section */}
                  <FeedbackDetail />
                </Col>

                <Col xl="3">
                  <Card>
                    <Col sm="12">
                      {!this.state.user_id && (
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-labs/${this.props.match.params.uuid}`
                              : `/nearby-labs/${this.props.match.params.guest_id}`
                          }
                          className="btn btn-secondary"
                        >
                          <i className="bx bxs-shopping-bags me-1" /> Continue
                          Shopping{" "}
                        </Link>
                      )}
                      {this.state.user_id && (
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-labs/${this.props.match.params.uuid}`
                              : `/nearby-labs/`
                          }
                          className="btn btn-secondary"
                        >
                          <i className="bx bxs-shopping-bags me-1" /> Continue
                          Shopping{" "}
                        </Link>
                      )}
                    </Col>

                    <Col sm="12">
                      <div className="mb-3 mt-3">
                        <Link
                          to={{
                            pathname: `http://maps.google.com/?q=${this.props.success.address}`,
                          }}
                          className="btn btn-success mb-2 mt-2"
                          target="_blank"
                        >
                          <i className="bx bxs-navigation" /> Navigate to the
                          Lab
                        </Link>
                      </div>
                    </Col>
                    {/* <CardBody>
                      <div className=" mb-3 mt-3">
                        <Col sm="12">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/${this.props.match.params.lab_account_id}/offered-test-by-lab/${this.props.match.params.uuid}`
                                : `/${this.props.match.params.lab_account_id}/offered-test-by-lab`
                            }
                            className=" linklist btn btn-primary btn-md"
                          >
                            <i className="mdi mdi-arrow-right " /> Offered Tests{" "}
                          </Link>
                        </Col>
                      </div>
                      <div className="mb-3">
                        <Col sm="12">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/${this.props.match.params.lab_account_id}/lab-quality-certificates/${this.props.match.params.uuid}`
                                : `/${this.props.match.params.lab_account_id}/lab-quality-certificates`
                            }
                            className="linklist btn btn-primary btn-md"
                          >
                            <i className="mdi mdi-arrow-right btn-block" />{" "}
                            Quality-Certificates{" "}
                          </Link>
                        </Col>
                      </div>
                      <div className="mb-3">
                        <Col sm="12">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/${this.props.match.params.lab_account_id}/lab-sample-collectors/${this.props.match.params.uuid}`
                                : `/${this.props.match.params.lab_account_id}/lab-sample-collectors`
                            }
                            className="linklist btn btn-primary btn-md"
                          >
                            <i className="mdi mdi-arrow-right btn-block" />{" "}
                            Sample-Collectors{" "}
                          </Link>
                        </Col>
                      </div>
                      <div className="mb-3">
                        <Col sm="12">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/${this.props.match.params.lab_account_id}/lab-pathologists/${this.props.match.params.uuid}`
                                : `/${this.props.match.params.lab_account_id}/lab-pathologists`
                            }
                            className="linklist btn btn-primary btn-md"
                          >
                            <i className="mdi mdi-arrow-right btn-block" />{" "}
                            Pathologists{" "}
                          </Link>
                        </Col>
                      </div>
                    </CardBody> */}
                  </Card>

                  {(this.props.success.complaint_handling_email ||
                    this.props.success.complaint_handling_phone) && (
                      <Card>
                        <CardBody>
                          <div className="text-muted float-start">
                            <h5>Help & Support</h5>
                            {this.props.success.complaint_handling_email && (
                              <p>
                                <i className="bx bx-mail-send me-1 mt-3" />
                                {this.props.success.complaint_handling_email}
                              </p>
                            )}

                            {this.props.success.complaint_handling_phone && (
                              <p>
                                <i className="bx bx-phone-call me-1" />
                                {this.props.success.complaint_handling_phone}
                              </p>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  {/* <Card>
                  <CardBody>
                    <div className="mt-3 ">
                      <h2 className="font-size-20 mb-3">Customer Rating</h2>
                      <div>
                        <div className="form-check mt-2 font-size-16">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck1"
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck1"
                          >
                            4 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2 font-size-16">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck2"
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck2"
                          >
                            3 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2 font-size-16">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck3"
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck3"
                          >
                            2 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2 font-size-16">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck4"
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
                </Card> */}
                </Col>
              </Row>
            </Container>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.object,
  className: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
  onGetProductDetail: PropTypes.func,
  comments: PropTypes.array,
};

const mapStateToProps = state => {
  const { error, success } = state.LabProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getLabProfile })(
    withTranslation()(NearbyLabDetail)
  )
);
