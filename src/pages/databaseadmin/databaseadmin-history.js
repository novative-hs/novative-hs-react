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
import moment from "moment";

// Import Breadcrumb
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
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    const { onGetActivityLogUnits } = this.props;

    // Get 'id' from route params
    const id = this.props.match.params.id;

    // Get 'type' from query string (this.props.location.search)
    const queryParams = new URLSearchParams(this.props.location.search);
    const type = queryParams.get('type'); // Extract type from query params

    if (id && type) {
      // Pass both id and type to the action
      onGetActivityLogUnits(id, type);
    } else {
      console.error("ID or Type missing in the request.");
    }
  }


  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidUpdate(prevProps) {
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
    const { isEdit, deleteModal } = this.state;
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
            <Breadcrumbs title="History" breadcrumbItem="Activity Log" />
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
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Unit ID{" "}
                                  <b>
                                    {activitylogUnits.unit_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Units" && (


                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Unit {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Unit ID{" "}
                                  <b>
                                    {activitylogUnits.unit_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Instrumentlist" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Instrument ID{" "}
                                  <b>
                                    {activitylogUnits.instrumenttype_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Instrumentlist" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Instrument {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Unit ID{" "}
                                  <b>
                                    {activitylogUnits.instrumenttype_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Method" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Method ID{" "}
                                  <b>
                                    {activitylogUnits.method_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Method" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Method {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Method ID{" "}
                                  <b>
                                    {activitylogUnits.method_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Manufactural" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Manufactural ID{" "}
                                  <b>
                                    {activitylogUnits.manufactural_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Manufactural" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Manufactural {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Manufactural ID{" "}
                                  <b>
                                    {activitylogUnits.manufactural_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Reagent" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Reagent ID{" "}
                                  <b>
                                    {activitylogUnits.reagent_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}


                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Reagent" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Reagent {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Reagent ID{" "}
                                  <b>
                                    {activitylogUnits.reagent_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}

                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Analyte" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Analyte ID{" "}
                                  <b>
                                    {activitylogUnits.analyte_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Analyte" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Analyte {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Analyte ID{" "}
                                  <b>
                                    {activitylogUnits.analyte_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Scheme" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Scheme ID{" "}
                                  <b>
                                    {activitylogUnits.scheme_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Scheme" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Scheme {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Scheme ID{" "}
                                  <b>
                                    {activitylogUnits.scheme_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Cycle" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Cycle ID{" "}
                                  <b>
                                    {activitylogUnits.cycle_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Cycle" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Cycle {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Cycle ID{" "}
                                  <b>
                                    {activitylogUnits.cycle_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Instruments" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Instrument Type ID{" "}
                                  <b>
                                    {activitylogUnits.instrumenttype_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Instruments" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Instrument Type {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Instrument Type ID{" "}
                                  <b>
                                    {activitylogUnits.instrumenttype_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "City" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with City ID{" "}
                                  <b>
                                    {activitylogUnits.city_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "City" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a City {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with City ID{" "}
                                  <b>
                                    {activitylogUnits.city_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "ParticipantCountry" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Country ID{" "}
                                  <b>
                                    {activitylogUnits.country_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "ParticipantCountry" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Country {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Country ID{" "}
                                  <b>
                                    {activitylogUnits.country_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "ParticipantCountry" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Country ID{" "}
                                  <b>
                                    {activitylogUnits.country_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "ParticipantCountry" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Country {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Country ID{" "}
                                  <b>
                                    {activitylogUnits.country_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "District" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with District ID{" "}
                                  <b>
                                    {activitylogUnits.district_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "District" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a District {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with District ID{" "}
                                  <b>
                                    {activitylogUnits.district_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Department" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Department ID{" "}
                                  <b>
                                    {activitylogUnits.department_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Department" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Department {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Department ID{" "}
                                  <b>
                                    {activitylogUnits.department_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Designation" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Designation ID{" "}
                                  <b>
                                    {activitylogUnits.designation_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Designation" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Designation {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Designation ID{" "}
                                  <b>
                                    {activitylogUnits.designation_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "Designation" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Designation ID{" "}
                                  <b>
                                    {activitylogUnits.designation_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "Designation" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Designation {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Designation ID{" "}
                                  <b>
                                    {activitylogUnits.designation_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "ParticipantType" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with ParticipantType ID{" "}
                                  <b>
                                    {activitylogUnits.type_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "ParticipantType" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a ParticipantType {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with ParticipantType ID{" "}
                                  <b>
                                    {activitylogUnits.type_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Updated" && activitylogUnits.type === "ParticipantSector" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Updated  {" "}
                                  from <b>{activitylogUnits.old_value}</b> to{" "}
                                  <b>{activitylogUnits.new_value}</b>
                                  {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_updation
                                  ).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Sector ID{" "}
                                  <b>
                                    {activitylogUnits.sector_id}
                                  </b>
                                  <b>
                                  </b>
                                  .
                                </div>
                              )}
                              {activitylogUnits.actions === "Added" && activitylogUnits.type === "ParticipantSector" && (

                                <div>
                                  <b>{`${activitylogUnits.added_by}`}</b> Added a Sector {" "}
                                  <b>{activitylogUnits.new_value}</b> {" "}
                                  at{" "}
                                  {moment(activitylogUnits.date_of_addition).format("DD MMM YYYY, h:mm A")}{" "}
                                  with Sector ID{" "}
                                  <b>
                                    {activitylogUnits.sector_id}
                                  </b>
                                  <b>
                                  </b>
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
  location: PropTypes.object

};

const mapStateToProps = ({ activitylogUnits }) => ({
  activitylogUnits: activitylogUnits.activitylogUnits,
});

const mapDispatchToProps = (dispatch) => ({
  onGetActivityLogUnits: (id, type) => dispatch(getActivityLogUnits(id, type)), // Pass id and type here
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));
