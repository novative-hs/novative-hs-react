import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { getInstrumentDetail, getAnalytelist } from "store/databaseofunits/actions";
import { getSchemelist } from "store/scheme/actions";
import "assets/scss/table.scss";

class InstrumentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSchemes: {},
    };
  }

  componentDidMount() {
    this.fetchData();
    this.props.getAnalytelist();
    this.props.getSchemelist();
  }

  fetchData = () => {
    const { getInstrumentDetail, match } = this.props;
    const instrumentId = match.params.id;
    if (instrumentId) {
      getInstrumentDetail(instrumentId);
    }
  };

  handleCheckboxChange = (schemeId) => {
    this.setState(prevState => ({
      selectedSchemes: {
        ...prevState.selectedSchemes,
        [schemeId]: !prevState.selectedSchemes[schemeId],
      },
    }));
  };

  render() {
    const { InstrumentDetail } = this.props;
    const analytes = InstrumentDetail?.analytes || [];
    const schemes = InstrumentDetail?.schemes || [];

    const columns = [
      // {
      //   dataField: "id",
      //   text: "Analyte ID",
      //   headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
      //     <div>
      //       {filterElement} {/ Filter Input First /}
      //       <br /> {/ Line Break for Separation /}
      //       {column.text} {sortElement} {/ Column Name Below /}
      //     </div>
      //   ),
      //   filter: textFilter(),
      // },
      {
        dataField: "name",
        text: "Analyte Name",
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div>
            {filterElement}
            <br />
            {column.text} {sortElement}
          </div>
        ),
        filter: textFilter(),
      },
      // {
      //   dataField: "scheme_id",
      //   text: "Scheme ID",
      //   headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
      //     <div>
      //       {filterElement}
      //       <br />
      //       {column.text} {sortElement}
      //     </div>
      //   ),
      //   filter: textFilter(),
      // },
      {
        dataField: "scheme_name",
        text: "Scheme Name",
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div>
            {filterElement}
            <br />
            {column.text} {sortElement}
          </div>
        ),
        filter: textFilter(),
        sort: true,
      },
      {
        dataField: "select",
        text: "Select",
      }
      
    ];
    
    
    const tableData = analytes.flatMap(analyte => (
      schemes.map(scheme => {
        const isConnected = scheme.analytes?.split(",").some(id => id.trim() === analyte.id.toString());
        return {
          id: analyte.id,
          name: analyte.name,
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          select: isConnected ? (
            <input
              type="checkbox"
              checked={this.state.selectedSchemes[scheme.id] !== undefined ? this.state.selectedSchemes[scheme.id] : true}
              onChange={() => this.handleCheckboxChange(scheme.id)}
            />
          ) : "__",
        };
      })
    ));

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | EQUIPMENT DETAILS</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="EQUIPMENT DETAILS" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardHeader>
                    <h4 className="mb-0">Details for {InstrumentDetail?.name || "N/A"}</h4>
                  </CardHeader>
                  <CardBody>
                    <BootstrapTable
                      keyField="id"
                      data={tableData}
                      columns={columns}
                      filter={filterFactory()}
                      classes="table align-middle table-hover"
                      bordered={false}
                      striped
                      headerWrapperClasses="table-light"
                      responsive
                    />
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

InstrumentDetail.propTypes = {
  match: PropTypes.object.isRequired,
  getInstrumentDetail: PropTypes.func.isRequired,
  getAnalytelist: PropTypes.func.isRequired,
  getSchemelist: PropTypes.func.isRequired,
  InstrumentDetail: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    analytes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    schemes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

const mapStateToProps = state => ({
  InstrumentDetail: state.ListUnit?.InstrumentDetail || {},
});

const mapDispatchToProps = dispatch => ({
  getInstrumentDetail: id => dispatch(getInstrumentDetail(id)),
  getAnalytelist: () => dispatch(getAnalytelist()),
  getSchemelist: () => dispatch(getSchemelist()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InstrumentDetail));
