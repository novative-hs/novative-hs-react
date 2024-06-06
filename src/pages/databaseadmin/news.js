import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter ,Link} from "react-router-dom";
import moment from "moment";
import { Card, CardBody, Col, Container, Row, Label, Button } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";

import { addNews, getNews } from "store/news/actions";

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
    };
  }

  componentDidMount() {
    this.props.onGetNews();
    this.setState({ news: this.props.news });
  }

  render() {
    const { news } = this.props;

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
                    {news.map((item, key) => (
                      <Card key={key} className="mb-2">
                      <CardBody>
                        {item.picture ? (
                          <Link
                            to={{
                              pathname: process.env.REACT_APP_BACKENDURL + item.picture,
                            }}
                            target="_blank"
                          >
                            <img
                              src={process.env.REACT_APP_BACKENDURL + item.picture}
                              alt={item.description || 'Image'}
                              style={{ 
                                cursor: 'pointer', 
                                height: '70px', 
                                width: '90px' 
                              }}
                            />
                          </Link>
                        ) : null}
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                        <p>
                          <b>Added by:</b> {item.added_by} <br />
                          <b>Date:</b> {moment(item.date_of_addition).format("DD MMM YYYY, h:mm A")}
                        </p>
                      </CardBody>
                    </Card>
                
                    ))}

                    <Formik
                      initialValues={{
                        title: "",
                        picture: "",
                        description: "",
                      }}
                      validationSchema={Yup.object().shape({
                        title: Yup.string().required("Title is required"),
                        description: Yup.string().required("Description is required"),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        const userId = localStorage.getItem("authUser")
                          ? JSON.parse(localStorage.getItem("authUser")).user_id
                          : "";
                        const newNews = {
                          title: values.title,
                          description: values.description,
                          picture: values.picture,
                          added_by: userId,
                        };
                        console.log('Submitting newNews:', newNews);
                        this.props.onAddNews(newNews);
                        resetForm();
                      }}
                    >
                      {({ errors, touched, setFieldValue }) => (
                        <Card style={{ backgroundColor: '#E8E7E7' }}>
                          <CardBody>
                            <Form>
                              <Row>
                                <Col className="col-12">
                                  <div className="mb-3">
                                    <Label className="form-label">Title</Label>
                                    <Field
                                      name="title"
                                      type="text"
                                      className={"form-control" + (errors.title && touched.title ? " is-invalid" : "")}
                                    />
                                    <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="mb-3">
                                    <Label className="form-label">Picture (optional)</Label>
                                    <input
                                      name="picture"
                                      type="file"
                                      className={"form-control" + (errors.picture && touched.picture ? " is-invalid" : "")}
                                      onChange={(event) => {
                                        setFieldValue("picture", event.currentTarget.files[0]);
                                      }}
                                    />
                                    <ErrorMessage name="picture" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="mb-3">
                                    <Label className="form-label">Description</Label>
                                    <Field
                                      name="description"
                                      as="textarea"
                                      rows="3"
                                      className={"form-control" + (errors.description && touched.description ? " is-invalid" : "")}
                                    />
                                    <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                  </div>
                                  <div className="text-end">
                                    <button type="submit" className="btn btn-success save-user" style={{ backgroundColor: '#0000CD', borderColor: '#0000CD' }}>
                                      Post
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Card>
                      )}
                    </Formik>
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
};

const mapStateToProps = (state) => ({
  news: state.news.news,
});

const mapDispatchToProps = (dispatch) => ({
  onGetNews: () => dispatch(getNews()),
  onAddNews: (news) => dispatch(addNews(news)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewsList));
