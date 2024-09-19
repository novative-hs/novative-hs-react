import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  const isLargeScreen = window.innerWidth > 768;
  const isSmallScreen = window.innerWidth >= 576 && window.innerWidth <= 768;
  const isextraSmallScreen = window.innerWidth < 576;
  const largfixfooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
  };
  const islargfixfooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "6.5px",
    display: "flex",
    justifyContent: "center",
  };

  console.log("isLargeScreen:", isLargeScreen);
  console.log("isSmallScreen:", isSmallScreen);

  return (
    <footer className="footer">
      <Container fluid={true}>
        {isLargeScreen && (
          <Row>
            <Col md={4}>{new Date().getFullYear()} © NHS NEQAS (Private) Limited</Col>
            
          </Row>
        )}
{isSmallScreen && (
  <Row style={largfixfooter} className="footer">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-start">
              {new Date().getFullYear()} © NHS NEQAS (Private) Limited
            </div>
          </Col>
          
        </Row>
)}
{isextraSmallScreen && (
  <Row style={islargfixfooter} className="footer">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-start">
              {new Date().getFullYear()} © NHS NEQAS (Private) Limited
            </div>
          </Col>
         
        </Row>
)}
        
      </Container>
    </footer>
  );
};

export default Footer;
