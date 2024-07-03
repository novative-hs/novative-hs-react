import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import Select from "react-select";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { Container, Col, Row } from "reactstrap";
import { getAnalytelist } from "store/databaseofunits/actions";
import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      ListUnit: [],
      selectedAnalyte: null,
      analyteOptions: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  //   componentDidMount() {
  //     const { ListUnit, onGetAnalyte } = this.props;
  //     onGetAnalyte(this.state.user_id);
  //     this.setState({ ListUnit });
  //   }
  componentDidMount() {
    const { onGetAnalyte } = this.props;
    onGetAnalyte(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    const { ListUnit } = this.props;
    if (prevProps.ListUnit !== ListUnit) {
      const analyteOptions = [
        { value: "All", label: "All" }, // Default option "All"
        ...ListUnit.map(analyte => ({
          value: analyte.name,
          label: analyte.name,
        })),
      ];
      this.setState({ analyteOptions });
    }
  }

  handleAnalyteChange = selectedAnalyte => {
    // Set selectedAnalyte to null if "All" is selected
    if (selectedAnalyte && selectedAnalyte.value === "All") {
      selectedAnalyte = null;
    }
    this.setState({ selectedAnalyte });
    // You can perform additional actions here based on the selected analyte
  };
  //   componentDidUpdate(prevProps, prevState, snapshot) {
  //     const { ListUnit } = this.props;
  //     if (!isEmpty(ListUnit) && size(prevProps.ListUnit) !== size(ListUnit)) {
  //       this.setState({ ListUnit: {}, isEdit: false });
  //     }
  //   }

  render() {
    const { selectedAnalyte, analyteOptions } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Analyte List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Analyte" breadcrumbItem="Analyte List" />
            {/* Select Dropdown for Analyte */}
            <Row>
              <Col xs="4" sm="4" md="3" lg="3">
                <Select
                  value={selectedAnalyte}
                  onChange={this.handleAnalyteChange}
                  options={analyteOptions}
                  placeholder="Select Analyte"
                />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ReagentsList.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  className: PropTypes.any,
  createInstrumentType: PropTypes.array,
  onGetAnalyte: PropTypes.func,
};

const mapStateToProps = ({ ListUnit }) => ({
  ListUnit: ListUnit.ListUnit,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyte: id => dispatch(getAnalytelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsList));
