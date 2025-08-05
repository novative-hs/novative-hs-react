import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

// Actions
import { getMicroData, addMicroData } from "store/databaseofunits/actions";

class DatabaseOfMicro extends Component {
  state = {
    user_id: "",
    selectedEquipment: {},
    selectedReagents: {},
    equipmentModal: false,
    reagentModal: false,
    version: 0,
    equipmentSearch: "", // ✅ required
    reagentSearch: "", // ✅ required
  };

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (user?.user_id) {
      this.setState({ user_id: user.user_id, organization_name }, () => {
        this.props.getMicroData(user.user_id);
      });
    } else {
      console.error("❌ User ID is undefined or null.");
    }
  }
  componentDidUpdate(prevProps) {
    const newState = {};

    // 🔍 Log when addedMicrobiology updates
    if (prevProps.addedMicrobiology !== this.props.addedMicrobiology) {
      console.log(
        "🧪 Updated addedMicrobiology:",
        this.props.addedMicrobiology
      );
    }

    // Check equipment updates
    if (
      prevProps.equipmentList !== this.props.equipmentList &&
      this.props.equipmentList.length > 0
    ) {
      const selectedEquipment = {};
      const addedEquipIds = new Set(
        (this.props.addedMicrobiology || [])
          .filter(item => item.equipment_name && item.equipment_name !== "null")
          .map(item => item.id)
      );

      this.props.equipmentList.forEach(eq => {
        selectedEquipment[eq.id] = addedEquipIds.has(eq.id);
      });

      newState.selectedEquipment = selectedEquipment;
    }

    // Check reagent updates
    if (
      prevProps.reagentList !== this.props.reagentList &&
      this.props.reagentList.length > 0
    ) {
      const selectedReagents = {};
      const addedReagentIds = new Set(
        (this.props.addedMicrobiology || [])
          .filter(item => item.reagent_name && item.reagent_name !== "null")
          .map(item => item.id)
      );

      this.props.reagentList.forEach(re => {
        selectedReagents[re.id] = addedReagentIds.has(re.id);
      });

      newState.selectedReagents = selectedReagents;
    }

    // Apply updated selections
    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  toggleModal = type => {
    this.setState(prevState => ({
      [`${type}Modal`]: !prevState[`${type}Modal`],
    }));
  };

  handleCheckbox = (type, id) => {
    this.setState(prev => ({
      [`selected${type}`]: {
        ...prev[`selected${type}`],
        [id]: !prev[`selected${type}`][id],
      },
      version: prev.version + 1,
    }));
  };
  submitMicrobiologyData = () => {
    const selectedEquipment = Object.entries(this.state.selectedEquipment)
      .filter(([_, val]) => val)
      .map(([id]) => {
        const eq = this.props.equipmentList.find(e => e.id.toString() === id);
        return eq ? { id: eq.id, name: eq.name } : null;
      })
      .filter(Boolean);

    const selectedReagents = Object.entries(this.state.selectedReagents)
      .filter(([_, val]) => val)
      .map(([id]) => {
        const r = this.props.reagentList.find(re => re.id.toString() === id);
        return r ? { id: r.id, name: r.name } : null;
      })
      .filter(Boolean);

    this.props.saveSelectedEquipment(
      { equipment: selectedEquipment, reagent: selectedReagents },
      this.state.user_id
    );

    // ✅ Re-fetch the updated microbiology data after save
    setTimeout(() => {
      this.props.getMicroData(this.state.user_id);
    }, 300); // short delay to wait for backend save
  };

  renderTable = (items, type) => {
    const isEquipment = type === "equipment";
    const columns = [
      {
        dataField: "id",
        text: "ID",
        sort: true,
        style: { textAlign: "center" }, // Center cell text
        headerStyle: { textAlign: "center", verticalAlign: "middle" }, // Center header text
        filter: textFilter({
          placeholder: "Filter ID",
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              {column.text} {sortElement}
            </div>
            <div style={{ width: "100%" }}>{filterElement}</div>
          </div>
        ),
      },

      {
        dataField: "name",
        text: isEquipment ? "Equipment Name" : "Reagent Name",
        sort: true,
        style: { textAlign: "center" },

        headerStyle: { textAlign: "center", verticalAlign: "middle" },
        filter: textFilter({
          placeholder: isEquipment ? "Filter Equipment" : "Filter Reagent",
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              gap: "10px",
            }}
          >
            <div style={{ width: "150px" }}>{filterElement}</div>
            <div>
              {column.text} {sortElement}
            </div>
          </div>
        ),
      },

      {
        dataField: "select",
        text: "Select",
        style: { textAlign: "left" },
        formatter: (cell, row) => {
          const checked = isEquipment
            ? !!this.state.selectedEquipment?.[row.id]
            : !!this.state.selectedReagents?.[row.id];

          const handleChange = () =>
            this.handleCheckbox(isEquipment ? "Equipment" : "Reagents", row.id);

          return (
            <input type="checkbox" checked={checked} onChange={handleChange} />
          );
        },
        headerStyle: { width: "120px" },
      },
    ];

    return (
      <ToolkitProvider keyField="id" data={items} columns={columns}>
        {toolkitprops => (
          <BootstrapTable
            key={this.state.version}
            {...toolkitprops.baseProps}
            classes="table table-bordered table-hover"
            bordered={false}
            striped
            filter={filterFactory()}
          />
        )}
      </ToolkitProvider>
    );
  };
  renderAddedMicrobiology = type => {
    const isEquipment = type === "equipment";
    const searchKey = isEquipment
      ? this.state.equipmentSearch
      : this.state.reagentSearch;

    const list = (this.props.addedMicrobiology || []).filter(item =>
      isEquipment
        ? item.equipment_name && item.equipment_name !== "null"
        : item.reagent_name && item.reagent_name !== "null"
    );

    const filteredList = list.filter(item => {
      const name = isEquipment ? item.equipment_name : item.reagent_name;
      return name.toLowerCase().includes(searchKey.toLowerCase());
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "1000px",
            textAlign: "right",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder={`Filter ${isEquipment ? "Equipment" : "Reagent"}`}
            value={searchKey}
            onChange={e =>
              this.setState({
                [isEquipment ? "equipmentSearch" : "reagentSearch"]:
                  e.target.value,
              })
            }
            style={{
              padding: "6px",
              width: "250px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <table
          className="table table-bordered table-striped"
          style={{ width: "90%", maxWidth: "1000px" }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>
                {isEquipment ? "Equipment Name" : "Reagent Name"}
              </th>
              <th style={{ textAlign: "center" }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map(item => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>{item.id}</td>
                  <td style={{ textAlign: "left" }}>
                    {isEquipment ? item.equipment_name : item.reagent_name}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { equipmentList, reagentList } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Micro Setup</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Database"
              breadcrumbItem="Micro Configuration"
            />

            {/* Added Equipment */}
            <Row>
              <Col>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Card
                    className="mb-4"
                    style={{ width: "60%", maxWidth: "700px" }}
                  >
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Added Equipment</h5>
                        <Button
                          color="primary"
                          onClick={() => this.toggleModal("equipment")}
                        >
                          <i className="mdi mdi-plus"></i> Add Equipment
                        </Button>
                      </div>
                      {this.renderAddedMicrobiology("equipment")}
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Added Reagents */}
            <Row>
              <Col>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Card
                    className="mb-4"
                    style={{ width: "60%", maxWidth: "700px" }}
                  >
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Added Reagents</h5>
                        <Button
                          color="primary"
                          onClick={() => this.toggleModal("reagent")}
                        >
                          <i className="mdi mdi-plus"></i> Add Reagent
                        </Button>
                      </div>
                      {this.renderAddedMicrobiology("reagent")}
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Equipment Modal */}
            <Modal
              isOpen={this.state.equipmentModal}
              toggle={() => this.toggleModal("equipment")}
              size="lg"
            >
              <ModalHeader toggle={() => this.toggleModal("equipment")}>
                Select Equipment
              </ModalHeader>
              <ModalBody>
                {this.renderTable(equipmentList, "equipment")}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  onClick={() => {
                    this.submitMicrobiologyData();
                    this.toggleModal("equipment");
                  }}
                >
                  Save Equipment
                </Button>
              </ModalFooter>
            </Modal>

            {/* Reagent Modal */}
            <Modal
              isOpen={this.state.reagentModal}
              toggle={() => this.toggleModal("reagent")}
              size="lg"
            >
              <ModalHeader toggle={() => this.toggleModal("reagent")}>
                Select Reagents
              </ModalHeader>
              <ModalBody>{this.renderTable(reagentList, "reagent")}</ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  onClick={() => {
                    this.submitMicrobiologyData();
                    this.toggleModal("reagent");
                  }}
                >
                  Save Reagents
                </Button>
              </ModalFooter>
            </Modal>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

DatabaseOfMicro.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  equipmentList: PropTypes.array,
  reagentList: PropTypes.array,
  addedMicrobiology: PropTypes.array,
  getMicroData: PropTypes.func,
  saveSelectedEquipment: PropTypes.func,
};

const mapStateToProps = state => ({
  equipmentList: state.ListUnit.equipmentList || [],
  reagentList: state.ListUnit.reagentList || [],
  addedMicrobiology: state.ListUnit.addedMicrobiology || [],
});

const mapDispatchToProps = dispatch => ({
  getMicroData: id => dispatch(getMicroData(id)),
  saveSelectedEquipment: (selected, id) => dispatch(addMicroData(selected, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DatabaseOfMicro));
