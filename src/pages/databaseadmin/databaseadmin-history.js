import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,

} from "reactstrap";
import { Search } from "react-bootstrap-table2-toolkit";

import moment from 'moment';
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getActivityLogUnits } from "store/databaseadmin-history/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class MsgsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogUnits: [],
      activitylogUnits: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }



  componentDidMount() {
    const { onGetActivityLogUnits } = this.props;
    const id = this.props.match.params.id;
    onGetActivityLogUnits(id);
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { activitylogUnits } = this.props;
    if (
      !isEmpty(activitylogUnits) &&
      size(prevProps.activitylogUnits) !== size(activitylogUnits)
    ) {
      this.setState({ activitylogUnits: {}, isEdit: false });
    }
  }

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
    const { activitylogUnits } = this.props;

    console.log("Activity Log Units received in props:", activitylogUnits);
    const { isEdit, deleteModal } = this.state;

    const {
      onGetActivityLogUnits,
    } = this.props;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogUnits ? activitylogUnits.length : 0,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> History | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="History"
              breadcrumbItem="Activity Log"
            />
            <Row>
              <Col lg="8" className="offset-lg-2">
                <Card className="mb-2 d-flex justify-content-center">
                  <CardBody>

                    {!isEmpty(this.props.activitylogUnits) &&
                      this.props.activitylogUnits.map((activitylogUnits, key) => (
                        <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                          <Card className="mb-2" style={{ backgroundColor: "#f2f2f2" }}>
                            <CardBody className="p-3">
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Units" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}  ID: <b>{`${activitylogUnits.unit_id}`}</b> {" "}  Name: {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}

                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Units" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a {" "} ID: <b>{`${activitylogUnits.unit_id}`}</b> {" "}  Name: {" "}
                                  <b>{activitylogUnits.old_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}

                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Instruments" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}  ID: <b>{`${activitylogUnits.instrumenttype_id}`}</b> {" "}  Name: {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}

                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Instruments" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a {" "} ID: <b>{`${activitylogUnits.instrumenttype_id}`}</b> {" "}  Name: {" "}
                                  <b>{activitylogUnits.old_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}

                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Method" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated to {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}


                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Method" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a method {" "} ID: <b>{`${activitylogUnits.method_id}`}</b> {" "} {" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Manufactural" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated to {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}


                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Manufactural" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Manufactural {" "} ID: <b>{`${activitylogUnits.manufactural_id}`}</b> {" "} {" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Reagent" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated to {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}


                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Reagent" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Reagent {" "} ID: <b>{`${activitylogUnits.reagent_id}`}</b> {" "} {" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}

                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Analyte" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated to {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}


                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Analyte" && (
                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Analyte {" "} ID: <b>{`${activitylogUnits.analyte_id}`}</b> {" "} {" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  .
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    {isEmpty(this.props.activitylogUnits) && (
                      <Row>
                        <Col lg="12">
                          <div className=" mb-5">
                            <h5 className="text-uppercase">
                              No Comments exists.....
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MsgsList.propTypes = {
  match: PropTypes.object,
  activitylogUnits: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogUnits: PropTypes.func,
};
const mapStateToProps = ({ activitylogUnits }) => ({
  activitylogUnits: activitylogUnits.activitylogUnits,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLogUnits: id => dispatch(getActivityLogUnits(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));
