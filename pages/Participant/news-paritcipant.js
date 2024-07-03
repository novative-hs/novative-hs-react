import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

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

import { getNews } from "store/news/actions";

import "assets/scss/table.scss";
import moment from "moment";

class Manufactural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      news: [],
      newvar: "",
      modal: false,
      modalTitle: "", // State to store modal title
      modalText: "", // State to store modal text
      modalImage: "", // State to store modal picture URL
      modalDate: "", // State to store modal date
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      titleFilter: "",

      feedbackListColumns: [
        {
          text: "Id",
          dataField: "id",
          sort: true,
          // hidden: true,
          formatter: (cellContent, newvar) => <>{newvar.id}</>,
          // filter: textFilter(),
        },
        {
          text: "Title",
          dataField: "title",
          sort: true,
          // headerFormatter: (column, colIndex) => {
          //   return (
          //     <>
          //       <div>
          //         <input
          //           type="text"
          //           value={this.state.titleFilter}
          //           onChange={e => this.handleFilterChange("titleFilter", e)}
          //           className="form-control"
          //         />
          //       </div>
          //       <div>{column.text}</div>
          //     </>
          //   );
          // },
          formatter: (cellContent, row) => (
            <Link
              to="#"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  modal: true,
                  modalTitle: row.title, // Set the title based on row data
                  // modalText: `Some text related to ${row.title}`, // Set the text based on row data
                  modalText: row.description,
                  modalImage: row.picture
                    ? process.env.REACT_APP_BACKENDURL + row.picture
                    : "", // Set the picture URL based on row data
                  modalDate: moment(row.date_of_addition).format(
                    "DD MMM YYYY, h:mm A"
                  ), // Set the date based on row data
                });
              }}
            >
              {row.title}
            </Link>
          ),
        },
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          hidden: false,
          formatter: (cellContent, newvar) => (
            <>
              <span>
                {moment(newvar.date_of_addition).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
          // filter: textFilter(),
        },
        {
          text: "Description",
          dataField: "description",
          sort: true,
          hidden: true,
          filter: textFilter(),
        },
        {
          text: "Image",
          dataField: "picture",
          sort: true,
          formatter: (cellContent, newvar) => (
            <>
              {newvar.picture ? (
                <Link
                  to={{
                    pathname: process.env.REACT_APP_BACKENDURL + newvar.picture,
                  }}
                  target="_blank"
                >
                  View
                </Link>
              ) : (
                "---"
              )}
            </>
          ),
        },
      ],
    };
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  // Filter data based on filter values
  // filterData = () => {
  //   const { databaseadminList } = this.props;
  //   const { nameFilter, emailFilter, cnicFilter, idFilter } = this.state;
  //   const filteredData = databaseadminList.filter(entry =>
  //     entry.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
  //     entry.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
  //     entry.cnic.includes(cnicFilter) &&
  //     entry.phone.includes(phoneFilter)
  //   );
  //   return filteredData;
  // };
  componentDidMount() {
    const { news, onGetNews } = this.props;
    onGetNews(this.state.user_id);
    this.setState({ news });
  }

  componentDidUpdate(prevProps) {}

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
    const { news } = this.props;
    const { modal, modalTitle, modalText, modalImage, modalDate } = this.state;

    const { onGetNews } = this.props;
    const newvar = this.state.news;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: news.length, // replace later with size(newvar),
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
            <title>News</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Updates" breadcrumbItem="News" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={news}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={news} // Use filtered list here
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
        <Modal isOpen={modal} toggle={this.toggleModal}>
          {/* <ModalHeader toggle={this.toggleModal}>{modalTitle}</ModalHeader> */}
          <ModalBody>
            {modalImage && (
              <div className="text-center mb-3">
                <Card>
                  <CardBody>
                    {" "}
                    <img
                      src={modalImage}
                      alt="Modal"
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </CardBody>
                </Card>
              </div>
            )}
            <h4>{modalTitle}</h4>
            <p>{modalText}</p>
            <p className="text-muted text-center">---{modalDate}---</p>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

Manufactural.propTypes = {
  match: PropTypes.object,
  news: PropTypes.array,
  className: PropTypes.any,
  onGetNews: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  history: PropTypes.object.isRequired, // Add this line to define the history prop
};

const mapStateToProps = ({ news }) => ({
  news: news.news,
});

const mapDispatchToProps = dispatch => ({
  onGetNews: (id) => dispatch(getNews(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Manufactural));
