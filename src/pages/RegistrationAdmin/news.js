import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";

import { addNews, getNews, updateNews, deleteNews } from "store/news/actions";

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      showEditModal: false,
      selectedNews: null,
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "";
    this.props.onGetNews(userId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.news !== this.props.news) {
      this.setState({ news: this.props.news });
    }
  }
  handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      await this.props.onDeleteNews(id); // wait for deletion to finish

      const userId = localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "";

      await this.props.onGetNews(userId); // refresh news list after delete
    }
  };

  openEditModal = newsItem => {
    this.setState({ selectedNews: newsItem, showEditModal: true });
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false, selectedNews: null });
  };

  render() {
    const { news, onAddNews, onUpdateNews } = this.props;
    const { showEditModal, selectedNews } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | News</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="News" breadcrumbItem="News List" />

            <Row className="mb-2 d-flex justify-content-center">
              <Col lg="8">
                <Card>
                  <CardBody>
                    {news && news.length > 0 ? (
                      news.map((item, key) => (
                        <Card key={key} className="mb-2">
                          <CardBody>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                            <p>
                              <b>Added by:</b> {item.added_by} <br />
                              <b>Date:</b>{" "}
                              {moment(item.date_of_addition).format(
                                "DD MMM YYYY, h:mm A"
                              )}
                            </p>
                            <Button
                              color="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => this.openEditModal(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => this.handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </CardBody>
                        </Card>
                      ))
                    ) : (
                      <div>No news available.</div>
                    )}

                    {/* ADD Form */}
                    <Formik
                      initialValues={{ title: "", description: "" }}
                      validationSchema={Yup.object().shape({
                        title: Yup.string().required("Title is required"),
                        description: Yup.string().required(
                          "Description is required"
                        ),
                      })}
                      onSubmit={async (values, { resetForm }) => {
                        const userId = localStorage.getItem("authUser")
                          ? JSON.parse(localStorage.getItem("authUser")).user_id
                          : "";

                        const newData = {
                          title: values.title,
                          description: values.description,
                          added_by: userId,
                        };

                        await onAddNews(newData); // Wait for the post request to complete
                        await this.props.onGetNews(userId); // Refresh the list

                        resetForm(); // Clear the form
                      }}
                    >
                      {({ errors, touched }) => (
                        <Card style={{ backgroundColor: "#E8E7E7" }}>
                          <CardBody>
                            <Form>
                              <Row>
                                <Col className="col-12">
                                  <div className="mb-3">
                                    <Label>Title</Label>
                                    <Field
                                      name="title"
                                      type="text"
                                      className={
                                        "form-control" +
                                        (errors.title && touched.title
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>

                                  <div className="mb-3">
                                    <Label>Description</Label>
                                    <Field
                                      name="description"
                                      as="textarea"
                                      rows="3"
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

                                  <div className="text-end">
                                    <Button type="submit" color="primary">
                                      Post
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Card>
                      )}
                    </Formik>

                    {/* Edit Modal */}
                    <Modal isOpen={showEditModal} toggle={this.closeEditModal}>
                      <ModalHeader toggle={this.closeEditModal}>
                        Edit News
                      </ModalHeader>
                      <Formik
                        enableReinitialize
                        initialValues={{
                          title: selectedNews?.title || "",
                          description: selectedNews?.description || "",
                        }}
                        validationSchema={Yup.object().shape({
                          title: Yup.string().required("Title is required"),
                          description: Yup.string().required(
                            "Description is required"
                          ),
                        })}
                        onSubmit={async (values, { resetForm }) => {
                          const userId = localStorage.getItem("authUser")
                            ? JSON.parse(localStorage.getItem("authUser"))
                                .user_id
                            : "";

                          const updatedData = {
                            id: selectedNews.id,
                            title: values.title,
                            description: values.description,
                            added_by: userId,
                          };

                          await onUpdateNews(updatedData); // Wait for update to complete
                          await this.props.onGetNews(userId); // Then refresh news

                          this.closeEditModal();
                          resetForm();
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form>
                            <ModalBody>
                              <div className="mb-3">
                                <Label>Title</Label>
                                <Field
                                  name="title"
                                  type="text"
                                  className={
                                    "form-control" +
                                    (errors.title && touched.title
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="title"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="mb-3">
                                <Label>Description</Label>
                                <Field
                                  name="description"
                                  as="textarea"
                                  rows="3"
                                  className={
                                    "form-control" +
                                    (errors.description && touched.description
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
                            </ModalBody>
                            <ModalFooter>
                              <Button type="submit" color="primary">
                                Update
                              </Button>
                              <Button
                                type="button"
                                color="secondary"
                                onClick={this.closeEditModal}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Form>
                        )}
                      </Formik>
                    </Modal>
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

NewsList.propTypes = {
  news: PropTypes.array,
  onGetNews: PropTypes.func.isRequired,
  onAddNews: PropTypes.func.isRequired,
  onUpdateNews: PropTypes.func.isRequired,
  onDeleteNews: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.news,
});

const mapDispatchToProps = dispatch => ({
  onGetNews: id => dispatch(getNews(id)),
  onAddNews: news => dispatch(addNews(news)),
  onUpdateNews: news => dispatch(updateNews(news)),
  onDeleteNews: id => dispatch(deleteNews(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewsList));
