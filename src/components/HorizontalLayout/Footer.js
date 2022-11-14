import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={4}>{new Date().getFullYear()} © Lab Hazir</Col>
            <Col md={3}>
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
            <Col md={1}>
              <div className="text-sm-end d-none d-sm-block">
              <a href="https://www.linkedin.com/company/lab-hazir/">
                <i className="bx bxl-linkedin bx-tada align-middle me-2 font-size-40" />{" "}
              </a>
              <a href="https://www.facebook.com/profile.php?id=100084984286550">
                <i className="bx bxl-facebook bx-tada align-middle me-2 font-size-40" />{" "}
              </a>
              </div>
            </Col>

            <Col md={3}>
              <div className="text-sm-end d-none d-sm-block">
                Welcome to Lab Hazir Family!
              
              </div>
            </Col>
            {/* <Col>
            <div className="social-container">
              <h3>Social Follow</h3>
              <a href="https://www.youtube.com/c/jamesqquick">
                <i className="bx bxl-youtube bx-tada align-middle me-2 font-size-30" />{" "}
              </a>
            </div>
            </Col> */}
          </Row>

        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;