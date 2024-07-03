import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  Label,
  ModalHeader,
  ModalBody,

} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getOrganizationlist, updateOrganizationList, deleteOrganizationList } from "store/organization/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import moment from 'moment';

class OrganizationList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      emailFilter: '',
      websiteFilter: '',
      countryFilter: '',
      OrganizationList: [],
      organization: "",
      collectorImg: "",
      nameSort: 'asc',
      emailSort: 'asc',
      websiteSort: 'asc',
      countrySort: 'asc',
      modal: false,
      deleteModal: false,
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      OrganizationListColumns: [
        // {
        //   text: "id",
        //   dataField: "id",
        //   sort: true,
        //   hidden: true,
        //   formatter: (cellContent, organization) => <>{organization.id}</>,
        // },
       
        {
          dataField: "name",
          text: "Name",
          sort: true,
          filter: textFilter(),
          style: { textAlign: 'left' }
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
          style: { textAlign: 'left' }
        },
        {
          dataField: "website",
          text: "Website",
          sort: true,
          filter: textFilter(),
          style: { textAlign: 'left' }
        },
        {
          dataField: "country",
          text: "Country",
          sort: true,
          filter: textFilter(),
          style: { textAlign: 'left' }
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, organization) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e => this.handleReagentsClick(e, organization)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(organization)}
                  ></i>
                </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    
    this.handleReagentsClick = this.handleReagentsClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleReagentsClicks = this.handleReagentsClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  componentDidMount() {
    const { onGetOrganizationList } = this.props;
    onGetOrganizationList();
    this.setState({ OrganizationList: this.props.OrganizationList });
  }
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleReagentsClicks = () => {
    this.setState({ organization: "", isEdit: true });
    this.toggle();
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { OrganizationList } = this.props;
    if (
      !isEmpty(OrganizationList) &&
      size(prevProps.OrganizationList) !== size(OrganizationList)
    ) {
      // this.setState({ OrganizationList: {}, isEdit: false });
      this.setState({ OrganizationList });
    }
  }
  onClickDelete = organization => {
    this.setState({ organization: organization });
    this.setState({ deleteModal: true });
  };


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
  handleDeleteOrganizationList = () => {
    const { ondeleteOrganization, onGetOrganizationList } = this.props;
    const { organization } = this.state;
    if (organization.id !== undefined) {
      ondeleteOrganization(organization);
      setTimeout(() => {
        onGetOrganizationList();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };
  handleReagentsClick = (e, arg) => {
    
    const organization = arg;
    console.log("data in case of update ssd", organization)
    this.setState({
      organization: {
        
        id: organization.id,
        name: organization.name,
        email: organization.email,
        website: organization.website,
        country: organization.country,
      },
      isEdit: true,
    });

    this.toggle();
  };     
 
 
  render() {
    // const { SearchBar } = Search;
    const { OrganizationList } = this.props;
    const { isEdit, deleteModal, organization } = this.state;
    const { onUpdateOrganizationList, onGetOrganizationList, ondeleteOrganization, } = this.props;
    // const organization = this.state.organization;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: OrganizationList.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const iconStyle = { color: 'red' };
    return (
      <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={this.handleDeleteOrganizationList}
        onCloseClick={() => this.setState({ deleteModal: false })}
      />

        <div className="page-content">
          <MetaTags>
            <title>Organization List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Organization"
              breadcrumbItem="Organization List"
            />
            <Row className="justify-content-center">
            {/* <p className="text-danger">Note: Pathologist Information will scale the rating of your lab.</p> */}

              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.OrganizationListColumns}
                      data={OrganizationList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.OrganizationListColumns}
                          data={OrganizationList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col> */}
                                {/* <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                     style={{ background: "#0000CD" }}
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleReagentsClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Analyte
                                    </Button>
                                  </div>
                                </Col> */}
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
                                      filter={filterFactory()}
                                      sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Organization List"
                                          : " Organization List"}
                                      </ModalHeader>
                                      <ModalBody>
                                      <Formik
                                          enableReinitialize={true}
                                          
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: organization.name || "",
                                            email: organization.email || "",
                                            website: organization.website || "",
                                            country: organization.country || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddenEditFlag: Yup.boolean(),
                                            name: Yup.string().trim().required("Please enter name"),
                                            email: Yup.string().trim().required("Please enter an email address")
                                            .email("Please enter a valid email address"),
                                            website: Yup.string().trim().required("Please enter Website"),
                                            country: Yup.string().trim().required("Please enter a country")
                                          })}
                                          onSubmit={values => {
                                            const updateOrganizationList = {
                                              id: organization.id,
                                              name: values.name,
                                              email: values.email,
                                              website: values.website,
                                              country: values.country,
                                            };
                                            console.log("data before submit",updateOrganizationList )
                                          
                                            onUpdateOrganizationList(updateOrganizationList);
                                            setTimeout(() => {
                                              onGetOrganizationList(this.state.user_id);
                                            }, 1000);
                                     
                                            this.toggle();
                                          }}
                                        > 
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.organization
                                                          .name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          organization: {
                                                         
                                                            id: organization.id,
                                                            name: e.target
                                                              .value,
                                                            email:
                                                              organization.email,
                                                            website:
                                                             organization.website,
                                                            country:
                                                             organization.country,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                  <Label className="form-label">
                                                    Email
                                                    <span className="text-danger">*</span>
                                                  </Label>
                                                  <Field
                                                    name="email"
                                                    type="email"
                                                    className={"form-control" + (errors.email && touched.email ? " is-invalid" : "")}
                                                    value={organization.email}
                                                    onChange={e =>
                                                      this.setState(prevState => ({
                                                        organization: {
                                                          ...prevState.organization,
                                                          email: e.target.value,
                                                        }
                                                      }))
                                                    }
                                                  />
                                                  <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                </div>

                                              {/* //////////// */}
                                              <div className="mb-3">
                                                    <Label className="form-label">
                                                      Website
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="website"
                                                      type="website"
                                                      className={
                                                        "form-control" + 
                                                        (errors.email &&
                                                        touched.email
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.organization.website
                                                          
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          organization: {
                                                            id: organization.id,
                                                            name: organization.name,
                                                            email:
                                                              organization.email,
                                                            website:
                                                              e.target.value,
                                                              country: organization.country,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="website"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  {/* //////////////////////////////// */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                     Country
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                     <Field
                                                    name="country"
                                                    type="text"
                                                    className={"form-control" + (errors.country && touched.country ? " is-invalid" : "")}
                                                    value={organization.country}
                                                    onChange={e =>
                                                      this.setState(prevState => ({
                                                        organization: {
                                                          ...prevState.organization,
                                                          country: e.target.value,
                                                        }
                                                      }))
                                                    }
                                                  />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                <div className="text-end">
                                                  <button
                                                    type="submit"
                                                    className="btn btn-success save-user"
                                                  >
                                                    Save
                                                  </button>
                                                </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
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
OrganizationList.propTypes = {
  match: PropTypes.object,
  OrganizationList: PropTypes.array,
  className: PropTypes.any,
  onGetOrganizationList: PropTypes.func,
  onUpdateOrganizationList: PropTypes.func,
  ondeleteOrganization: PropTypes.func,
};

const mapStateToProps = ({ organizationaccount }) => ({
  OrganizationList: organizationaccount.OrganizationList,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetOrganizationList: () => dispatch(getOrganizationlist()),
  onUpdateOrganizationList: organization => dispatch(updateOrganizationList(organization)),
  ondeleteOrganization: (organization) => dispatch(deleteOrganizationList(organization)),
});


export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList);