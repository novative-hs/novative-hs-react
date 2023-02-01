import React, { Component } from "react";
import Select from "react-select";
import { Col, Container, Row, Label, Input } from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

let optionGroup = [
  {
    options: [],
  },
];

// To remove thick blue border effect
const style = {
  control: (base, state) => ({
    ...base,
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 1,
    "&:hover": {
      border: state.isFocused ? 0 : 1,
    },
  }),
};

class FormLayouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      city: "",
      location: "",
    };
  }
  handleSelectGroup = selectedGroup => {
    console.log("Type of: ", typeof selectedGroup.value);
    this.setState({ city , location : selectedGroup.value });
  };
  render() {
    return (
      <React.Fragment>
        <div>
          <Container fluid className="p-0">
            <Row className="g-0">
              <Col xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div className="mt-4">
                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              type:
                                (this.state && this.state.type) || "Main Lab",
                              city:
                                (this.state &&
                                  this.state.city) ||
                                "",
                               location:
                                (this.state &&
                                  this.state.location) ||
                                "",
                            }}
                            validationSchema={Yup.object().shape({
                              city: Yup.string().when("type", {
                                is: val => val === "Custom Address",
                                then: Yup.string().required(
                                  "Please enter your City"
                                ),
                              }),
                               location: Yup.string().when("type", {
                                is: val => val === "Custom Address",
                                then: Yup.string().required(
                                  "Please enter your Location"
                                ),
                              }),
                            })}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                               
                                {/* Type field */}
                                <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    What is your Location type?
                                  </Label>
                                  <Field
                                    name="type"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        type: e.target.value,
                                      })
                                    }
                                    value={this.state.type}
                                    className="form-select"
                                  >
                                    <option value="Current Location">Current Location</option>
                                    <option value="Register Address">Register Address</option>
                                    <option value="Custom Address">
                                      Custom Address
                                    </option>
                                  </Field>
                                </div>

                                {/* Custom Address field */}
                                {this.state.type === "Custom Address" && (
                                  <div className="mb-3">
                                    <Label
                                      for="city"
                                      className="form-label"
                                    >
                                      What is your city ?
                                    </Label>
                                    <Select
                                      styles={
                                        errors.city &&
                                        touched.city 
                                          ? errorStyle
                                          : style
                                      }
                                      name="city "
                                      component="select"
                                      onChange={this.handleSelectGroup}
                                      className="defautSelectParent is-invalid"
                                      options={optionGroup}
                                    />

                                    {touched.city &&
                                      errors.city && (
                                        <div
                                          style={{
                                            marginTop: "0.25rem",
                                            fontSize: "80%",
                                            color: "#f46a6a",
                                          }}
                                        >
                                          Please select your City?
                                        </div>
                                      )}
                                  </div>
                                  
                                )}
                                {/* Custom Address field */}
                                {this.state.type === "Custom Address" && (
                                  <div className="mb-3">
                                    <Label htmlFor="formrow_InputLocation">Location</Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="formrow_InputLocation"
                                      placeholder="Search Location..."
                                    />
                                    <br></br>
                                     <div>
                                        <button type="submit" className="btn btn-primary w-md">
                                          FIND
                                        </button>
                                     </div>
                                </div>
                                
                                )}
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default FormLayouts;
