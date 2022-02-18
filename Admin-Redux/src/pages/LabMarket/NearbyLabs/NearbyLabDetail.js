import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import classnames from "classnames";
import { isEmpty } from "lodash";

//Import Star Ratings
import StarRatings from "react-star-ratings";

//Import Product Images
import { productImages } from "../../../assets/images/product/";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import actions
import { getProductDetail } from "../../../store/e-commerce/actions";

class NearbyLabDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      product: {},
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.imageShow = this.imageShow.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
      onGetProductDetail,
    } = this.props;
    if (params && params.id) {
      onGetProductDetail(params.id);
    }
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  imageShow(img, id) {
    const expandImg = document.getElementById("expandedImg" + id);
    expandImg.src = img;
  }

  render() {
    const { product } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>
              Products Details | Skote - React Admin & Dashboard Template
            </title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Lab Marketplace"
              breadcrumbItem="Nearby Lab Details"
            />
            {/* <Row>
              <Col>
                <Card>
                  <CardBody>Check</CardBody>
                </Card>
              </Col>
            </Row> */}
            {!isEmpty(product) && (
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <Row></Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.object,
  onGetProductDetail: PropTypes.func,
};

const mapStateToProps = ({ ecommerce }) => ({
  product: ecommerce.product,
});

const mapDispatchToProps = dispatch => ({
  onGetProductDetail: id => dispatch(getProductDetail(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NearbyLabDetail);
