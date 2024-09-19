import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import logo from "../../assets/images/neqas-logo.jpeg";
const Footer = () => {
  // Media query checks for responsiveness
  const isLargeScreen = window.innerWidth > 768;
  const isSmallScreen = window.innerWidth >= 576 && window.innerWidth <= 768;
  const isExtraSmallScreen = window.innerWidth < 576;

  // Styles for the fixed footer on large screens
  const largFixFooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
  };
  const extrasmallFixFooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "8px",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <footer className="footer">
      <Container fluid={true}>
        {isLargeScreen && (
          <Row>
            
            <div style={{ background: "#0000CD", height: "30px", fontWeight: "bold" }}>
              <Col className="text-white text-center fonr-size-12 mt-1">
                {new Date().getFullYear()} © NHS NEQAS . All Rights Reserved
              </Col>
            </div>
          </Row>
        )}

        {/* Footer for small screens */}
        {isSmallScreen && (
          <Row style={largFixFooter} className="footer">
            {/* Add your small screen footer content here */}
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-start" style={{ fontWeight: "bold" }}>
                {new Date().getFullYear()} © NHS NEQAS . All Rights Reserved
              </div>
            </Col>
            
          </Row>
        )}

        {/* Footer for extra small screens */}
        {isExtraSmallScreen && (
          // You can add content for extra small screens here if needed
          <Row style={extrasmallFixFooter} className="footer">
            {/* Add your small screen footer content here */}
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-start" style={{ fontWeight: "bold" }}>
                {new Date().getFullYear()} © NHS NEQAS . All Rights Reserved
              </div>
            </Col>
            
          </Row>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
