import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Search } from "react-bootstrap-table2-toolkit";
import moment from "moment";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getResultHistory } from "store/registrationdmin-history/actions";
import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class MsgsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogResults: [],
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetActivityLogResults } = this.props;
    // Get 'id' from route params
    const id = this.props.match.params.id;

    const queryParams = new URLSearchParams(this.props.location.search);
    const participantId = queryParams.get('participantId'); // Extract participantId from query params
    const scheme_id = queryParams.get('scheme_id'); 
    
  console.log("participantIddd",id, participantId, scheme_id)

    if (id && participantId && scheme_id) {
      // Pass both id and type to the action
      onGetActivityLogResults(id, participantId, scheme_id);
      
    } else {
      console.error("ID  missing in the request.");
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidUpdate(prevProps) {
    const { activitylogResults } = this.props;
    console.log("activitylogResults ARRAY", activitylogResults)
    if (
      !isEmpty(activitylogResults) &&
      size(prevProps.activitylogResults) !== size(activitylogResults)
    ) {
      this.setState({ activitylogResults: {}, isEdit: false });
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

  render() {
    const { SearchBar } = Search;
    const { activitylogResults } = this.props;
    const { isEdit, deleteModal } = this.state;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogResults ? activitylogResults.length : 0,
      custom: true,
    };
    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const statusColors = {
      'Created': 'green',
      'Submitted': 'red',
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> History | Rounds</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="History" breadcrumbItem="Activity Log" />
            <Row>
              <Col lg="8" className="offset-lg-2">
                <Card className="mb-2 d-flex justify-content-center">
                  <CardBody>
                    {!isEmpty(this.props.activitylogResults) &&
                      this.props.activitylogResults.map(
                        (activitylogResults, key) => {
                          // Determine the status color
                          const statusColor =
                            statusColors[activitylogResults.status] || "gray"; // Default color

                            return (
                              <Card
                                key={"_card_" + key}
                                className="mb-2"
                                style={{
                                  backgroundColor: "#f2f2f2",
                                  borderLeft: `5px solid ${statusColor}`,
                                }}
                              >
                                <CardBody className="p-3">
                                  <div style={{ marginBottom: "10px" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      {activitylogResults.actions === "Updated" ? "Update" : "Addition"}
                                    </span>
                                    </div>
                                    <div>
                                      <span>Status:</span>
                                    <span
                                      style={{
                                        color: statusColor,
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {activitylogResults.status}
                                    </span>
                                  </div>
                            
                                  <div style={{ marginBottom: "10px" }}>
                                    <span >Analyte: </span>
                                    <span className="text-info">{activitylogResults.analyte_id}</span>
                                  </div>
                            
                                  {activitylogResults.actions === "Updated" && (
                                    <div>
                                      <b>{`${activitylogResults.added_by}`}</b> Updated from{" "}
                                      <b>{activitylogResults.old_value}</b> to{" "}
                                      <b>{activitylogResults.new_value}</b> at{" "}
                                      {moment(activitylogResults.date_of_updation).format(
                                        "DD MMM YYYY, h:mm A"
                                      )}{" "}
                                      with Round ID <b>{activitylogResults.round_id}</b>
                                    </div>
                                  )}
                            
                                  {activitylogResults.actions === "Added" && (
                                    <div>
                                      <b>{`${activitylogResults.added_by}`}</b> Added result{" "}
                                      <b>{activitylogResults.new_value}</b> at{" "}
                                      {moment(activitylogResults.date_of_addition).format(
                                        "DD MMM YYYY, h:mm A"
                                      )}{" "}
                                      with Round ID <b>{activitylogResults.round_id}</b>.
                                    </div>
                                  )}
                                </CardBody>
                              </Card>
                            );
                        }
                      )}

                    {isEmpty(this.props.activitylogResults) && (
                      <Row>
                        <Col lg="12">
                          <div className=" mb-5">
                            <h5 className="text-uppercase">
                              No Comments exists.....
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    )}
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

MsgsList.propTypes = {
  match: PropTypes.object,
  activitylogResults: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogResults: PropTypes.func,
  location: PropTypes.object,
};

const mapStateToProps = ({ activitylogRounds }) => ({
  activitylogResults: activitylogRounds.activitylogResults,
});

const mapDispatchToProps = dispatch => ({
  onGetActivityLogResults: (id, participantId, scheme_id) => dispatch(getResultHistory(id, participantId, scheme_id)), // Pass id and type here
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));
