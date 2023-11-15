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
  getLabsListPendingFee,
} from "store/labs-list-pending/actions";


class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsListPendingFee: [],
      id: "",
      LabsLists: "",
      labsListPendingFee: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      // labsListListColumns: [

      //   {
      //     dataField: "id",
      //     text: "Lab ID",
      //     sort: true,
      //     formatter: (cellContent, labsListPendingFee) => (
      //       <>
      //         <strong>{labsListPendingFee.id}</strong>
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "name",
      //     text: "Lab Name",
      //     sort: true,
      //     formatter: (cellContent, labsListPendingFee) => (
      //       <>
      //         {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
      //         <Link to={`/shared-percentage-pending-Fee/${labsListPendingFee.id}`}>
      //           {labsListPendingFee.name}
      //         </Link>
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "email",
      //     text: "Email",
      //     sort: true,
      //   },
      //   {
      //     dataField: "phone",
      //     text: "Phone No.",
      //     sort: true,
      //   },
      //   {
      //     dataField: "city",
      //     text: "City",
      //     sort: true,
      //   },
      //   {
      //     dataField: "district",
      //     text: "District",
      //     sort: true,
      //   },
      // ],
    };
  }

  // componentDidMount() {
  //   const { labsListPendingFee, onGetLabsListPendingFee } = this.props;
  //   console.log(onGetLabsListPendingFee());
  //   this.setState({ labsListPendingFee });
  // }
  componentDidMount() {
    const { labsListPendingFee, onGetLabsListPendingFee } = this.props;
    onGetLabsListPendingFee(this.state.user_id);
    console.log(onGetLabsListPendingFee());
    this.setState({ labsListPendingFee });
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

  render() {
    const { SearchBar } = Search;

    const { labsListPendingFee } = this.props;
    const data = this.state.data;
    const { onGetLabsListPendingFee } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labsListPendingFee.length, // replace later with size(labsListPendingFee),
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
            <title>Labs List | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Shared Percentage Pending Labs" breadcrumbItem="Labs Link" />
            {!isEmpty(this.props.labsListPendingFee) && (
              
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Lab Shared Percentage Pending
                        </h3>
                      </div>
                      <Table className="align-middle mb-0 table-nowrap">
                        <thead className="table-light">
                                    <tr>
                                     
                                      <th scope="col">Lab Name</th>
                                      <th scope="col">Phone</th>
                                      <th scope="col">Email</th>
                                      <th scope="col">Address</th>

                                    </tr>
                          </thead>
                         
                          <tbody>
                          {this.props.labsListPendingFee.map(
                                      (labsListPendingFee, key) => (
                                        <>
                                          {labsListPendingFee.lab_list.map(
                                            (lab_list, key) => (

                                <tr key={key}>
                                  {/* <td>{key + 1}</td> */}
                                 <td className="text-start"> <b><Link to={`/shared-percentage-pending-Fee/${lab_list.id}`}>
                                    {lab_list.name}
                                  </Link>
                                  </b>
                                  </td>
                                  <td className="text-center">{lab_list.landline}</td>
                                  <td className="text-start">{lab_list.email}</td>
                                  <td className="text-center" style={{whiteSpace: "pre-wrap"}}>{lab_list.address}</td>
                                </tr>
                                    
                                      )
                                      
                                    )}
                                  </>
                                )
                              )}
                          
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
  labsListPendingFee: PropTypes.array,
  className: PropTypes.any,
  onGetLabsListPendingFee: PropTypes.func,
};
const mapStateToProps = ({ labsListPendingFee}) => ({
  labsListPendingFee: labsListPendingFee.labsListPendingFee,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsListPendingFee: id => dispatch(getLabsListPendingFee(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));