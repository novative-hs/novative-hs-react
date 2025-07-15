import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalBody,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";

import { getComments, addComments } from "store/news/actions";

import "assets/scss/table.scss";
import moment from "moment";

class Csrcomments extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      modal: false,
      modalTitle: "",
      modalText: "",
      modalImage: "",
      modalDate: "",
      user_id: localStorage.getItem("authUser")
        ? parseInt(JSON.parse(localStorage.getItem("authUser")).user_id)
        : null,

      newCommentText: "",
      isAddingComment: false,

      feedbackListColumns: [
        {
          text: "Id",
          dataField: "id",
          sort: true,
          formatter: (cellContent, row) => <>{row.id}</>,
        },
        {
          text: "Comments",
          dataField: "text",
          sort: true,
          formatter: (cellContent, row) => (
            <span
              onClick={e => {
                e.preventDefault();
                this.setState({
                  modal: true,
                  modalTitle: row.text,
                  modalText: row.description,
                  modalImage: row.picture
                    ? process.env.REACT_APP_BACKENDURL + row.picture
                    : "",
                  modalDate: moment(row.date_of_addition).format(
                    "DD MMM YYYY, h:mm A"
                  ),
                });
              }}
            >
              {row.text}
            </span>
          ),
        },
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          formatter: (cellContent, row) => (
            <span>
              {moment(row.date_of_addition).format("DD MMM YYYY, h:mm A")}
            </span>
          ),
        },
      ],
    };
  }

  componentDidMount() {
  const participantId = this.props.match.params.id; // get :id from /comments/:id
  if (participantId) {
    this.props.onGetComments(participantId);
    this.setState({ user_id: participantId }); // set it to state if needed elsewhere
  }
}


  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

handleAddComment = () => {
  const { newCommentText, user_id } = this.state;
  const { onAddComments } = this.props;

  if (!newCommentText.trim()) return;

  const commentData = {
    added_by: parseInt(
      localStorage.getItem("authUser") &&
        JSON.parse(localStorage.getItem("authUser")).user_id
    ),
    participant: parseInt(user_id),
    text: newCommentText.trim(),
  };

  this.setState({ newCommentText: "" });

  return new Promise((resolve, reject) => {
  onAddComments(commentData, resolve, reject);
})
  .then(() => {
    const organization_name = window.location.pathname.split("/")[1]; // safely extract org name

    this.props.history.push({
      pathname: `/${organization_name}/CSRroundpendingsubmission/${user_id}`,
      state: { shouldRefresh: true },
    });
  })
  .catch(error => {
    console.error("Failed to add comment:", error);
  });

}
  render() {
    const { SearchBar } = Search;
    const { news } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: news.length,
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
            <title>Comments</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Updates" breadcrumbItem="Comments" />

            {/* Add Comment Input + Button */}
            <Row className="mb-4">
              <Col md="8">
                <Input
                  type="textarea"
                  placeholder="Write your comment here..."
                  value={this.state.newCommentText}
                  onChange={e =>
                    this.setState({ newCommentText: e.target.value })
                  }
                />
              </Col>
              <Col md="4">
                <Button
                  color="primary"
                  disabled={!this.state.newCommentText.trim()} 
                  onClick={this.handleAddComment}
                >
                  Add Comment
                </Button>
              </Col>
            </Row>

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
                          data={news}
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

Csrcomments.propTypes = {
  news: PropTypes.array,
  onAddComments: PropTypes.func.isRequired,
  onGetComments: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
   match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired, // or PropTypes.number if your ID is a number
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = ({ news }) => ({
  news: news.news,
});

const mapDispatchToProps = dispatch => ({
     onAddComments: (data, resolve, reject) =>
    dispatch({ type: "ADD_COMMENTS", payload: data, resolve, reject }),
  onGetComments: id => dispatch(getComments(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Csrcomments));