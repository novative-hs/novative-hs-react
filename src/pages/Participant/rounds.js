import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
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

import { getManufacturalList } from "store/manufactural/actions";
import { isEmpty, size, uniq } from "lodash";
import { Tooltip } from "@material-ui/core";
import "assets/scss/table.scss";
import moment from "moment";
import Select from "react-select";

class Manufactural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      ManufacturalList: [],
      manufact: "",
      rating: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      nameOptions: [],
      selectedName: "All", // Add this state to keep track of the selected name
      //Filters
      cityFilter: "",
      nameFilter: "",
      added_byFilter: "",
      date_of_additionFilter: "",
      telephoneFilter: "",
      addressFilter: "",
      countryFilter: "",
      //Sorting
      nameSort: "asc",
      citySort: "asc",
      added_bySort: "asc",
      dateSort: "asc",
      telephoneSort: "asc",
      addressSort: "asc",
      countrySort: "asc",
      //Array of objects
      feedbackListColumns: [
        {
          text: "Id",
          dataField: "id",
          sort: true,
          hidden: true,

          formatter: (cellContent, manufact) => <>{manufact.id}</>,
          // filter: textFilter(),
        },
        {
          text: "Name",
          dataField: "name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange("nameFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.nameSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("name")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          // filter: textFilter(),
        },
        {
          text: "Added_by",
          dataField: "added_by",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.added_byFilter}
                    onChange={e => this.handleFilterChange("added_byFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text} {column.sort ? (
                    <i
                      className={
                        this.state.added_bySort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("added_by")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },

          // filter: textFilter(),
        },
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          hidden: false,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.date_of_additionFilter}
                    onChange={e =>
                      this.handleFilterChange("date_of_additionFilter", e)
                    }
                    className="form-control"
                  />
                </div>
                <div>{column.text} {column.sort ? (
                    <i
                      className={
                        this.state.dateSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("date_of_addition")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },
          formatter: (cellContent, manufact) => (
            <>
              <span>
                {moment(manufact.date_of_addition).format(
                  "DD MMM YYYY, h:mm A"
                )}
              </span>
            </>
          ),
          // filter: textFilter(),
        },
        {
          text: "Telephone",
          dataField: "telephone",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.telephoneFilter}
                    onChange={e =>
                      this.handleFilterChange("telephoneFilter", e)
                    }
                    className="form-control"
                  />
                </div>
                <div>{column.text}{column.sort ? (
                    <i
                      className={
                        this.state.telephoneSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("telephone")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },
          // filter: textFilter(),
        },
        {
          text: "Address",
          dataField: "address",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.addressFilter}
                    onChange={e => this.handleFilterChange("addressFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text} {column.sort ? (
                    <i
                      className={
                        this.state.addressSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("address")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },
          // filter: textFilter(),
        },
        {
          text: "City",
          dataField: "city",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.cityFilter}
                    onChange={e => this.handleFilterChange("cityFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}{column.sort ? (
                    <i
                      className={
                        this.state.citySort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("city")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },

          // filter: textFilter(),
        },
        {
          text: "Country",
          dataField: "country",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.countryFilter}
                    onChange={e => this.handleFilterChange("countryFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text} {column.sort ? (
                    <i
                      className={
                        this.state.countrySort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("country")}
                    ></i>
                  ) : null}</div>
              </>
            );
          },

          // filter: textFilter(),
        },

        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, manufact) => (
        //     <Col>
        //       <Tooltip title="Update">
        //         <Link className="text-success" to="#">
        //           <i
        //             className="mdi mdi-pencil font-size-18"
        //             id="edittooltip"
        //             // onClick={() => this.handleEditBtnClick(manufact)}
        //           ></i>
        //         </Link>
        //       </Tooltip>
        //       <Tooltip title="Add Comment">
        //         <Link
        //           className="fas fa-comment font-size-18"
        //           // to={`/csr-notes-complains/${complaint.id}`}
        //         ></Link>
        //       </Tooltip>
        //     </Col>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this); // Bind the handler
  }

  componentDidMount() {
    const { ManufacturalList, ongetManufacturalList } = this.props;
    ongetManufacturalList(this.state.user_id);
    this.setState({ ManufacturalList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  // Filter data based on filter values
  filterData = () => {
    const { ManufacturalList } = this.props;
    const {
      nameFilter,
      cityFilter,
      countryFilter,
      addressFilter,
      added_byFilter,
      date_of_additionFilter,
      telephoneFilter,
    } = this.state;

    const filteredData = ManufacturalList.filter(entry => {
      const name = entry.name ? entry.name.toLowerCase() : "";
      const city = entry.city ? entry.city.toLowerCase() : "";
      const country = entry.country ? entry.country.toLowerCase() : "";
      const address = entry.address ? entry.address.toLowerCase() : "";
      const added_by = entry.added_by ? entry.added_by.toLowerCase() : "";
      const date_of_addition = entry.date_of_addition
        ? entry.date_of_addition.toString()
        : "";
      const telephone = entry.telephone ? entry.telephone.toString() : "";
      return (
        name.includes(nameFilter.toLowerCase()) &&
        city.includes(cityFilter.toLowerCase()) &&
        country.includes(countryFilter.toLowerCase()) &&
        address.includes(addressFilter.toLowerCase()) &&
        added_by.includes(added_byFilter.toLowerCase()) &&
        date_of_addition.includes(date_of_additionFilter) &&
        telephone.includes(telephoneFilter)
      );
    });

    return filteredData;
  };
  // sorting the data
  handleSort = field => {
    const newSortOrder = this.state[field + "Sort"] === "asc" ? "desc" : "asc";
    this.setState({ [field + "Sort"]: newSortOrder }, () => {
      this.sortData(field, newSortOrder);
    });
  };

  sortData = (field, order) => {
    const { ManufacturalList } = this.state;
    if (!Array.isArray(ManufacturalList)) {
      return;
    }

    const sortedData = [...ManufacturalList].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Ensure both values are strings for case-insensitive comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    this.setState({ ManufacturalList: sortedData });
  };
  componentDidUpdate(prevProps) {
    const { ManufacturalList } = this.props;
    if (
      ManufacturalList !== prevProps.ManufacturalList &&
      !isEmpty(ManufacturalList)
    ) {
      const uniqueNames = uniq(ManufacturalList.map(item => item.name));
      this.setState({ nameOptions: ["All", ...uniqueNames] });
    }
  }

  // handleNameFilterChange(event) {
  //   this.setState({ selectedName: event.target.value });
  // }

  handleNameFilterChange(selectedOption) {
    // selectedOption will be an object { value: 'selectedValue', label: 'selectedLabel' }
    this.setState({
      selectedName: selectedOption ? selectedOption.value : "All",
    });
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

    const { ManufacturalList } = this.props;
    const { nameOptions, selectedName } = this.state;

    const { ongetManufacturalList } = this.props;
    const manufact = this.state.ManufacturalList;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: ManufacturalList.length, // replace later with size(manufact),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // Filter ManufacturalList based on the selectedName
    const filteredManufactList =
      selectedName === "All"
        ? ManufacturalList
        : ManufacturalList.filter(manufact => manufact.name === selectedName);

    const methodsName = nameOptions.map(name => ({ value: name, label: name }));
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Labs Rating List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="" breadcrumbItem="" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      // data={ManufacturalList}
                      data={filteredManufactList} // Use filtered list here
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredManufactList} // Use filtered list here
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                {/* <Col sm="3" lg="3">
                                  <div className="ms-2 mb-4">
                                    <div className="">
                                      <div>
                                        <Label
                                          for="nameFilter"
                                          className="form-label"
                                        >
                                          <strong>Search Type</strong>
                                        </Label>
                                        <select
                                          className="form-select"
                                          // name="nameFilter"
                                          id="nameFilter"
                                          value={selectedName}
                                          onChange={this.handleNameFilterChange}
                                          // size={5} // Set the size here
                                          // style={{ height: '50px' }} // Set the desired height here
                                        >
                                          {nameOptions.map(name => (
                                            <option key={name} value={name}>
                                              {name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-danger font-size-10">
                                          Filter the names
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Col> */}
                                <Col xs="4" sm="4" md="3" lg="3">
                                  <div className="mb-3">
                                    <Select
                                      onChange={this.handleNameFilterChange}
                                      options={methodsName}
                                      placeholder="Select Name..."
                                      isSearchable={true}
                                      isClearable={true}
                                      value={methodsName.find(
                                        option => option.value === selectedName
                                      )} // Find the matching option
                                      styles={{
                                        control: (provided, state) => ({
                                          ...provided,
                                          border: "2px solid blue",
                                          borderRadius: "5px",
                                        }),
                                        // Add more style overrides as needed
                                      }}
                                    />
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
                                      // filter={filterFactory()}
                                      data={this.filterData()}
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

Manufactural.propTypes = {
  match: PropTypes.object,
  ManufacturalList: PropTypes.array,

  className: PropTypes.any,
  ongetManufacturalList: PropTypes.func,

  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ ManufacturalList }) => ({
  ManufacturalList: ManufacturalList.ManufacturalList,
});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   ongetManufacturalList: () => dispatch(getManufacturalList()),
// });

const mapDispatchToProps = dispatch => ({
  ongetManufacturalList: user_id => dispatch(getManufacturalList(user_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Manufactural));
