import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getAdvertisements,
  addNewAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "store/advertisements/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class AdvertisementsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      advertisements: [],
      advertisement: "",
      advertisementImg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      advertisementListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, advertisement) => <>{advertisement.id}</>,
        },
        {
          dataField: "poster",
          text: "#",
          formatter: (cellContent, advertisement) => (
            <>
              {!advertisement.poster ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {advertisement.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    className="rounded-circle avatar-xs"
                    src={
                      process.env.REACT_APP_BACKENDURL + advertisement.poster
                    }
                    alt=""
                  />
                </div>
              )}
            </>
          ),
        },
        {
          dataField: "title",
          text: "Title",
          sort: true,
        },
        {
          dataField: "description",
          text: "Description",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, advertisement) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleAdvertisementClick(e, advertisement)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(advertisement)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleAdvertisementClick = this.handleAdvertisementClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAdvertisementClicks = this.handleAdvertisementClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  componentDidMount() {
    const { advertisements, onGetAdvertisements } = this.props;
    if (advertisements && !advertisements.length) {
      console.log(onGetAdvertisements(this.state.user_id));
    }
    // this.setState({ advertisements });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleAdvertisementClicks = () => {
    this.setState({
      advertisement: "",
      advertisementImg: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { advertisements } = this.props;
    if (
      !isEmpty(advertisements) &&
      size(prevProps.advertisements) !== size(advertisements)
    ) {
      this.setState({ advertisements: {}, isEdit: false });
    }
  }

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = advertisements => {
    this.setState({ advertisements: advertisements });
    this.setState({ deleteModal: true });
  };

  handleDeleteAdvertisement = () => {
    const { onDeleteAdvertisement, onGetAdvertisements } = this.props;
    const { advertisements } = this.state;
    if (advertisements.id !== undefined) {
      onDeleteAdvertisement(advertisements);
      setTimeout(() => {
        onGetAdvertisements(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleAdvertisementClick = (e, arg) => {
    const advertisement = arg;

    this.setState({
      advertisement: {
        id: advertisement.id,
        title: advertisement.title,
        description: advertisement.description,
        poster: process.env.REACT_APP_BACKENDURL + advertisement.poster,
        posted_at: advertisement.posted_at,
        posted_till: advertisement.posted_till,
        region_type: advertisement.region_type,
        province: advertisement.province,
        city: advertisement.city,
        district: advertisement.district,
      },
      advertisementImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { advertisements } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewAdvertisement,
      onUpdateAdvertisement,
      onGetAdvertisements,
    } = this.props;
    const advertisement = this.state.advertisement;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 10, // replace later with size(advertisements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteAdvertisement}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Advertisement List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Advertisement List"
              breadcrumbItem="Advertisement List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.advertisementListColumns}
                      data={advertisements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.advertisementListColumns}
                          data={advertisements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleAdvertisementClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Advertisement
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Quality Advertisement"
                                          : "Add Quality Advertisement"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,

                                            title:
                                              (this.state.advertisement &&
                                                this.state.advertisement
                                                  .title) ||
                                              "",
                                            description:
                                              (this.state.advertisement &&
                                                this.state.advertisement
                                                  .description) ||
                                              "",
                                            poster:
                                              (this.state &&
                                                this.state.advertisementImg) ||
                                              "",
                                            posted_at:
                                              (this.state &&
                                                this.state.posted_at) ||
                                              "",
                                            posted_till:
                                              (this.state &&
                                                this.state.posted_till) ||
                                              "",
                                            region_type:
                                              (this.state.advertisement &&
                                                this.state.advertisement
                                                  .region_type) ||
                                              "",
                                            province:
                                              (this.state &&
                                                this.state.province) ||
                                              "",
                                            city:
                                              (this.state && this.state.city) ||
                                              "",
                                            district:
                                              (this.state &&
                                                this.state.district) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            // name: Yup.string()
                                            //   .trim()
                                            //   .matches(
                                            //     /^[a-zA-Z][a-zA-Z ]+$/,
                                            //     "Please enter only alphabets and spaces"
                                            //   )
                                            //   .required("Please enter name"),
                                            // name: Yup.string().when(
                                            //   "region_type",
                                            //   {
                                            //     is: val => val === "Others",
                                            //     then: Yup.string()
                                            //       .trim()
                                            //       .required("Please enter test name")
                                            //       .min(
                                            //         3,
                                            //         "Please enter at least 3 characters"
                                            //       )
                                            //       .max(
                                            //         255,
                                            //         "Please enter maximum 255 characters"
                                            //       )
                                            //       .matches(
                                            //         /^[a-zA-Z][a-zA-Z ]+$/,
                                            //         "Please enter only alphabets and spaces"
                                            //       ),
                                            //   }
                                            // ),

                                            poster: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload poster"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (
                                                !this.state.advertisementImg
                                              ) {
                                                this.toDataURL(
                                                  advertisement.poster
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      advertisement.poster
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    advertisementImg: fileData,
                                                  });

                                                  const updateAdvertisement = {
                                                    id: advertisement.id,

                                                    title: values.title,
                                                    description:
                                                      values.description,
                                                    poster:
                                                      this.state
                                                        .advertisementImg,

                                                    posted_at: values.posted_at,
                                                    posted_till:
                                                      values.posted_till,
                                                    region_type:
                                                      values.region_type,
                                                    province: values.province,
                                                    city: values.city,
                                                    district: values.district,
                                                  };

                                                  // update Advertisement
                                                  onUpdateAdvertisement(
                                                    updateAdvertisement
                                                  );
                                                  setTimeout(() => {
                                                    onGetAdvertisements(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateAdvertisement = {
                                                  id: advertisement.id,

                                                  title: values.title,
                                                  description:
                                                    values.description,
                                                  poster:
                                                    this.state.advertisementImg,

                                                  posted_at: values.posted_at,
                                                  posted_till:
                                                    values.posted_till,
                                                  region_type:
                                                    values.region_type,
                                                  province: values.province,
                                                  city: values.city,
                                                  district: values.district,
                                                };

                                                // update Advertisement
                                                onUpdateAdvertisement(
                                                  updateAdvertisement
                                                );
                                                setTimeout(() => {
                                                  onGetAdvertisements(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newAdvertisement = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,

                                                title: values.title,
                                                description: values.description,
                                                poster:
                                                  this.state.advertisementImg,

                                                posted_at: values.posted_at,
                                                posted_till: values.posted_till,
                                                region_type: values.region_type,
                                                province: values.province,
                                                city: values.city,
                                                district: values.district,
                                              };

                                              // save new Advertisement
                                              onAddNewAdvertisement(
                                                newAdvertisement,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetAdvertisements(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  {/* Advertisement Title field
                                                  {this.state.advertisement
                                                    .region_type ===
                                                    "Others" && (
                                                  
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Advertisement title
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .advertisement
                                                          .name
                                                      }
                                                      onChange={e => {
                                                        
                                                          this.setState({
                                                            advertisement:
                                                              {
                                                                id: advertisement.id,
                                                                region_type: advertisement.region_type,
                                                                name: e.target
                                                                  .value,
                                                                type: advertisement.type,
                                                                poster:
                                                                  advertisement.poster,
                                                                expiry_date: advertisement.expiry_date,
                                                              },
                                                          });
                                                        } 
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
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
                                               
                                                    )} */}
                                                  {/* Region Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Title
                                                    </Label>
                                                    <Field
                                                      name="title"
                                                      type="text"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          advertisement: {
                                                            id: advertisement.id,

                                                            title:
                                                              e.target.value,
                                                            poster:
                                                              advertisement.poster,
                                                            description:
                                                              advertisement.description,
                                                            posted_at:
                                                              advertisement.posted_at,
                                                            posted_till:
                                                              advertisement.posted_till,
                                                            region_type:
                                                              advertisement.region_type,
                                                            province:
                                                              advertisement.province,
                                                            city: advertisement.city,
                                                            district:
                                                              advertisement.district,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={this.state.title}
                                                    ></Field>
                                                  </div>

                                                   {/* Description field */}
                                                   <div className="mb-3">
                                                    <Label className="form-label">
                                                    Description
                                                    </Label>
                                                    <Field
                                                      name="description"
                                                      type="text"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          advertisement: {
                                                            id: advertisement.id,

                                                            description:
                                                              e.target.value,
                                                            poster:
                                                              advertisement.poster,
                                                            title:
                                                              advertisement.title,
                                                            posted_at:
                                                              advertisement.posted_at,
                                                            posted_till:
                                                              advertisement.posted_till,
                                                            region_type:
                                                              advertisement.region_type,
                                                            province:
                                                              advertisement.province,
                                                            city: advertisement.city,
                                                            district:
                                                              advertisement.district,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={this.state.description}
                                                    ></Field>
                                                  </div>

                                                  {/* Display current image in edit form only */}
                                                  {advertisement.poster &&
                                                  advertisement.poster ? (
                                                    <CardImg
                                                      className="img-fluid"
                                                      src={advertisement.poster}
                                                      alt="Responsive image"
                                                    />
                                                  ) : null}

                                                  {/* Advertisement field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="poster"
                                                      className="form-label"
                                                    >
                                                      Advertisement
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="poster"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,.pdf"
                                                      onChange={e =>
                                                        this.setState({
                                                          advertisementImg:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.poster &&
                                                        touched.poster
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="poster"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Advertisement posted date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Posted Date
                                                    </Label>
                                                    <input
                                                      name="posted_at"
                                                      type="datetime-local"
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                      onChange={e =>
                                                        this.setState({
                                                          posted_at:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                  </div>
                                                  {/* Advertisement expiry date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Posted till
                                                    </Label>
                                                    <input
                                                      name="posted_till"
                                                      type="datetime-local"
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                      onChange={e =>
                                                        this.setState({
                                                          posted_till:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                  </div>

                                                  {/* Region Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Region Type
                                                    </Label>
                                                    <Field
                                                      name="region_type"
                                                      as="select"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          qualityAdvertisement:
                                                            {
                                                              id: advertisement.id,

                                                              title:
                                                                advertisement.title,
                                                              poster:
                                                                advertisement.poster,
                                                              description:
                                                                advertisement.description,
                                                              posted_at:
                                                                advertisement.posted_at,
                                                              posted_till:
                                                                advertisement.posted_till,
                                                              region_type:
                                                                e.target.value,
                                                              province:
                                                                advertisement.province,
                                                              city: advertisement.city,
                                                              district:
                                                                advertisement.district,
                                                            },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state.region_type
                                                      }
                                                    >
                                                      <option value="All">
                                                        All
                                                      </option>
                                                      <option value="Province">
                                                        Province
                                                      </option>
                                                      <option value="City">
                                                        City
                                                      </option>
                                                      <option value="District">
                                                        District
                                                      </option>
                                                    </Field>
                                                  </div>

                                                 {/* Province field */}
                                                 <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    Province
                                  </Label>
                                  <Field
                                    name="province"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        province: e.target.value,
                                      })
                                    }
                                    value={this.state.province}
                                    className="form-select"
                                  >
                                    <option value="Punjab">Punjab</option>
                                    <option value="Sindh">Sindh</option>
                                    <option value="Balochistan">
                                      Balochistan
                                    </option>
                                    <option value="Khyber Pakhtunkhawa">
                                      Khyber Pakhtunkhawa
                                    </option>
                                    <option value="Islamabad Capital Territory">
                                      Islamabad Capital Territory
                                    </option>
                                  </Field>
                                </div>


                                {/* District field */}
                                <div className="mb-3">
                          <Label for="district" className="form-label">
                            District
                          </Label>
                          <Select
                            name="district"
                            component="Select"
                            onChange={selectedGroup =>
                              this.setState({
                                district: selectedGroup.value,
                              })
                            }
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderColor:
                                  errors.district && touched.district
                                    ? "#f46a6a"
                                    : "#ced4da",
                              }),
                            }}
                            className={
                              "defautSelectParent" +
                              (errors.district && touched.district
                                ? " is-invalid"
                                : "")
                            }
                            options={DISTRICTS}
                            placeholder="Select District..."
                          />

                          <ErrorMessage
                            name="district"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>


                                {/* city field */}
                        <div className="mb-3">


                          <Label for="city" className="form-label">
                            City
                          </Label>
                              <Select
                                name="city"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    city: selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (errors.city && touched.city
                                    ? " is-invalid"
                                    : "")
                                }
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderColor:
                                      errors.city && touched.city
                                        ? "#f46a6a"
                                        : "#ced4da",
                                  }),
                                }}
                                options={CITIES}
                                placeholder="Select City..."
                              />

                              <ErrorMessage
                                name="city"
                                component="div"
                                className="invalid-feedback"
                              />
                        </div>
                                                 
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

AdvertisementsList.propTypes = {
  match: PropTypes.object,
  advertisements: PropTypes.array,
  className: PropTypes.any,
  onGetAdvertisements: PropTypes.func,
  onAddNewAdvertisement: PropTypes.func,
  onDeleteAdvertisement: PropTypes.func,
  onUpdateAdvertisement: PropTypes.func,

};

const mapStateToProps = ({ advertisements }) => ({
  advertisements: advertisements.advertisements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAdvertisements: id => dispatch(getAdvertisements(id)),
  onAddNewAdvertisement: (advertisement, id) =>
    dispatch(addNewAdvertisement(advertisement, id)),
  onUpdateAdvertisement: advertisement =>
    dispatch(updateAdvertisement(advertisement)),
  onDeleteAdvertisement: advertisement =>
    dispatch(deleteAdvertisement(advertisement)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdvertisementsList));
