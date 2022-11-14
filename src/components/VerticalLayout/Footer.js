import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer">
          <Container fluid={true}>
            <Row>
              <Col md={7}>{new Date().getFullYear()} © Lab Hazir</Col>
              <Col md={1}>
                <div className="text-sm-end d-none d-sm-block">
                  <Link to="/disclaimer">
                    <span>Disclaimer</span>
                  </Link>
                </div>
              </Col>
              <Col md={1}>
                <div className="text-sm-end d-none d-sm-block">
                  <Link to="/about-us">
                    <span>About Us</span>
                  </Link>
                </div>
              </Col>

              <Col md={3}>
                <div className="text-sm-end d-none d-sm-block">
                  Welcome to Lab Hazir Family!
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </React.Fragment>
    );
  }
}

export default Footer;
