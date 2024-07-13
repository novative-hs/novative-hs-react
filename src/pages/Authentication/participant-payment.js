import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
  Alert,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// Redux
import { connect } from "react-redux";
import Select from "react-select";
import { getApprovedLabs } from "store/registration-admin/actions";
import {
  getcyclelist
} from "store/cycle/actions";

import {
  addNewPayment,

} from "store/Payment/actions";
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approvedLabs: [],
      CycleList: [],

      submittedMessage: null,
      emailError: null,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { ongetApprovedLabs, ongetcyclelist } = this.props;
    ongetApprovedLabs(this.state.user_id);
    ongetcyclelist(this.state.user_id);

  }
  componentDidUpdate(prevProps) {
    if (prevProps.approvedLabs !== this.props.approvedLabs) {
      this.setState({ approvedLabs: this.props.approvedLabs });
    }
    if (prevProps.CycleList !== this.props.CycleList) {
      this.setState({ CycleList: this.props.CycleList });
    }

  }
  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }
  handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("photo", file);
  };
  render() {
    // console.log("Email error received:", this.props.emailError);

    const { approvedLabs, CycleList } = this.state;

    const participantOptions = approvedLabs.map(participant => ({
      value: participant.name,
      label: participant.name,
    }));
    const schemeOptions = CycleList.map((scheme) => ({
      value: scheme.id, // Use scheme ID instead of scheme name
      label: scheme.scheme_name,
    }));




    const customStyles = {
      menuList: provided => ({
        ...provided,
        maxHeight: 200, // Maximum height for the menu list
        overflowY: "auto", // Enable vertical scrolling
        // WebkitOverflowScrolling: "touch", // Smooth scrolling for mobile devices
      }),
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Payment | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Payment" breadcrumbItem="Payment" />
            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <div className="mt-4">
                      {this.state.successMessage && (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.state.successMessage}
                        </Alert>
                      )}
           <Formik
  enableReinitialize={true}
  initialValues={{
    photo: "",
    participant: (this.state && this.state.participant) || "",
    paydate: (this.state && this.state.paydate) || "",
    paymentmethod: (this.state && this.state.paymentmethod) || "",
    scheme: [],
    price: "",
    discount: 0, 
    added_by: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
  }}
  validationSchema={Yup.object().shape({
    participant: Yup.string().required("Participant is required"),
    scheme: Yup.array().min(1, "At least one scheme must be selected").required("Scheme is required"),
    paydate: Yup.string().required("Date is required"),
    photo: Yup.string().required("Deposit Slip is required"),
    paymentmethod: Yup.string().required("Payment Method is required"),
    discount: Yup.number()
      .min(0, "Discount must be at least 0%")
      .max(100, "Discount cannot be more than 100%")
      .required("Discount is required"),
  })}
  onSubmit={async (values, { setSubmitting, resetForm }) => {
    const userId = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "";

    // Ensure roundedPrice is defined before use
    const roundedPrice = Math.round(parseFloat(values.price));

    const AddPayment = {
      participant: values.participant,
      scheme: values.scheme,
      price: roundedPrice, // Use rounded price
      discount: values.discount,
      paydate: values.paydate,
      photo: values.photo,
      paymentmethod: values.paymentmethod,
      added_by: userId,
    };

    console.log("data in page before submit", AddPayment);

    try {
      await this.props.onAddNewPayment(userId, AddPayment);
      resetForm();
      this.displaySuccessMessage("Payment added successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
    }

    setSubmitting(false);
  }}
>
  {({
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
  }) => {
    const handleSchemeChange = (selectedOptions) => {
      setFieldValue(
        "scheme",
        selectedOptions ? selectedOptions.map((option) => option.value) : []
      );

      const selectedSchemes = CycleList.filter((scheme) =>
        selectedOptions.map((option) => option.value).includes(scheme.id)
      );

      const cycle_no = selectedSchemes.map((scheme) => scheme.cycle_no).join(", ");
      const total_price = selectedSchemes.reduce((sum, scheme) => sum + parseFloat(scheme.price), 0);

      let roundedPrice = Math.round(total_price);

      setFieldValue("cycle_no", cycle_no);
      setFieldValue("price", roundedPrice.toFixed(2));

      if (values.discount) {
        const discountPrice = roundedPrice - (roundedPrice * parseFloat(values.discount) / 100);
        roundedPrice = Math.round(discountPrice);
        setFieldValue("price", roundedPrice.toFixed(2));
      } else {
        setFieldValue("price", roundedPrice.toFixed(2));
      }
    };

    const handleDiscountChange = (e) => {
      let discountValue = parseFloat(e.target.value);

      if (isNaN(discountValue) || !discountValue) {
        discountValue = 0;
      }

      setFieldValue("discount", discountValue);

      const total_price = values.scheme.reduce((sum, scheme_id) => {
        const scheme = CycleList.find((scheme) => scheme.id === scheme_id);
        return sum + (scheme ? parseFloat(scheme.price) : 0);
      }, 0);

      let roundedPrice = Math.round(total_price);

      if (!isNaN(discountValue) && roundedPrice) {
        const discountPrice = roundedPrice - (roundedPrice * discountValue / 100);
        roundedPrice = Math.round(discountPrice);
        setFieldValue("price", roundedPrice.toFixed(2));
      } else {
        setFieldValue("price", roundedPrice.toFixed(2));
      }
    };
                          return (
                            <Form className="form-horizontal">
                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="participant" className="form-label">
                                      Participant
                                    </Label>
                                    <Select
                                      name="participant"
                                      options={participantOptions}
                                      className={errors.participant && touched.participant ? "is-invalid" : ""}
                                      onChange={selectedOption => {
                                        setFieldValue("participant", selectedOption ? selectedOption.value : "");
                                        setFieldValue("scheme", []); // Clear schemes when participant changes
                                      }}
                                      value={participantOptions.find(option => option.value === values.participant) || null}
                                    />
                                    <ErrorMessage name="participant" component="div" className="invalid-feedback" />
                                  </div>
                                </Col>
                              </Row>

                              {values.participant && ( // Render schemes only if participant is selected
                                <Row>
                                  <Col>
                                    <div className="mb-3">
                                      <Label for="scheme" className="form-label">
                                        Scheme
                                      </Label>
                                      <Select
                                        name="scheme"
                                        isMulti
                                        options={schemeOptions}
                                        className={errors.scheme && touched.scheme ? "is-invalid" : ""}
                                        onChange={handleSchemeChange}
                                        value={schemeOptions.filter(option => values.scheme.includes(option.value)) || []}
                                      />
                                      <ErrorMessage name="scheme" component="div" className="invalid-feedback" />
                                    </div>
                                  </Col>
                                </Row>
                              )}

                              {/* <Row>
          <Col>
            <div className="mb-3">
              <Label for="cycle_no" className="form-label">
                Cycle
              </Label>
              <Field
                name="cycle_no"
                type="text"
                placeholder="Enter cycle number"
                className={
                  "form-control" +
                  (errors.cycle_no && touched.cycle_no ? " is-invalid" : "")
                }
                readOnly
              />
              <ErrorMessage
                name="cycle_no"
                component="div"
                className="invalid-feedback"
              />
            </div>
          </Col> */}
                              {/* </Row> */}

                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="price" className="form-label">
                                      Price
                                    </Label>
                                    <Field
                                      name="price"
                                      type="text"
                                      placeholder="Enter price"
                                      className={
                                        "form-control" +
                                        (errors.price && touched.price ? " is-invalid" : "")
                                      }
                                      readOnly
                                    />
                                    <ErrorMessage
                                      name="price"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="discount" className="form-label">
                                      Discount (%)
                                    </Label>
                                    <Field
                                      name="discount"
                                      type="text"
                                      placeholder="Enter discount"
                                      className={
                                        "form-control" +
                                        (errors.discount && touched.discount ? " is-invalid" : "")
                                      }
                                      onChange={handleDiscountChange}
                                    />
                                    <ErrorMessage
                                      name="discount"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="name" className="form-label">
                                      Pay Date
                                    </Label>
                                    <Field
                                      name="paydate"
                                      type="date"
                                      id="paydate"
                                      className={
                                        "form-control" +
                                        (errors.paydate && touched.paydate
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="paydate"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="name" className="form-label">
                                      Pay Copy
                                    </Label>
                                    <Input
                                      id="formFile"
                                      name="photo"
                                      type="file"
                                      multiple={false}
                                      accept=".jpg,.jpeg,.png"
                                      onChange={(event) => this.handleFileChange(event, setFieldValue)}
                                      className={
                                        "form-control" +
                                        (errors.photo && touched.photo
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="photo"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div className="mb-3">
                                    <Label for="paymentmethod" className="form-label">
                                      Payment Method
                                    </Label>
                                    <Select
                                      id="paymentmethod"
                                      name="paymentmethod"
                                      options={[
                                        { value: 'Online', label: 'Online' },
                                        { value: 'Cheque', label: 'Cheque' },
                                        { value: 'Cash', label: 'Cash' },

                                      ]}
                                      onChange={(selectedOption) => {
                                        setFieldValue('paymentmethod', selectedOption ? selectedOption.value : '');
                                      }}
                                      value={values.paymentmethod ? { value: values.paymentmethod, label: values.paymentmethod } : null}
                                      className={errors.paymentmethod && touched.paymentmethod ? 'is-invalid' : ''}
                                    />
                                    <ErrorMessage
                                      name="paymentmethod"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <div className="text-end">
                                    <button type="submit" className="btn btn-success save-user"
                                      style={{ backgroundColor: '#0000CD', borderColor: '#0000CD' }}>Save</button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>
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
Payment.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
  approvedLabs: PropTypes.array,
  CycleList: PropTypes.array,
  ongetApprovedLabs: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  onAddNewPayment: PropTypes.func,
};
const mapStateToProps = ({
  Account,
  registrationAdmin,
  CycleList,
}) => ({
  userID: Account.userID,

  approvedLabs: registrationAdmin.approvedLabs,
  CycleList: CycleList.CycleList,
});
const mapDispatchToProps = dispatch => ({
  onAddNewPayment: (id, payment) => dispatch(addNewPayment(id, payment)),
  ongetApprovedLabs: id => dispatch(getApprovedLabs(id)),
  ongetcyclelist: id => dispatch(getcyclelist(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
