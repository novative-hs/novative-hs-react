import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as XLSX from "xlsx";

import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getParticipantList } from "store/participant-list/actions";
import { isEmpty, size, uniq } from "lodash";
import { Tooltip } from "@material-ui/core";
import "assets/scss/table.scss";
import moment from "moment";
import Select from "react-select";

class Manufactural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      ParticipantList: [],
      list: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

      //Filters
      cityFilter: "",
      nameFilter: "",
      added_byFilter: "",
      date_of_additionFilter: "",
      telephoneFilter: "",
      addressFilter: "",
      countryFilter: "",
      //Sorting
      nameSort: "asc",
      citySort: "asc",
      added_bySort: "asc",
      dateSort: "asc",
      telephoneSort: "asc",
      addressSort: "asc",
      countrySort: "asc",
      //Array of objects
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          // hidden: true,

          formatter: (cellContent, list) => <>{list.id}</>,
          // filter: textFilter(),
        },
        {
          text: "Participant Name",
          dataField: "name",
          sort: true,
          formatter: (cellContent, list) => <>{list.name}</>,
        },
        {
          text: "City",
          dataField: "city",
          sort: true,
          formatter: (cellContent, list) => <>{list.city}</>,
        },
        {
          text: "District",
          dataField: "district",
          sort: true,
          formatter: (cellContent, list) => <>{list.district}</>,
        },
        {
          text: "Name of Notification Person",
          dataField: "lab_staff_name",
          sort: true,
          formatter: (cellContent, list) => <>{list.lab_staff_name}</>,
        },

        {
          text: "Contact No of Notification Person",
          dataField: "landline_registered_by",
          sort: true,
          formatter: (cellContent, list) => <>{list.landline_registered_by}</>,
        },
        {
          text: "Email Id of Notification Person",
          dataField: "email_participant",
          sort: true,
          formatter: (cellContent, list) => <>{list.email_participant}</>,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { ParticipantList, ongetManufacturalList } = this.props;
    ongetManufacturalList(this.state.user_id);
    this.setState({ ParticipantList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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
  exportToExcel = () => {
    const { ParticipantList } = this.props;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = ["id", "name", "date_of_addition"];

    // Map each row to an object with only the desired fields
    const dataToExport = ParticipantList.map(unit => ({
      id: unit.id,
      name: unit.name,
      city: unit.city,
      district: unit.district,
      landline_registered_by: unit.landline_registered_by,
      email_participant: unit.email_participant,
      // date_of_addition: moment(unit.date_of_addition).format(
      //   "DD MMM YYYY, h:mm A"
      // ),
    }));

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "EquipmentType_list" + fileExtension;
    saveAs(data, fileName);
  };

  render() {
    const { SearchBar } = Search;

    const { ParticipantList } = this.props;
    const { ongetManufacturalList } = this.props;
    const list = this.state.ParticipantList;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: ParticipantList.length, // replace later with size(list),
      custom: true,
    };

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
            <title>Participants</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Participants List" breadcrumbItem="Participants List" /> 
            <Row>
                 <Col lg="12" className="text-end">
                <Button onClick={this.exportToExcel} className="mb-3">
                  Export to Excel
                </Button>
              </Col>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ParticipantList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={ParticipantList} // Use filtered list here
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

Manufactural.propTypes = {
  match: PropTypes.object,
  ParticipantList: PropTypes.array,

  className: PropTypes.any,
  ongetManufacturalList: PropTypes.func,

  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ ParticipantList }) => ({
  ParticipantList: ParticipantList.ParticipantList,
});

const mapDispatchToProps = dispatch => ({
  ongetManufacturalList: id => dispatch(getParticipantList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Manufactural));
