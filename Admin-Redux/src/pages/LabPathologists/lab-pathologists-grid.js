import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Card
import CardLabPathologist from "./card-lab-pathologist";

import { getUsers } from "../../store/contacts/actions";

class LabPathologistsGrid extends Component {
  componentDidMount() {
    const { users, onGetUsers } = this.props;
    if (users && !users.length) {
      onGetUsers();
    }
  }

  render() {
    const { users } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Pathologist Grid | Ilaaj4u Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Lab Pathologists"
              breadcrumbItem="Pathologists Grid"
            />

            <Row>
              {map(users, (user, contactkey) => (
                <CardLabPathologist user={user} key={"_user_" + contactkey} />
              ))}
            </Row>

            <Row>
              <Col xs="12">
                <div className="text-center my-3">
                  <Link to="#" className="text-success">
                    <i className="bx bx-hourglass bx-spin me-2" />
                    Load more
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabPathologistsGrid.propTypes = {
  users: PropTypes.array,
  onGetUsers: PropTypes.func,
};

const mapStateToProps = ({ contacts }) => ({
  users: contacts.users,
});

const mapDispatchToProps = dispatch => ({
  onGetUsers: () => dispatch(getUsers()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabPathologistsGrid));
