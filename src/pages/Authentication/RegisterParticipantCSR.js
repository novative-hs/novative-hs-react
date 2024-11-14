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
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// action
import {
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";
// Redux
import { connect } from "react-redux";
import Select from "react-select";

import { getcitylist } from "store/participantcity/actions";
import { getdepartmentlist } from "store/participantdepartment/actions";
import { getdistrictlist } from "store/participantdistrict/actions";
import { getdesignationlist } from "store/participantdesignation/actions";
import { getcountrylist } from "store/participantcountry/actions";
import { getprovincelist } from "store/participantprovince/actions";
import { gettypelist } from "store/participanttype/actions";
import { getsectorlist } from "store/participantsector/actions";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

class StaffRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListCity: [],
      ListDepartment: [],
      ListDistrict: [],
      ListDesignation: [],
      ListCountry: [],
      ListProvince: [],
      ListType: [],
      regParticipant: [],
      ListSector: [],
      modal: false,
      usernameFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
      emailError: null,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { onGetCityList } = this.props;
    onGetCityList(this.state.user_id);
    // console.log("city listttt", this.props.ListCity);

    const { onGetDepartmentList } = this.props;
    onGetDepartmentList(this.state.user_id);

    const { onGetDistrictList } = this.props;
    onGetDistrictList(this.state.user_id);

    const { onGetdesignationlist } = this.props;
    onGetdesignationlist(this.state.user_id);

    const { onGetCountryList } = this.props;
    onGetCountryList(this.state.user_id);

    const { onGetProvinceList } = this.props;
    onGetProvinceList(this.state.user_id);

    const { onGettypelist } = this.props;
    onGettypelist(this.state.user_id);

    const { onGetsectorlist } = this.props;
    onGetsectorlist(this.state.user_id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.emailError !== this.props.emailError) {
      this.setState({ emailError: this.props.emailError });
    }
    if (prevProps.usernameError != this.props.usernameError) {
      this.setState({ usernameFieldError: this.props.usernameError });
    }
    if (prevProps.passwordError != this.props.passwordError) {
      this.setState({ passwordFieldError: this.props.passwordError });
    }

    if (
      prevProps.incompleteRegistrationError !=
      this.props.incompleteRegistrationError
    ) {
      this.setState({
        incompleteRegistrationError: this.props.incompleteRegistrationError,
      });
    }
    ///////////////////////////////////////////////////////
    if (prevProps.ListCity !== this.props.ListCity) {
      this.setState({ ListCity: this.props.ListCity });
    }
    if (prevProps.ListDepartment !== this.props.ListDepartment) {
      this.setState({ ListDepartment: this.props.ListDepartment });
    }
    if (prevProps.ListDistrict !== this.props.ListDistrict) {
      this.setState({ ListDistrict: this.props.ListDistrict });
    }
    if (prevProps.ListDesignation !== this.props.ListDesignation) {
      this.setState({ ListDesignation: this.props.ListDesignation });
    }
    if (prevProps.ListCountry !== this.props.ListCountry) {
      this.setState({ ListCountry: this.props.ListCountry });
    }
    if (prevProps.ListProvince !== this.props.ListProvince) {
      this.setState({ ListProvince: this.props.ListProvince });
    }
    if (prevProps.ListType !== this.props.ListType) {
      this.setState({ ListType: this.props.ListType });
    }
    if (prevProps.ListSector !== this.props.ListSector) {
      this.setState({ ListSector: this.props.ListSector });
    }
  }

  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById("eye-icon");

    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.className = "mdi mdi-eye-off-outline";
    } else if (passwordInput) {
      passwordInput.type = "password";
      eyeIcon.className = "mdi mdi-eye-outline";
    }
  };
  togglePassword1Visibility = () => {
    const passwordInput = document.querySelector('input[name="password2"]');
    const eyeIcon2 = document.getElementById("eye-icon1");

    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon2.className = "mdi mdi-eye-off-outline";
    } else if (passwordInput) {
      passwordInput.type = "password";
      eyeIcon2.className = "mdi mdi-eye-outline";
    }
  };
  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };

  toggleImportModal = () => {
    this.setState(prevState => ({
      importModal: !prevState.importModal,
      importFile: null,
      importError: null,
    }));
  };
  handleFileChange = e => {
    const file = e.target.files[0];
    this.setState({
      importFile: file,
    });
  };

  handleImport = async () => {
    const { importFile } = this.state;
    if (!importFile) {
      this.setState({
        importError: "Please select a file.",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        // Assuming your data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Process jsonData and save to the database
        // Example of processing:
        for (let i = 0; i < jsonData.length; i++) {
          const item = jsonData[i];
          // Dispatch an action to save item to the database
          await this.props.registerUser({
            name: item.name,
            username: item.username,
            email: item.email,
            email_participant: item.email_participant,
            password: item.password,
            password2: item.password2,
            city: item.city,
            phone: item.phone,
            lab_code: item.lab_code,
            type: item.type,
            sector: item.sector,
            address: item.address,
            designation: item.designation,
            country: item.country,
            province: item.province,
            billing_address: item.billing_address,
            shipping_address: item.shipping_address,
            department: item.department,
            district: item.district,
            lab_staff_name: item.lab_staff_name,
            landline_registered_by: item.landline_registered_by,
            website: item.website,
            added_by: localStorage.getItem("authUser")
              ? JSON.parse(localStorage.getItem("authUser")).user_id
              : "",
            // Add other fields as required based on your schema
          });
        }

        // Close the modal and show success message
        this.toggleImportModal();
        this.displaySuccessMessage("Data imported successfully!");
      };

      reader.readAsArrayBuffer(importFile);
    } catch (error) {
      console.error("Error importing data:", error);
      this.setState({
        importError: "Error importing data. Please try again.",
      });
    }
  };
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adds smooth scrolling
    });
  };
  render() {
    // console.log("Email error received:", this.props.emailError);
    const { ListType, ListSector } = this.state;
    const { ListCity } = this.state;
    const { ListDepartment } = this.state;
    const { ListDistrict } = this.state;
    const { ListDesignation } = this.state;
    const { ListCountry } = this.state;
    const { ListProvince } = this.state;

    const cityOptions = ListCity.map(city => ({
      value: city.name,
      label: city.name,
    }));
    const deptOptions = ListDepartment.map(department => ({
      value: department.name,
      label: department.name,
    }));
    const districtOptions = ListDistrict.map(district => ({
      value: district.name,
      label: district.name,
    }));
    const designationOptions = ListDesignation.map(designation => ({
      value: designation.name,
      label: designation.name,
    }));
    const countryOptions = ListCountry.map(country => ({
      value: country.name,
      label: country.name,
    }));
    const provinceOptions = ListProvince.map(province => ({
      value: province.name,
      label: province.name,
    }));
    const typeOptions = ListType.map(type => ({
      value: type.name,
      label: type.name,
    }));
    const sectorOptions = ListSector.map(type => ({
      value: type.name,
      label: type.name,
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
            <title>Staff | NHS NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Register" />
            <Row className="justify-content-end">
              <Col lg="auto" className="text-end">
                <Button onClick={this.toggleImportModal} className="mb-3">
                  Import from Excel
                </Button>
              </Col>
            </Row>
            <Modal
              isOpen={this.state.importModal}
              toggle={this.toggleImportModal}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggleImportModal}>
                Import from Excel
              </ModalHeader>
              <ModalBody>
                <div className="mb-3 d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={e => {
                      e.preventDefault(); // Prevent the default action
                      const downloadUrl =
                        process.env.REACT_APP_BACKENDURL +
                        "/media/public/ParticipentsData.xlsx";
                      saveAs(downloadUrl, "ParticipentsData.xlsx"); // Use the file-saver library to trigger the download
                    }}
                  >
                    <i className="mdi mdi-download me-1" />
                    Download File Format
                  </button>
                </div>

                <div className="w-100">
                  <h4>
                    <b>Instructions to fill the excel sheet:</b>
                  </h4>
                  <div>
                    <ol>
                      <li>
                        Create a file whose format is, .xlsx, .xls, .csv, .ods,
                        .xml, .html, .txt, .dbf
                      </li>
                      <li>
                        There should be a file having columns, name,username,
                        email,email_participant, city,
                        country, province, billing_address, shipping_address,
                        department, district, lab_staff_name,
                        landline_registered_by, phone, website
                      </li>
                      <li>
                        If you want to get more information, contact us at{" "}
                        <strong>eternalqc@gmail.com</strong>
                      </li>
                    </ol>
                  </div>
                </div>
                <div>
                  {this.state.importError && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.importError}
                    </div>
                  )}
                  <Col lg="10">
                    <FormGroup className=" mt-4 mb-0">
                      <Label htmlFor="expirydateInput" className="fw-bolder">
                        Upload File
                        <span
                          style={{ color: "#f46a6a" }}
                          className="font-size-18"
                        >
                          *
                        </span>
                      </Label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={this.handleFileChange}
                        accept=".xlsx, .xls .xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf"
                      />
                    </FormGroup>
                  </Col>
                </div>

                <Row className="mt-4">
                  <Col sm="12" className="d-flex justify-content-end">
                    <Button
                      color="primary"
                      onClick={this.handleImport}
                      className="me-2"
                    >
                      Upload
                    </Button>
                    <Button color="secondary" onClick={this.toggleImportModal}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
            <Row className="justify-content-center">
              <Col lg="8">
              <div>
              <h5 className="text-danger">Important Note:</h5>
                <p className="text-muted text-left">
                  When uploading the file, please ensure that each participant has a unique <strong> username </strong> and <strong> email address.</strong> 
                  </p>
              </div>
                <Card>
                  <CardBody>
                    <div >
                      {this.state.submittedMessage && (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {this.state.submittedMessage}
                        </Alert>
                      )}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          username: (this.state && this.state.username) || "",
                          email: (this.state && this.state.email) || "",
                          email_participant:
                            (this.state && this.state.email_participant) || "",
                          password: (this.state && this.state.password) || "",
                          password2: (this.state && this.state.password2) || "",
                          account_type:
                            (this.state && this.state.account_type) ||
                            "labowner",
                          name: (this.state && this.state.name) || "",
                          cnic: (this.state && this.state.cnic) || "",
                          city: (this.state && this.state.city) || "",
                          province: (this.state && this.state.province) || "",
                          country: (this.state && this.state.country) || "",
                          billing_address:
                            (this.state && this.state.billing_address) || "",
                          shipping_address:
                            (this.state && this.state.shipping_address) || "",
                          // Select_schemes:
                          //   (this.state && this.state.Select_schemes) || "No",
                          department:
                            (this.state && this.state.department) || "",

                          lab_staff_name:
                            (this.state && this.state.lab_staff_name) || "",
                          district: (this.state && this.state.district) || "",
                          landline_registered_by:
                            (this.state && this.state.landline_registered_by) ||
                            "",
                          phone:
                            (this.state && this.state.phone) ||
                            "",
                          lab_code:
                            (this.state && this.state.lab_code) ||
                            "",
                          type:
                            (this.state && this.state.type) ||
                            "",
                          designation:
                            (this.state && this.state.designation) ||
                            "",
                          sector:
                            (this.state && this.state.sector) ||
                            "",
                          address:
                            (this.state && this.state.address) ||
                            "",
                          website: (this.state && this.state.website) || "",

                          added_by: localStorage.getItem("authUser")
                            ? JSON.parse(localStorage.getItem("authUser"))
                                .user_id
                            : "",
                          city: (this.state && this.state.city) || " ",
                        }}
                        validationSchema={Yup.object().shape({
                          username: Yup.string()
                            .required("Username is required")
                            .min(3, "Username must be at least 3 characters")
                            .max(
                              50,
                              "Username can't be longer than 50 characters"
                            ),
                          password: Yup.string().required(
                            "Please enter your password"
                          ),
                          name: Yup.string()
                            .trim()
                            .required("Please enter name")
                            .min(3, "Name must be at least 3 characters")
                            .max(50, "Name can't be longer than 50 characters"),

                          email: Yup.string()
                            .required("Please enter your email")
                            .email("Please enter valid email"),

                          email_participant: Yup.string()
                            .required("Please enter  email")
                            .email("Please enter valid email"),

                          password2: Yup.string()
                            .required("Please Correct your password")
                            .when("password", {
                              is: val => (val && val.length > 0 ? true : false),
                              then: Yup.string().oneOf(
                                [Yup.ref("password")],
                                "Both password need to be the same"
                              ),
                            }),
                          // city: Yup.array()
                          // .of(
                          //   Yup.object().shape({
                          //     value: Yup.string().required(),
                          //     label: Yup.string().required(),
                          //   })
                          // )
                          // .min(1, "At least one city is required"),

                          city: Yup.string().required("City is required"),

                          lab_code: Yup.string()
                            .required("Lab Code is required"),

                          province: Yup.string()
                            .required("province  is required")
                            .max(
                              100,
                              "province name can't be longer than 100 characters"
                            ),

                          country: Yup.string()
                            .required("Country is required")
                            .max(
                              50,
                              "Country can't be longer than 50 characters"
                            ),

                          // address: Yup.string()
                          //   .required("Address is required")
                          //   .max(
                          //     500,
                          //     "Address can't be longer than 500 characters"
                          //   ),
                          billing_address: Yup.string()
                            .required("Billing Address is required")
                            .max(
                              500,
                              "Address can't be longer than 500 characters"
                            ),
                          
                          address: Yup.string()
                            .required("Address is required")
                            .max(
                              500,
                              "Address can't be longer than 500 characters"
                            ),
                          department: Yup.string()
                            .required("Department is required")
                            .max(
                              100,
                              "Department can't be longer than 100 characters"
                            ),

                          district: Yup.string()
                            .required("District is required")
                            .max(
                              50,
                              "District can't be longer than 50 characters"
                            ),
                          type: Yup.string()
                            .required("Type is required")
                            .max(
                              50,
                              "Type can't be longer than 50 characters"
                            ),
                          designation: Yup.string()
                            .required("Designation is required")
                            .max(
                              50,
                              "Type can't be longer than 50 characters"
                            ),
                          sector: Yup.string()
                            .required("Sector is required")
                            .max(
                              50,
                              "Type can't be longer than 50 characters"
                            ),
                          lab_staff_name: Yup.string()
                            .required("Lab staff name is required")
                            .max(
                              50,
                              "Lab staff name can't be longer than 50 characters"
                            ),

                          landline_registered_by: Yup.string()
                            .required("Landline number is required")
                            .matches(
                              /^\d{7,15}$/,
                              "Landline number must be between 7 and 15 digits"
                            ),
                          phone: Yup.string()
                            .required("Phone number is required")
                            .matches(
                              /^\d{7,15}$/,
                              "Phone number must be between 7 and 15 digits"
                            ),
                          // website: Yup.string().url("Invalid URL"),
                          // .required("Website is required"),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          // Trigger scroll to top
                          this.scrollToTop();
                          // for multiple selection
                          // const cityIds = values.city
                          //   .map(city => city.value)
                          //   .join(",");

                          // const formData = {
                          //   ...values,
                          //   city: cityIds,
                          // };

                          this.props.registerUser(values);
                          setSubmitting(false); // Ensures form is not submitting
                          setTimeout(() => {
                            if (
                              !this.state.usernameFieldError &&
                              !this.state.passwordFieldError &&
                              !this.state.incompleteRegistrationError
                            ) {
                              this.setState({
                                submittedMessage:
                                  "Participant added successfully.",
                              });
                              setTimeout(() => {
                                this.setState({ submittedMessage: '' });
                                resetForm(); // Reset form fields after the success message disappears
                              }, 2000);
                            }
                          }, 1000); // Initial 1 second delay
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          isSubmitting,
                          setFieldValue,
                        }) => (
                          <Form className="form-horizontal">
                            {/* Name field */}
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Name
                                  </Label>
                                  <Field
                                    name="name"
                                    type="text"
                                    placeholder="Enter name"
                                    className={
                                      "form-control" +
                                      (errors.name && touched.name
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                {/* Organization email */}
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Please enter your email"
                                    className={
                                      "form-control" +
                                      (errors.email && touched.email
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                {/* website */}
                                <div className="mb-3">
                                  <Label for="website" className="form-label">
                                    Website
                                  </Label>
                                  <Field
                                    id="website"
                                    name="website"
                                    type="text"
                                    placeholder="Please enter your website_URL"
                                    className={
                                      "form-control" +
                                      (errors.website && touched.website
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="website"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label
                                    for="phone"
                                    className="form-label"
                                  >
                                    Contact No
                                  </Label>
                                  <Field
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Please enter contact no."
                                    className={
                                      "form-control" +
                                      (errors.phone &&
                                      touched.phone
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>{" "}
                              </Col>

                            </Row>
                            <Row>
                            <Col sm={6} md={6} xl={6}>
                                {/* Lab Staff Name field */}
                                <div className="mb-3">
                                  <Label
                                    for="address"
                                    className="form-label"
                                  >
                                    {/* Registered by (Name) */}
                                    Address
                                  </Label>
                                  <Field
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Please enter Complete Address."
                                    className={
                                      "form-control" +
                                      (errors.address &&
                                      touched.address
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              {/* city */}
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="city" className="form-label">
                                    City
                                  </Label>
                                  <Select
                                    name="city" // The field name in Formik
                                    // isMulti // Enable multi-select
                                    options={cityOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      // "form-control" +
                                      errors.city && touched.city
                                        ? " is-invalid"
                                        : "" // Conditional class based on validation
                                    }
                                    //   onChange={
                                    //     selectedOptions =>
                                    //       setFieldValue("city", selectedOptions) // Update Formik state
                                    //   }
                                    //   value={values.city} // Set the current selected values
                                    // />
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "city",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      ); // Update Formik state with string value
                                    }}
                                    value={
                                      cityOptions.find(
                                        option => option.value === values.city
                                      ) || null
                                    } // Set the current selected value
                                    // menuPlacement="auto"
                                    // menuShouldScrollIntoView={false}
                                  />
                                  <ErrorMessage
                                    name="city" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            
                            
                            </Row>

                            <Row>
                              {/* District */}
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="district" className="form-label">
                                    District
                                  </Label>
                                  <Select
                                    name="district" // The field name in Formik
                                    options={districtOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      errors.district && touched.district
                                        ? " is-invalid"
                                        : ""
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "district",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      );
                                    }}
                                    value={
                                      districtOptions.find(
                                        option =>
                                          option.value === values.district
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="district" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                {/* province  */}
                                <div className="mb-3">
                                  <Label for="province" className="form-label">
                                    Province
                                  </Label>
                                  <Select
                                    name="province" // The field name in Formik
                                    options={provinceOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      errors.province && touched.province
                                        ? " is-invalid"
                                        : ""
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "province",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      );
                                    }}
                                    value={
                                      provinceOptions.find(
                                        option =>
                                          option.value === values.province
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="province"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            
                            </Row>

                            <Row>
                            <Col sm={6} md={6} xl={6}>
                                {/* country */}
                                <div className="mb-3">
                                  <Label for="country" className="form-label">
                                    Country
                                  </Label>
                                  <Select
                                    name="country" // The field name in Formik
                                    options={countryOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      errors.country && touched.country
                                        ? " is-invalid"
                                        : ""
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "country",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      );
                                    }}
                                    value={
                                      countryOptions.find(
                                        option =>
                                          option.value === values.country
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="country"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label
                                    for="department"
                                    className="form-label"
                                  >
                                    Department
                                  </Label>
                                  <Select
                                    name="department" // The field name in Formik
                                    options={deptOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      // "form-control" +
                                      errors.department && touched.department
                                        ? " is-invalid"
                                        : "" // Conditional class based on validation
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "department",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      ); // Update Formik state with string value
                                    }}
                                    value={
                                      deptOptions.find(
                                        option =>
                                          option.value === values.department
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="department" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              {/* District */}
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    Lab Type
                                  </Label>
                                  <Select
                                    name="type" // The field name in Formik
                                    options={typeOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      errors.type && touched.type
                                        ? " is-invalid"
                                        : ""
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "type",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      );
                                    }}
                                    value={
                                      typeOptions.find(
                                        option =>
                                          option.value === values.type
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="type" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label
                                    for="sector"
                                    className="form-label"
                                  >
                                    Sector
                                  </Label>
                                  <Select
                                    name="sector" // The field name in Formik
                                    options={sectorOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      // "form-control" +
                                      errors.sector && touched.sector
                                        ? " is-invalid"
                                        : "" // Conditional class based on validation
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "sector",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      ); // Update Formik state with string value
                                    }}
                                    value={
                                      sectorOptions.find(
                                        option =>
                                          option.value === values.sector
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="sector" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                {/* Shipping Address */}
                                <div className="mb-3">
                                  <Label
                                    for="shipping_address"
                                    className="form-label"
                                  >
                                    Shipping Address
                                  </Label>
                                  <Field
                                    id="shipping_address"
                                    name="shipping_address"
                                    type="text"
                                    placeholder="Please enter your Shipping address"
                                    className={
                                      "form-control" +
                                      (errors.shipping_address &&
                                      touched.shipping_address
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="shipping_address"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                {/* Billing Address */}
                                <div className="mb-3">
                                  <Label
                                    for="billing_address"
                                    className="form-label"
                                  >
                                    Billing Address
                                  </Label>
                                  <Field
                                    id="billing_address"
                                    name="billing_address"
                                    type="text"
                                    placeholder="Please enter your Billing address"
                                    className={
                                      "form-control" +
                                      (errors.billing_address &&
                                      touched.billing_address
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="billing_address"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>
                            {/* department field */}

                            <Row>
                              {/* Participant Sector */}
                              <Col sm={6} md={6} xl={6}></Col>
                              {/* Participant Type */}
                              <Col sm={6} md={6} xl={6}></Col>
                            </Row>
                            <Row>
                              {/* Schemes */}
                              {/* <Col sm={6} md={6} xl={6}> 
                              <div className="mb-3">
                                  <Label
                                    for="Select_schemes"
                                    className="form-label"
                                  >
                                    Select scheme
                                  </Label>
                                  <Field
                                    name="Select_schemes"
                                    as="select"
                                    className="form-select"
                                  >
                                    <option value=" ">Choose option</option>
                                    <option value="abc">Abc</option>
                                    <option value="xyz">Xyz</option>
                                  </Field>
                                </div>
                              </Col> */}
                              <Col sm={6} md={6} xl={6}>
                                {" "}
                              </Col>
                            </Row>

                            {/* <div className="mb-3 mt-5">
                              <h3>Who is registering the participant</h3>
                            </div> */}
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                {/* Lab Staff Name field */}
                                <div className="mb-3">
                                  <Label
                                    for="lab_staff_name"
                                    className="form-label"
                                  >
                                    {/* Registered by (Name) */}
                                    Name of notification person
                                  </Label>
                                  <Field
                                    id="lab_staff_name"
                                    name="lab_staff_name"
                                    type="text"
                                    placeholder="Please enter the name of person registering participant"
                                    className={
                                      "form-control" +
                                      (errors.lab_staff_name &&
                                      touched.lab_staff_name
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="lab_staff_name"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label
                                    for="landline_registered_by"
                                    className="form-label"
                                  >
                                    Contact No. of notification person
                                  </Label>
                                  <Field
                                    id="landline_registered_by"
                                    name="landline_registered_by"
                                    type="text"
                                    placeholder="Please enter landline no."
                                    className={
                                      "form-control" +
                                      (errors.landline_registered_by &&
                                      touched.landline_registered_by
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="landline_registered_by"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>{" "}
                              </Col>
                              {/* Lab Staff Designation field */}
                              {/* <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label
                                    for="lab_staff_designation"
                                    className="form-label"
                                  >
                                    Designation of notification person
                                  </Label>
                                  <Select
                                    name="lab_staff_designation" // The field name in Formik
                                    options={designationOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      errors.lab_staff_designation &&
                                      touched.lab_staff_designation
                                        ? " is-invalid"
                                        : ""
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "lab_staff_designation",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      );
                                    }}
                                    value={
                                      designationOptions.find(
                                        option =>
                                          option.value ===
                                          values.lab_staff_designation
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="lab_staff_designation" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col> */}
                            </Row>
                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Email of notification person
                                  </Label>
                                  <Field
                                    name="email_participant"
                                    type="text"
                                    placeholder="Enter email of notification person"
                                    className={
                                      "form-control" +
                                      (errors.email_participant &&
                                      touched.email_participant
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="email_participant"
                                    component="div"
                                    className="invalid-feedback"
                                  />

                                  {this.state.emailError && (
                                    <div className="invalid-feedback d-block">
                                      {this.state.emailError}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label
                                    for="designation"
                                    className="form-label"
                                  >
                                    Designation of notification person
                                    </Label>
                                  <Select
                                    name="designation" // The field name in Formik
                                    options={designationOptions} // Options for the select
                                    styles={customStyles}
                                    className={
                                      // "form-control" +
                                      errors.designation && touched.designation
                                        ? " is-invalid"
                                        : "" // Conditional class based on validation
                                    }
                                    onChange={selectedOption => {
                                      setFieldValue(
                                        "designation",
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      ); // Update Formik state with string value
                                    }}
                                    value={
                                      designationOptions.find(
                                        option =>
                                          option.value === values.designation
                                      ) || null
                                    } // Set the current selected value
                                  />
                                  <ErrorMessage
                                    name="designation" // Error for the city field
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col sm={6} md={6} xl={6}>
                                <div className="mb-3">
                                  <Label for="lab_code" className="form-label">
                                    Lab Code
                                  </Label>
                                  <Field
                                    name="lab_code"
                                    type="text"
                                    placeholder="Enter Lab Code"
                                    className={
                                      "form-control" +
                                      (errors.lab_code && touched.lab_code
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="lab_code"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </Col>
                             
                            </Row>

                            {/* Username field */}
                            <div className="mb-3">
                              <Label for="username" className="form-label">
                                Username
                              </Label>
                              <Field
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                type="text"
                                onFocus={() => {
                                  this.setState({
                                    usernameFieldError: null,
                                  });
                                }}
                                className={
                                  "form-control" +
                                  ((errors.username && touched.username) ||
                                  this.state.usernameFieldError
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="username"
                                component="div"
                                className="invalid-feedback"
                              />

                              <div className="invalid-feedback">
                                {this.state.usernameFieldError}
                              </div>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Password</Label>
                              <div className="input-group">
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Enter password"
                                  autoComplete="on"
                                  className={
                                    "form-control" +
                                    ((errors.password && touched.password) ||
                                    this.state.passwordFieldError
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i
                                      id="eye-icon"
                                      className="mdi mdi-eye-outline"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                              <div className="invalid-feedback">
                                {this.state.passwordFieldError}
                              </div>

                              <div className="mt-2 input-group">
                                <Field
                                  name="password2"
                                  type="password"
                                  placeholder="Re-enter password"
                                  autoComplete="on"
                                  className={
                                    "form-control" +
                                    (errors.password2 && touched.password2
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePassword1Visibility}
                                  >
                                    <i
                                      id="eye-icon1"
                                      className="mdi mdi-eye-outline"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="password2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>

                            {/* <div className="mb-3">
                              <label htmlFor="account_type">Account Type</label>
                              <Field
                                name="account_type"
                                as="select" // Using `as="select"` with Field
                                // component="select"
                                className="form-select"
                              >
                                <option value="" disabled>
                                  Select Account Type
                                </option>
                                <option value="patient">Patient</option>
                                <option value="labowner">Lab</option>
                                <option value="b2bclient">B2B Client</option>
                                <option value="donor">Donor</option>
                                <option value="corporate">Corporate</option>
                              </Field>
                              <ErrorMessage
                                name="account_type"
                                component="div"
                                className="text-danger"
                              />
                            </div> */}

                            <div className="mt-3 d-grid">
                              <button
                                className="btn btn-primary btn-block"
                                type="submit"
                                // disabled={this.state.submittedMessage}
                                disabled={isSubmitting} // Disables button during form submission
                                style={{
                                  backgroundColor: "#1D1DE4",
                                }}
                              >
                                {" "}
                                Register{" "}
                              </button>
                            </div>
                          </Form>
                        )}
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
StaffRegister.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  usernameError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
  className: PropTypes.any,
  emailError: PropTypes.any,

  ListCity: PropTypes.array,
  ListDepartment: PropTypes.array,
  ListDistrict: PropTypes.array,
  ListDesignation: PropTypes.array,
  ListCountry: PropTypes.array,
  ListProvince: PropTypes.array,
  ListType: PropTypes.array,
  ListSector: PropTypes.array,
  onGetCityList: PropTypes.func,
  onGetDepartmentList: PropTypes.func,
  onGetDistrictList: PropTypes.func,
  onGetdesignationlist: PropTypes.func,
  onGetCountryList: PropTypes.func,
  onGetProvinceList: PropTypes.func,
  onGettypelist: PropTypes.func,
  onGetsectorlist: PropTypes.func,
};
const mapStateToProps = ({
  Account,
  ListCity,
  ListDepartment,
  ListDistrict,
  ListDesignation,
  ListCountry,
  ListProvince,
  regParticipant,
  ListType,
  ListSector,
}) => ({
  emailError: Account.emailError,
  userAccountType: Account.userAccountType,
  loading: Account.loading,
  incompleteRegistrationError: Account.incompleteRegistrationError,
  passwordError: Account.passwordError,
  userID: Account.userID,
  usernameError: Account.usernameError,
  ListSector: ListSector.ListSector,
  ListCity: ListCity.ListCity,
  ListDepartment: ListDepartment.ListDepartment,
  ListDistrict: ListDistrict.ListDistrict,
  ListDesignation: ListDesignation.ListDesignation,
  ListCountry: ListCountry.ListCountry,
  ListProvince: ListProvince.ListProvince,
  regParticipant: regParticipant.regParticipant,
  ListType: ListType.ListType,

});
const mapDispatchToProps = dispatch => {
  return {
    apiError: error => dispatch(apiError(error)),
    registerUser: user => dispatch(registerUser(user)),
    registerUserFailed: error => dispatch(registerUserFailed(error)),

    onGetCityList: id => dispatch(getcitylist(id)),
    onGetDepartmentList: id => dispatch(getdepartmentlist(id)),
    onGetDistrictList: id => dispatch(getdistrictlist(id)),
    onGetdesignationlist: id => dispatch(getdesignationlist(id)),
    onGetCountryList: id => dispatch(getcountrylist(id)),
    onGetProvinceList: id => dispatch(getprovincelist(id)),
    onGettypelist: id => dispatch(gettypelist(id)),
    onGetsectorlist: id => dispatch(getsectorlist(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StaffRegister);
