import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getLabAdvertisementRequestsAccepted,
  updateLabAdvertisementRequest,

} from "store/lab-advertisement-requests/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class LabAdvertisementRequestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labAdvertisementRequests: [],
      labAdvertisementRequest: "",
      certificateImg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labAdvertisementRequestListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, labAdvertisementRequest) => (
            <>{labAdvertisementRequest.id}</>
          ),
        },
        {
          dataField: "poster",
          text: "Adv Image",
          formatter: (cellContent, labAdvertisementRequest) => (
            <>
              {!labAdvertisementRequest.poster ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {/* {labAdvertisementRequest.name.charAt(0)} */}
                  </span>
                </div>
              ) : (
                <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL +
                    labAdvertisementRequest.poster,
                }}
                target="_blank"
              >
                <img
                    className="rounded-circle avatar-xs"
                    src={
                      process.env.REACT_APP_BACKENDURL + labAdvertisementRequest.poster
                    }
                    alt=""
                  />
              </Link>
              )}
            </>
          ),
        },
        {
          dataField: "title",
          text: "Title",
          sort: true,
        },
        {
          dataField: "request_status",
          text: "Status",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, labAdvertisementRequest) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handleLabAdvertisementRequestClick(e, labAdvertisementRequest)
                  }
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleLabAdvertisementRequestClick =
    this.handleLabAdvertisementRequestClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleLabAdvertisementRequestClicks =
      this.handleLabAdvertisementRequestClicks.bind(this);
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

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
    const { labAdvertisementRequests, onGetLabAdvertisementRequestsAccepted } = this.props;
    onGetLabAdvertisementRequestsAccepted(this.state.user_id);
    this.setState({ labAdvertisementRequests });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleLabAdvertisementRequestClicks = () => {
    this.setState({
      labAdvertisementRequest: "",
      certificateImg: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { labAdvertisementRequests } = this.props;
    if (
      !isEmpty(labAdvertisementRequests) &&
      size(prevProps.labAdvertisementRequests) !== size(labAdvertisementRequests)
    ) {
      this.setState({ labAdvertisementRequests: {}, isEdit: false });

    }
  }

  handleLabAdvertisementRequestClick = (e, arg) => {
    this.setState({
      labAdvertisementRequest: {
        id: arg.id,
        request_status:arg.request_status,
        declined_reason: arg.declined_reason,
        posted_at: arg.posted_at,
        posted_till: arg.posted_till,
        description: arg.description,

      },
      isEdit: true,
    });

    this.toggle();
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
  render() {
    const { SearchBar } = Search;

    const { labAdvertisementRequests } = this.props;

    const { isEdit } = this.state;

    const {
      onUpdateLabAdvertisementRequest,
      onGetLabAdvertisementRequestsAccepted,
    } = this.props;
    const labAdvertisementRequest = this.state.labAdvertisementRequest;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labAdvertisementRequests.length, // replace later with size(labAdvertisementRequests),
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
            <title>Pending Lab Advertisements List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Lab Advertisement Request"
              breadcrumbItem="Pending List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labAdvertisementRequestListColumns}
                      data={labAdvertisementRequests}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labAdvertisementRequestListColumns}
                          data={labAdvertisementRequests}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
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
                                          ? "Response Lab Advertisement"
                                          : "Add Lab Advertisement Request"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            request_status:
                                              (this.state.labAdvertisementRequest &&
                                                this.state.labAdvertisementRequest
                                                  .request_status) ||
                                              "",
                                            declined_reason:
                                              (this.state.labAdvertisementRequest &&
                                                this.state.labAdvertisementRequest
                                                  .declined_reason) ||
                                              "",
                                            posted_till:
                                              (this.state &&
                                                this.state.labAdvertisementRequest
                                                  .posted_till) ||
                                              "",
                                            posted_at:
                                              (this.state &&
                                                this.state.labAdvertisementRequest
                                                  .posted_at) ||
                                              "",
                                          
                                            description:
                                              (this.state &&
                                                this.state.labAdvertisementRequest
                                                  .description) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                               
                                                const updateLabAdvertisementRequest =
                                                  {
                                                    id: labAdvertisementRequest.id,
                                                    
                                                    request_status: values.request_status,
                                                    declined_reason: values.declined_reason,
                                                    posted_at: values.posted_at,
                                                    posted_till: values.posted_till, 
                                                    description: values.description,
                                                  };

                                                // update LabAdvertisementRequest
                                                onUpdateLabAdvertisementRequest(
                                                  updateLabAdvertisementRequest
                                                );
                                                
                                                setTimeout(() => {
                                                  onGetLabAdvertisementRequestsAccepted(
                                                    this.state.user_id
                                                  );
                                                }, 
                                                1000);
                                              }
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
                                                 {/* Certificate Type field */}
                                                 <div className="mb-3">
                                                   <Label className="form-label">
                                                     Status
                                                     <span className="text-danger font-size-12">
                                                       *
                                                     </span>
                                                   </Label>
                                                   <Field
                                                     name="request_status"
                                                     as="select"
                                                     // className="form-control"
                                                     className={
                                                       "form-control" +
                                                       (errors.request_status &&
                                                       touched.request_status
                                                         ? " is-invalid"
                                                         : "")
                                                     }
                                                     onChange={e => {
                                                       this.setState({
                                                         labAdvertisementRequest: {
                                                           id: labAdvertisementRequest.id,
                                                           request_status:
                                                             e.target.value,
                                                     
                                                         },
                                                       });
                                                     }}
                                                     multiple={false}
                                                     value={
                                                       this.state
                                                         .labAdvertisementRequest
                                                         .request_status
                                                     }
                                                   >
                                                     <option value="">
                                                       --- Please select
                                                       Status ---
                                                     </option>
                                                     <option value="Recreated">
                                                     ReCreated
                                                     </option>
                                                   
                                                   </Field>
                                                   <ErrorMessage
                                                     name="request_status"
                                                     component="div"
                                                     className="invalid-feedback"
                                                   />
                                                 </div>

                                                 {/* Certificate Title field */}
                                                 {/* {this.state.labAdvertisementRequest
                                                   .request_status ===
                                                   "Declined" && (
                                                   <div className="mb-3">
                                                     <Label className="form-label">
                                                       Declined Reason
                                                       <span className="text-danger font-size-12">
                                                         *
                                                       </span>
                                                     </Label>
                                                     <Field
                                                       name="declined_reason"
                                                       type="text"
                                                       value={
                                                         this.state
                                                           .labAdvertisementRequest
                                                           .declined_reason
                                                       }
                                                       onChange={e => {
                                                         this.setState({
                                                           labAdvertisementRequest:
                                                             {
                                                               id: labAdvertisementRequest.id,
                                                               request_status:
                                                               labAdvertisementRequest.request_status,
                                                                 declined_reason: e.target
                                                                 .value,
                                                               // responded_at:
                                                               //   labAdvertisementRequest.responded_at,
                                                                
                                                             },
                                                         });
                                                       }}
                                                       className={
                                                         "form-control" +
                                                         (errors.declined_reason &&
                                                         touched.declined_reason
                                                           ? " is-invalid"
                                                           : "")
                                                       }
                                                     />
                                                     <ErrorMessage
                                                       name="declined_reason"
                                                       component="div"
                                                       className="invalid-feedback"
                                                     />
                                                   </div>
                                                 )} */}
                                                  {this.state.labAdvertisementRequest
                                                   .request_status ===
                                                   "Recreated" && (
                                                   <div className="mb-3">
                                                     <Label className="form-label">
                                                       Posted Date
                                                     </Label>
                                                     <input
                                                       name="posted_at"
                                                       type="datetime-local"
                                                       min={new Date(
                                                         new Date().toString().split("GMT")[0] +
                                                           " UTC"
                                                       )
                                                         .toISOString()
                                                         .slice(0, -8)}
                                                       className="form-control"
                                                       onChange={e =>
                                                         this.setState({
                                                           id: labAdvertisementRequest.id,
                                                           request_status:
                                                           labAdvertisementRequest.request_status,
                                                           declined_reason: labAdvertisementRequest.declined_reason,
                                                           posted_till: labAdvertisementRequest.posted_till,
                                                           description: labAdvertisementRequest.description,
                                                           posted_at:
                                                             e.target.value,
                                                         })
                                                       }
                                                     />
                                                   </div>
                                                 )}
                                                  {this.state.labAdvertisementRequest
                                                   .request_status ===
                                                   "Recreated" && (
                                                   <div className="mb-3">
                                                     <Label className="form-label">
                                                       Posted till
                                                     </Label>
                                                     <input
                                                       name="posted_till"
                                                       type="datetime-local"
                                                       min={new Date(
                                                         new Date().toString().split("GMT")[0] +
                                                           " UTC"
                                                       )
                                                         .toISOString()
                                                         .slice(0, -8)}
                                                       className="form-control"
                                                       onChange={e =>
                                                         this.setState({
                                                           id: labAdvertisementRequest.id,
                                                           request_status:
                                                           labAdvertisementRequest.request_status,
                                                           declined_reason: labAdvertisementRequest.declined_reason,
                                                           posted_at: labAdvertisementRequest.posted_at,
                                                           description: labAdvertisementRequest.description,
                                                           posted_till:
                                                             e.target.value,
                                                         })
                                                       }
                                                     />
                                                   </div>

                                                 )}
                                                  {this.state.labAdvertisementRequest
                                                   .request_status ===
                                                   "Recreated" && (
                                                     <div className="mb-3">
                                                     <Label className="form-label">
                                                       Reason of ReCreated
                                                       <span className="text-danger font-size-12">
                                                         *
                                                       </span>
                                                     </Label>
                                                     <Field
                                                       name="declined_reason"
                                                       type="text"
                                                       value={
                                                         this.state
                                                           .labAdvertisementRequest
                                                           .description
                                                       }
                                                       onChange={e => {
                                                         this.setState({
                                                           labAdvertisementRequest:
                                                             {
                                                               id: labAdvertisementRequest.id,
                                                               request_status:
                                                               labAdvertisementRequest.request_status,
                                                               declined_reason: labAdvertisementRequest.declined_reason,
                                                               posted_at: labAdvertisementRequest.posted_at,
                                                               posted_till: labAdvertisementRequest.posted_till,
                                                               description:
                                                               e.target.value,
                                                                
                                                             },
                                                         });
                                                       }}
                                                       className={
                                                         "form-control" +
                                                         (errors.description &&
                                                         touched.description
                                                           ? " is-invalid"
                                                           : "")
                                                       }
                                                     />
                                                     <ErrorMessage
                                                       name="description"
                                                       component="div"
                                                       className="invalid-feedback"
                                                     />
                                                   </div>

                                                 )}

                                                
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

LabAdvertisementRequestsList.propTypes = {
  match: PropTypes.object,
  labAdvertisementRequests: PropTypes.array,
  className: PropTypes.any,
  onGetLabAdvertisementRequestsAccepted: PropTypes.func,
  onUpdateLabAdvertisementRequest: PropTypes.func,
};

const mapStateToProps = ({ labAdvertisementRequests }) => ({
  labAdvertisementRequests: labAdvertisementRequests.labAdvertisementRequests,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabAdvertisementRequestsAccepted: id => dispatch(getLabAdvertisementRequestsAccepted(id)),
 
  onUpdateLabAdvertisementRequest: labAdvertisementRequest =>
    dispatch(updateLabAdvertisementRequest(labAdvertisementRequest)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabAdvertisementRequestsList));
