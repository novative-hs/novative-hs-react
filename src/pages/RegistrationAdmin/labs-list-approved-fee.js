import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  Table,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, map } from "lodash";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getLabsListApprovedFee,
} from "store/labs-list-pending/actions";


class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsListApprovedFee: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      filters: {
        name: '',
        landline: '',
        email: '',
        address: '',
      },
    };
  }

  // componentDidMount() {
  //   const { labsListApprovedFee, onGetLabsListApprovedFee } = this.props;
  //   console.log(onGetLabsListApprovedFee());
  //   this.setState({ labsListApprovedFee });
  // }
  componentDidMount() {
    const { labsListApprovedFee, onGetLabsListApprovedFee } = this.props;
    onGetLabsListApprovedFee(this.state.user_id);
    console.log(onGetLabsListApprovedFee());
    this.setState({ labsListApprovedFee });
  }
  // componentDidMount() {
  //   const { b2bAllClients, onGetB2bAllClientsList } = this.props;
  //   onGetB2bAllClientsList(this.state.user_id);
  //   this.setState({ b2bAllClients });
  // }

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
  handleFilterChange = (field, value) => {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [field]: value,
      },
    }));
  };


  render() {
    const { filters } = this.state;
    const { labsListApprovedFee } = this.props;
    const filteredLabsList = labsListApprovedFee.filter((lab) => {
      return lab.lab_list.some((lab_list) => {
        return (
          lab_list.name.toLowerCase().includes(filters.name.toLowerCase()) &&
          lab_list.landline.includes(filters.landline) &&
          lab_list.email.toLowerCase().includes(filters.email.toLowerCase()) &&
          lab_list.address.toLowerCase().includes(filters.address.toLowerCase())
        );
      });
    });

    const columns = [
      { dataField: 'name', text: 'Lab Name' },
      { dataField: 'landline', text: 'Phone' },
      { dataField: 'email', text: 'Email' },
      { dataField: 'address', text: 'Address' },
    ];

    const headerCells = columns.map((column) => (
      <th key={column.dataField} scope="col">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{column.text}</span>
          <input
            type="text"
            placeholder={`Filter by ${column.text}`}
            value={filters[column.dataField]}
            onChange={(e) => this.handleFilterChange(column.dataField, e.target.value)}
            style={{ width: '200px', padding: '6px' }}  // Adjust the width and padding as needed
          />
        </div>
      </th>
    ));
        
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Labs List | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Shared Percentage Approved Labs" breadcrumbItem="Labs Link" />
            {!isEmpty(this.props.labsListApprovedFee) && (
              
             
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Lab Shared Percentage Approved
                        </h3>
                      </div>
                      <Table className="align-middle mb-0 table-nowrap">
                        <thead className="table-light">
                        <tr>{headerCells}</tr>

                          </thead>
                         
                          <tbody>
                            {filteredLabsList.map((lab, key) => (
                              <React.Fragment key={key}>
                                {lab.lab_list.map((lab_list, key) => (
                                  <tr key={key}>
                                    <td className="text-start" style={{ whiteSpace: 'pre-wrap', width: '300px' }}>
                                      <b>
                                        <Link to={`/shared-percentage-pending-Fee/${lab_list.id}`}>{lab_list.name}</Link>
                                      </b>
                                    </td>
                                    <td className="text-start">{lab_list.landline}</td>
                                    <td className="text-start">{lab_list.email}</td>
                                    <td className="text-start" style={{ whiteSpace: 'pre-wrap' }}>
                                      {lab_list.address}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                      
              
                        </Table>
                    
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsListApprovedFee: PropTypes.array,
  className: PropTypes.any,
  onGetLabsListApprovedFee: PropTypes.func,
};
const mapStateToProps = ({ labsListPendingFee}) => ({
  labsListApprovedFee: labsListPendingFee.labsListApprovedFee,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsListApprovedFee: id => dispatch(getLabsListApprovedFee(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));