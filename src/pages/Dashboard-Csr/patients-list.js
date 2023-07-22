import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import {
  Card,
  Input,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getPatientsList } from "store/patients-list/actions";
import "assets/scss/table.scss";
// import { color } from "html2canvas/dist/types/css/types/color";

class PatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patients: [],
      // id: "",
      patient: "",
      phone:"",
      guest_id:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bAllClientListColumns: [
        {
          dataField: "account_id",
          text: "Patient ID",
          sort: true,
          formatter: (cellContent, patient) => (
            <>
              <strong>{patient.account_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          formatter: (cellContent, patient) => (
            <>
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
              <Link 
              to={
                this.props.match.params.uuid
                  ? `/nearby-labs/${this.props.match.params.uuid}/${patient.account_id}`
                  : `/nearby-labs/${patient.account_id}`
              }
              >
                {patient.name}
              </Link>
            </>
          ),
        },
        {
          dataField: "phone",
          text: "Phone",
          sort: true,
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    console.log("uuuuuuid", this.props.match.params.uuid)
    const { patients, onGetPatientsList } = this.props;
    onGetPatientsList(this.state.user_id);
    this.setState({ patients });
    console.log("guest", this.props.match.params.guest_id)
  }
  handleBlur = () => {
    // Calling API when focus is out of test name and setting nearby tests array
    const { onGetPatientsList } = this.props;
    var data = {
      phone: this.state.phone,
    };

    onGetPatientsList(data);

    setTimeout(() => {
      this.setState({ patients: this.props.patients });
    }, 1000);
  };

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

  render() {
    const { SearchBar } = Search;

    const { patients } = this.props;
    const { onGetPatientsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: patients.length, // replace later with size(patients),
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
            <title>Patients List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Patients" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bAllClientListColumns}
                      data={patients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bAllClientListColumns}
                          data={patients}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                               <Row className="mb-2 g-0">
                                <Col sm="2" lg="2">
                                <div className="mb-2">
                            <Label
                              for="LabType1"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '6px' : '12px',
                              }}
                            >
                              Search By Phone No
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              name="phone"
                              placeholder="Search Phone..."
                              onChange={e =>
                                this.setState({
                                  phone: e.target.value,
                                })
                              }
                              // onBlur={this.handleBlur}
                              value={this.state.phone}
                            />
                          
                          </div>
                                </Col>
                                <Col sm="3" lg="3">
                                  <span></span>
                                <div className="mt-4"></div>
                                  <div>
                                <button
                                  onClick={this.handleBlur}
                                  className="bx bx-search-alt" style={{ fontSize: '32px', color:'white', background:'blue', border:'none'}}>
                                    {/* <div><i className="bx bx-search-alt" style={{ fontSize: '32px' }}></i></div> */}
                                    
                                </button>
                                  </div>
                                </Col>
                              </Row>
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
                                      // filter={ filterFactory() }
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    ></Modal>
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

PatientsList.propTypes = {
  match: PropTypes.object,
  patients: PropTypes.array,
  className: PropTypes.any,
  onGetPatientsList: PropTypes.func,
};
const mapStateToProps = ({ patients }) => ({
  patients: patients.patientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPatientsList: (data) => dispatch(getPatientsList(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientsList));