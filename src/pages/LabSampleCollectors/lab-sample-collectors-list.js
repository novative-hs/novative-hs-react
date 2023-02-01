import React, { Component } from "react";
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
  Modal,
  ModalHeader,

} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getSampleCollectors,
} from "store/sample-collectors/actions";

import { isEmpty, size } from "lodash";

class SampleCollectorsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      sampleCollectors: [],
      sampleCollector: "",
      apiURL: process.env.REACT_APP_BACKENDURL,
      collectorImg: "",
      modal: false,
      deleteModal: false,
      sampleCollectorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, sampleCollector) => (
            <>{sampleCollector.id}</>
          ),
        },
        {
          dataField: "img",
          text: "#",
          formatter: (cellContent, sampleCollector) => (
            <>
              {!sampleCollector.photo ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {sampleCollector.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    className="rounded-circle avatar-xs"
                    src={this.state.apiURL + sampleCollector.photo}
                    alt=""
                  />
                </div>
              )}
            </>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Phone No.",
          sort: true,
        },
      ],
    };
    this.handleSampleCollectorClick =
      this.handleSampleCollectorClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSampleCollectorClicks =
      this.handleSampleCollectorClicks.bind(this);
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
    const { sampleCollectors, onGetSampleCollectors } = this.props;
    if (sampleCollectors && !sampleCollectors.length) {
      onGetSampleCollectors();
    }
    this.setState({ sampleCollectors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleSampleCollectorClicks = () => {
    this.setState({ sampleCollector: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { sampleCollectors } = this.props;
    if (
      !isEmpty(sampleCollectors) &&
      size(prevProps.sampleCollectors) !== size(sampleCollectors)
    ) {
      this.setState({ sampleCollectors: {}, isEdit: false });
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

  handleSampleCollectorClick = (e, arg) => {
    const sampleCollector = arg;

    this.setState({
      sampleCollector: {
        id: sampleCollector.id,
        name: sampleCollector.name,
        cnic: sampleCollector.cnic,
        phone: sampleCollector.phone,
        photo: this.state.apiURL + sampleCollector.photo,
      },
      collectorImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { sampleCollectors } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetSampleCollectors,
    } = this.props;
    const { selectedSampleCollector } = this.state;
    const sampleCollector = this.state.sampleCollector;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: sampleCollectors.length, // replace later with size(sampleCollectors),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Sample Collectors List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Sample Collectors"
              breadcrumbItem="Collectors List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.sampleCollectorListColumns}
                      data={sampleCollectors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.sampleCollectorListColumns}
                          data={sampleCollectors}
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
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
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
                                          ? "Edit Sample Collector"
                                          : "Add Sample Collector"}
                                      </ModalHeader>
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

SampleCollectorsList.propTypes = {
  match: PropTypes.object,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onGetSampleCollectors: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSampleCollectors: () =>
    dispatch(getSampleCollectors(ownProps.match.params.id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SampleCollectorsList));
