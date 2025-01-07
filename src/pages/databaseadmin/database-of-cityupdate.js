import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Breadcrumbs from "components/Common/Breadcrumb";
import MetaTags from "react-meta-tags";
import { Container, Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, Label, Button } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { getData, addData } from "store/cityupdate/actions";

class CityUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tablelist: [],
      newTable: "",
      tablecreate: "",
      modal: false,
      nameFilter: "",
      idFilter: "",
      dateFilter: "",
      isEdit: false,
      successMessage: "",
      organization_name: "",
      errorMessage: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;

    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }

    const { tablelist, onGetData } = this.props;
    onGetData(this.state.user_id);
    this.setState({ tablelist });
  }

  handleFilterChange = (filterName, event) => {
    this.setState({ [filterName]: event.target.value });
  };

  filterData = () => {
    const { tablelist } = this.props;
    const { nameFilter, idFilter, dateFilter } = this.state;

    return tablelist.filter((entry) => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";
      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter) &&
        date.includes(dateFilter)
      );
    });
  };

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleAddDataClicks = () => {
    this.setState({ tablecreate: "", isEdit: false });
    this.toggleModal();
  };

  onClickAddData = (values) => {
    const addedBy = this.state.user_id;
  
    const tablecreate = {
      name: values.name,
      added_by: addedBy,  
    };
  
    if (!tablecreate.name || !tablecreate.added_by) {
      console.error("Missing required fields.");
      return;
    }
  
    console.log("Dispatching onAddData with:", tablecreate);
    this.props.onAddData(tablecreate);  // Dispatch with the correct organization_name
    this.toggleModal();
  };
  

  render() {
    const { nameFilter, idFilter, dateFilter, modal } = this.state;
    const filteredData = this.filterData();

    const columns = [
      {
        dataField: "id",
        text: "ID",
        sort: true,
        headerFormatter: (column) => (
          <>
            <div>
              <input
                type="text"
                value={idFilter}
                onChange={(e) => this.handleFilterChange("idFilter", e)}
                className="form-control"
              />
            </div>
            <div>{column.text}</div>
          </>
        ),
      },
      {
        dataField: "name",
        text: "Name",
        sort: true,
        headerFormatter: (column) => (
          <>
            <div>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => this.handleFilterChange("nameFilter", e)}
                className="form-control"
              />
            </div>
            <div>{column.text}</div>
          </>
        ),
      },
      {
        dataField: "date_of_addition",
        text: "Date Added",
        sort: true,
        formatter: (cellContent, row) => (
          <span>{moment(row.date_of_addition).format("DD MMM YYYY")}</span>
        ),
        headerFormatter: (column) => (
          <>
            <div>
              <input
                type="text"
                value={dateFilter}
                onChange={(e) => this.handleFilterChange("dateFilter", e)}
                className="form-control"
              />
            </div>
            <div>{column.text}</div>
          </>
        ),
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | New Table</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Data" breadcrumbItem="Data List" />
            <Row className="justify-content-center">
              <Col lg="auto" className="text-center">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      data={filteredData}
                      columns={columns}
                      search
                    >
                      {(toolkitProps) => (
                        <React.Fragment>
                          <Row className="mb-4">
                            <Col xl="12">
                              <div className="text-sm-end">
                                <Button
                                  style={{ background: "#0000CD" }}
                                  className="font-16 btn-block btn btn-primary"
                                  onClick={this.handleAddDataClicks}
                                >
                                  <i className="mdi mdi-plus-circle-outline me-1" />
                                  Add New Data
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          <div className="table-responsive">
                            <BootstrapTable
                              {...toolkitProps.baseProps}
                              defaultSorted={[
                                { dataField: "id", order: "asc" },
                              ]}
                              classes="table align-middle table-hover"
                              bordered={false}
                              striped
                              headerWrapperClasses="table-light"
                              responsive
                            />
                          </div>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                    <Modal isOpen={modal} toggle={this.toggleModal}>
                      <ModalHeader toggle={this.toggleModal}>
                        Add New Data
                      </ModalHeader>
                      <ModalBody>
                        <Formik
                          initialValues={{ name: "" }}
                          validationSchema={Yup.object({
                            name: Yup.string().required("Input required"),
                          })}
                          onSubmit={(values) => {
                            this.onClickAddData(values);
                          }}
                        >
                          {() => (
                            <Form>
                              <div className="form-group">
                                <Label>New Data</Label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name="name"
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <Row>
                                <Col>
                                  <div className="text-end">
                                    <button
                                      type="submit"
                                      className="btn btn-success save-user"
                                      style={{ background: "#0000CD" }}
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

CityUpdate.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      organization_name: PropTypes.string,
    }),
  }).isRequired,
  tablelist: PropTypes.array.isRequired,
  onGetData: PropTypes.func.isRequired,
  onAddData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tablelist: Array.isArray(state.cityReducer?.tablelist)
    ? state.cityReducer.tablelist
    : [],
});

const mapDispatchToProps = (dispatch) => ({
  onGetData: (id) => dispatch(getData(id)),
  onAddData: (tablecreate, id) => dispatch(addData(tablecreate, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CityUpdate));
