import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

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

  return (
    <footer className="footer">
      <Container fluid={true}>
        {isLargeScreen && (
          <Row>
            {/* Column 1 */}
            <Col md={3}>
              <div className="mb-2">
              <Link
                    to={
                        `/nearby-labs/`
                    }
                  >
                    <span>
                    <img src="/logo-dark.png" alt="" height="60" />
                  </span>
                  </Link>
              </div>
              <div className="mb-2">
                {/* Add your Terms, Privacy Policy, and Disclaimer links here */}
                <a
                  href="/LabHazir - Terms & Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>{" "}
                |{" "}
                <a
                  href="/LabHazir - Terms & Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                |{" "}
                <a
                  href="/disclaimer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Disclaimer
                </a>
              </div>
            </Col>

            {/* Column 2 */}
            <Col md={3}>
              <h4>Company</h4>
              <div className="mb-2">
                {/* Add your About Us, Contact Us, Careers, and Help & Support links here */}
                <a
                  href="/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="https://www.linkedin.com/company/labhazir/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="https://careers.pmahealthcare.com/apply_online/?position=12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="https://www.labhazir.com/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help & Support
                </a>
              </div>
            </Col>

            {/* Column 3 */}
            <Col md={3}>
              <h4>Quick Links</h4>
              <div className="mb-2">
                {/* Add your quick links here */}
                <a
                  href="https://www.labhazir.com/register/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Become a Lab
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How to API&apos;s Integrations
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Corporate Customer
                </a>
              </div>
              <div className="mb-2">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Become an affiliate
                </a>
              </div>
            </Col>

            {/* Column 4 */}
            <Col md={3}>
              <h4>Get Connected</h4>
              <div className="mb-2">
                {/* Add your contact information here */}
                <span>
                  <i className="mdi mdi-email align-middle me-2 font-size-40 text-primary" />{" "}
                  info@labhazir.com{" "}
                </span>
              </div>
              <div className="mb-2">
                <i className="mdi mdi-phone align-middle me-2 font-size-40 text-primary" />{" "}
                0300-LABHAZIR{" "}
              </div>
              <div className="mb-2">
                {/* Add your social media links here */}
                <a
                  href="https://www.facebook.com/labhazir"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-facebook align-middle me-2" style={{fontSize: "30px", color: "#3b5998"}} />
                </a>
                <a
                  href="https://www.instagram.com/lab_hazir_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-instagram align-middle me-2" style={{fontSize: "30px", color: "#FD1D1D"}} />
                </a>
                <a
                  href="https://www.linkedin.com/company/labhazir/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-linkedin align-middle me-2" style={{fontSize: "30px", color: "#0077b5"}} />
                </a>
                <a
                  href="https://www.youtube.com/@LabHazir"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-youtube align-middle me-2" style={{fontSize: "30px", color: "#FF0000"}} />
                </a>
              </div>
            </Col>
            <div style={{ background: "#3B71CA", height: "30px", fontWeight: "bold" }}>
          <Col className="text-white text-center fonr-size-12 mt-1">
            {new Date().getFullYear()} © Lab Hazir (Private) Limited. All Rights Reserved
          </Col>
        </div>
          </Row>
        )}

        {/* Footer for small screens */}
        {isSmallScreen && (
          <Row style={largFixFooter} className="footer">
            {/* Add your small screen footer content here */}
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-start">
                {new Date().getFullYear()} © Lab Hazir (Private) Limited
              </div>
            </Col>
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-end">
                <Link to="/disclaimer">
                  <span>Disclaimer</span>
                </Link>
              </div>
            </Col>
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-end">
                <Link to="/about-us">
                  <span>About Us</span>
                </Link>
              </div>
            </Col>
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-end">
                <p>
                  <a
                    href="/LabHazir - Terms & Conditions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms
                  </a>
                </p>
              </div>
            </Col>
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <div className="text-sm-end">
                <a
                  href="https://www.linkedin.com/company/labhazir/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-linkedin align-middle me-2" style={{fontSize: "30px", color: "#0077b5"}} />
                </a>
                <a
                  href="https://www.facebook.com/labhazir"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-facebook align-middle me-2" style={{fontSize: "30px", color: "#3b5998"}} />
                </a>
              </div>
            </Col>
          </Row>
        )}

        {/* Footer for extra small screens */}
        {isExtraSmallScreen && (
          // You can add content for extra small screens here if needed
          null
        )}
      </Container>
    </footer>
  );
};

export default Footer;
