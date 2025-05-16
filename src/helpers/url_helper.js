//REGISTER ORIGINAL

const API_ENDPOINT = process.env.REACT_APP_BACKENDURL;

// -------------- MY URLS --------------
export const POST_LOGIN = `${API_ENDPOINT}/api/account/login/`;
export const POST_REGISTER = `${API_ENDPOINT}/api/account/register/`;
// PASSWORD RESET
export const POST_FORGET_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/`;
export const POST_CONFIRM_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/confirm/`;
export const POST_CHANGE_PASSWORD = `${API_ENDPOINT}/api/account/change-password/`;



export const POST_LAB_INFORMATION = `${API_ENDPOINT}/api/lab/lab-information`;
export const POST_CORPORATE_INFORMATION = `${API_ENDPOINT}/api/corporate/corporate-information`;
// database admin

/////////Sample
export const GET_SAMPLE_LIST = `${API_ENDPOINT}/api/database-admin/sample-list`;
export const ADD_NEW_SAMPLE_LIST = `${API_ENDPOINT}/api/database-admin/post-sample-list`;
export const UPDATE_NEW_SAMPLE_LIST  = `${API_ENDPOINT}/api/database-admin/update-sample-list`;
export const UPDATE_SAMPLE_LIST  = `${API_ENDPOINT}/api/database-admin/update-sample-list`;
export const DELETE_NEW_SAMPLE_LIST = `${API_ENDPOINT}/api/database-admin/delete-sample`;

// Sample Analyte
export const GET_SAMPLE_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/sample-analyte-list`;
export const ADD_SAMPLE_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/sample-add-analyte`;
export const UPDATE_SAMPLE_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/sample-update-analyte`;


export const GET_UNITS_LIST = `${API_ENDPOINT}/api/database-admin/units_list`;
export const ADD_NEW_UNITS = `${API_ENDPOINT}/api/database-admin/units_create`;
export const UPDATE_UNITS = `${API_ENDPOINT}/api/database-admin/units_update`;
export const GET_HISTORY_LIST = `${API_ENDPOINT}/api/database-admin/history_list`;

export const GET_QualitativeType_LIST = `${API_ENDPOINT}/api/database-admin/qualitativetype-list`;
export const ADD_NEW_QualitativeType = `${API_ENDPOINT}/api/database-admin/qualitativetype-create`;
export const UPDATE_QualitativeType = `${API_ENDPOINT}/api/database-admin/qualitativetype-update`;

export const GET_REAGENTS_LIST = `${API_ENDPOINT}/api/database-admin/reagent_list`;
export const ADD_NEW_REAGENTS = `${API_ENDPOINT}/api/database-admin/reagent_create`;
export const UPDATE_REAGENTS = `${API_ENDPOINT}/api/database-admin/reagent_update`;
export const DELETE_REAGENT = `${API_ENDPOINT}/api/database-admin/delete-reagent`;


export const GET_MANUFACTURAL_LIST = `${API_ENDPOINT}/api/database-admin/manufactural_list`;
export const ADD_NEW_MANUFACTURAL = `${API_ENDPOINT}/api/database-admin/manufactural_create`;
export const UPDATE_MANUFACTURAL = `${API_ENDPOINT}/api/database-admin/manufactural_update`;
export const DELETE_MANUFACTURER = `${API_ENDPOINT}/api/database-admin/delete-manufacturer`;

export const GET_INSTRUMENT_TYPE_LIST = `${API_ENDPOINT}/api/database-admin/instrument-type-list`;
export const ADD_NEW_INSTRUMENT_TYPE = `${API_ENDPOINT}/api/database-admin/instrument-type-create-list`;
export const UPDATE_NEW_INSTRUMENT_TYPE = `${API_ENDPOINT}/api/database-admin/update-instrument-type-list`;
export const ADD_EQUIPMENTTYPE_FILE = `${API_ENDPOINT}/api/database-admin/instrument-type-file`;
export const DELETE_INSTRUMENT_TYPE = `${API_ENDPOINT}/api/database-admin/delete-instrumenttype`;

export const GET_METHOD_LIST = `${API_ENDPOINT}/api/database-admin/methods-list`;
export const ADD_NEW_METHOD = `${API_ENDPOINT}/api/database-admin/methods-create-list`;
export const UPDATE_METHOD = `${API_ENDPOINT}/api/database-admin/update-method-list`;

export const GET_SCHEME_LIST = `${API_ENDPOINT}/api/database-admin/scheme-list`;
export const ADD_NEW_SCHEME = `${API_ENDPOINT}/api/database-admin/scheme-list`;
export const GET_SCHEMEANALYTE = `${API_ENDPOINT}/api/database-admin/scheme-analytename-list`;
export const GET_SCHEMENAME = `${API_ENDPOINT}/api/database-admin/scheme-list`;
export const UPDATE_SCHEME = `${API_ENDPOINT}/api/database-admin/update-scheme`;
export const DELETE_SCHEME = `${API_ENDPOINT}/api/database-admin/delete-scheme`;
export const DELETE_METHOD = `${API_ENDPOINT}/api/database-admin/delete-method`;

export const GET_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/analyte-list`;
export const GET_ANALYTEFORSCHEME_LIST = `${API_ENDPOINT}/api/database-admin/analyte-for-scheme`;
export const ADD_NEW_ANALYTE = `${API_ENDPOINT}/api/database-admin/analyte-create-list`;
export const UPDATE_ANALYTE = `${API_ENDPOINT}/api/database-admin/update-analyte`;
export const DELETE_ANALYTE = `${API_ENDPOINT}/api/database-admin/delete-analyte`;

export const GET_CYCLE_LIST = `${API_ENDPOINT}/api/database-admin/cycle-list`;
export const ADD_NEW_CYCLE = `${API_ENDPOINT}/api/database-admin/post-cycle`;
export const UPDATE_CYCLE = `${API_ENDPOINT}/api/database-admin/update-cycle-list`;
export const DELETE_CYCLE = `${API_ENDPOINT}/api/database-admin/delete-cycle`;
export const DELETE_CYCLE_ROUND_LIST = `${API_ENDPOINT}/api/database-admin/delete-round-cycle`;
//Participant
export const GET_PARTICIPANT_LIST = `${API_ENDPOINT}/api/lab/participant-information`;

// Round Participant
export const GET_PARTICIPANTROUND_LIST = `${API_ENDPOINT}/api/registration-admin/participent-rount`;
export const DELETE_PARTICIPANT = `${API_ENDPOINT}/api/registration-admin/remove-participant`;
// Rounds Labs
export const GET_ROUND_LABS = `${API_ENDPOINT}/api/registration-admin/round-labs-list`;
export const ADD_NEW_PAYMENT = `${API_ENDPOINT}/api/registration-admin/add-payment`;
export const ADD_ROUND_LABS = `${API_ENDPOINT}/api/registration-admin/round-add-lab`;
export const UPDATE_ROUNDLABS = `${API_ENDPOINT}/api/registration-admin/round-update-lab`;
export const GET_ROUND_PARTICIPANT_LIST = `${API_ENDPOINT}/api/registration-admin/round-participant-list`;
// Selected-Schemes, Result Page Participant
export const SELECTED_SCHEMES= `${API_ENDPOINT}/api/registration-admin/selectedSchemes-list`;
export const SCHEMES_ANALYTES= `${API_ENDPOINT}/api/registration-admin/analyteSpecificScheme-list`;
export const POST_RESULT= `${API_ENDPOINT}/api/registration-admin/resultpost`;
export const GET_RESULT= `${API_ENDPOINT}/api/registration-admin/getResultsData`;
export const GET_STATISTICS= `${API_ENDPOINT}/api/registration-admin/getStatistics`;
export const GET_RESULT_SUBMIT= `${API_ENDPOINT}/api/registration-admin/getAnalyteResultSubmit`;
export const GET_REPORT= `${API_ENDPOINT}/api/registration-admin/getReport`;
export const GET_HISTORY_LIST_ROUND = `${API_ENDPOINT}/api/registration-admin/history_list`;
export const GET_RESULT_HISTORY = `${API_ENDPOINT}/api/registration-admin/result-history_list`;
export const GET_SUBMITTED_PARTICIPANTS = `${API_ENDPOINT}/api/registration-admin/submitted-participants`;
export const GET_ANALYTE_RESULT_PARTICIPANT = `${API_ENDPOINT}/api/registration-admin/analyte-submiited-resultParticipant`;

// Analyte Reagents
export const GET_ANALYTE_REAGENTS = `${API_ENDPOINT}/api/database-admin/analyte-reagents-list`;
export const ADD_ANALYTE_REAGENTS = `${API_ENDPOINT}/api/database-admin/analyte-add-reagent`;
export const UPDATE_ANALYTEREAGENTS = `${API_ENDPOINT}/api/database-admin/analyte-update-reagent`;

// Analyte Qualitative
export const GET_ANALYTE_QUALITATIVE = `${API_ENDPOINT}/api/database-admin/analyte-qualitativeunits-list`;
export const ADD_ANALYTE_QUALITATIVE = `${API_ENDPOINT}/api/database-admin/analyte-add-qualitativeunits`;
export const UPDATE_ANALYTEQUALITATIVE = `${API_ENDPOINT}/api/database-admin/analyte-update-qualitativeunits`;



export const GET_ANALYTESEQUIPMENTS_LIST = `${API_ENDPOINT}/api/database-admin/analyte-equipments-list`;
export const ADD_NEW_ANALYTESEQUIPMENTS = `${API_ENDPOINT}/api/database-admin/analyte-add-equipments`;
export const UPDATE_ANALYTESEQUIPMENTS = `${API_ENDPOINT}/api/database-admin/analyte-update-equipments`;

export const GET_ANALYTESMETHODS_LIST = `${API_ENDPOINT}/api/database-admin/analyte-methods-list`;
export const ADD_NEW_ANALYTESMETHODS = `${API_ENDPOINT}/api/database-admin/analyte-add-methods`;
export const UPDATE_ANALYTESMETHODS = `${API_ENDPOINT}/api/database-admin/analyte-update-methods`;

export const GET_ANALYTESUNITS_LIST = `${API_ENDPOINT}/api/database-admin/analyte-units-list`;
export const ADD_NEW_ANALYTESUNITS = `${API_ENDPOINT}/api/database-admin/analyte-add-units`;
export const UPDATE_ANALYTESUNITS = `${API_ENDPOINT}/api/database-admin/analyte-update-units`;
//analyes associated with unit
export const GET_ANALYTESUNITS = `${API_ENDPOINT}/api/database-admin/analyte-units`;
export const GET_ANALYTESMETHODS = `${API_ENDPOINT}/api/database-admin/analyte-methods`;
export const GET_ANALYTESREAGENTS = `${API_ENDPOINT}/api/database-admin/analyte-reagents`;
export const GET_ANALYTESINSTRUMENTS = `${API_ENDPOINT}/api/database-admin/analyte-instruments`;


export const GET_INSTRUMENTSINTYPE = `${API_ENDPOINT}/api/database-admin/instrument-instrumenttype`;
export const GET_INSTRUMENTSINMANUFACTURER = `${API_ENDPOINT}/api/database-admin/instrument-manufacturer`;
export const GET_REAGENTSINMANUFACTURER = `${API_ENDPOINT}/api/database-admin/reagent-manufacturer`;

////participant
export const GET_CITY_LIST = `${API_ENDPOINT}/api/database-admin/city_list`;
export const ADD_NEW_CITY = `${API_ENDPOINT}/api/database-admin/city_create`;
export const UPDATE_CITY = `${API_ENDPOINT}/api/database-admin/city_update`;

export const GET_COUNTRY_LIST = `${API_ENDPOINT}/api/database-admin/country_list`;
export const ADD_NEW_COUNTRY = `${API_ENDPOINT}/api/database-admin/country_create`;
export const UPDATE_COUNTRY = `${API_ENDPOINT}/api/database-admin/country_update`;

export const GET_PROVINCE_LIST = `${API_ENDPOINT}/api/database-admin/province_list`;
export const ADD_NEW_PROVINCE = `${API_ENDPOINT}/api/database-admin/province_create`;
export const UPDATE_PROVINCE = `${API_ENDPOINT}/api/database-admin/province_update`;

export const GET_DISTRICT_LIST = `${API_ENDPOINT}/api/database-admin/district_list`;
export const ADD_NEW_DISTRICT = `${API_ENDPOINT}/api/database-admin/district_create`;
export const UPDATE_DISTRICT = `${API_ENDPOINT}/api/database-admin/district_update`;

export const GET_DEPARTMENT_LIST = `${API_ENDPOINT}/api/database-admin/department_list`;
export const ADD_NEW_DEPARTMENT = `${API_ENDPOINT}/api/database-admin/department_create`;
export const UPDATE_DEPARTMENT = `${API_ENDPOINT}/api/database-admin/department_update`;

export const GET_DESIGNATION_LIST = `${API_ENDPOINT}/api/database-admin/designation_list`;
export const ADD_NEW_DESIGNATION = `${API_ENDPOINT}/api/database-admin/designation_create`;
export const UPDATE_DESIGNATION = `${API_ENDPOINT}/api/database-admin/designation_update`;

export const GET_TYPE_LIST = `${API_ENDPOINT}/api/database-admin/participanttype_list`;
export const ADD_NEW_TYPE = `${API_ENDPOINT}/api/database-admin/participanttype_create`;
export const UPDATE_TYPE = `${API_ENDPOINT}/api/database-admin/participanttype_update`;

export const GET_SECTOR_LIST = `${API_ENDPOINT}/api/database-admin/participantsector_list`;
export const ADD_NEW_SECTOR = `${API_ENDPOINT}/api/database-admin/participantsector_create`;
export const UPDATE_SECTOR = `${API_ENDPOINT}/api/database-admin/participantsector_update`;

export const REGISTER_PARTICIPANT_LIST = `${API_ENDPOINT}/api/lab/register-participants-file`;

////////////news

export const GET_NEWS = `${API_ENDPOINT}/api/database-admin/news-list`;
export const ADD_NEWS = `${API_ENDPOINT}/api/database-admin/news-add`;


export const GET_INSTRUMENT_LIST = `${API_ENDPOINT}/api/database-admin/instrument-list`;
export const ADD_NEW_INSTRUMENT = `${API_ENDPOINT}/api/database-admin/instrument-create`;
export const UPDATE_NEW_INSTRUMENT = `${API_ENDPOINT}/api/database-admin/update-instrument-list`;
export const DELETE_INSTRUMENT = `${API_ENDPOINT}/api/database-admin/delete-instrument`;

export const GET_INSTRUMENT_DETAIL = `${API_ENDPOINT}/api/database-admin/instrument-detail`;
export const GET_INSTRUMENT_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/instrument-analyte-list`;
export const ADD_INSTRUMENT_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/instrument-add-analyte`;
export const UPDATE_INSTRUMENT_ANALYTE_LIST = `${API_ENDPOINT}/api/database-admin/instrument-update-analyte`;
// Scheme Analytes
export const GET_SCHEME_ANALYTE = `${API_ENDPOINT}/api/database-admin/scheme-analyte-list`;
export const ADD_SCHEME_ANALYTE = `${API_ENDPOINT}/api/database-admin/scheme-add-analyte`;
export const UPDATE_SCHEME_ANALYTE = `${API_ENDPOINT}/api/database-admin/scheme-update-analyte`;

// Cycle Analytes
export const GET_ANALYTESCYCLES = `${API_ENDPOINT}/api/database-admin/analyte-cycles`;

/// ORGANIZATION REGISTER
export const ORGANIZATION_REGISTER = `${API_ENDPOINT}/api/account/register/`;
export const GET_ORGANIZATION_LIST = `${API_ENDPOINT}/api/organizationdata/organization-list`;
export const UPDATE_ORGANIZATION_LIST = `${API_ENDPOINT}/api/organizationdata/update-organization-list`;
// export const DELETE_ORGANIZATION_LIST = `${API_ENDPOINT}/api/organizationdata/delete-organization-list`;
// LAB LIST
export const GET_LABS = `${API_ENDPOINT}/api/finance-officer/lab-MOF-list`;
export const GET_ALL_LABS_LIST = `${API_ENDPOINT}/api/finance-officer/labs-list`;
export const GET_MAIN_LABS = `${API_ENDPOINT}/api/lab/lab-list`;

export const GET_PARTICIPANT_SCHEME_LIST = `${API_ENDPOINT}/api/registration-admin/payment-scheme-list`;
// TEST
export const GET_TESTS = `${API_ENDPOINT}/api/medicaltest/test-list`;
export const GET_UNITS = `${API_ENDPOINT}/api/medicaltest/unit-list`;

// OFFERED TEST
export const GET_OFFERED_TESTS = `${API_ENDPOINT}/api/lab/offered-test-list`;
export const GET_OFFEREDTEST_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-test-share-list`;
export const GET_OFFEREDPROFILE_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-profile-share-list`;
export const GET_OFFEREDPACKAGE_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-package-share-list`;
export const GET_OFFEREDRADIOLOGY_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-radiology-share-list`;
export const ADD_NEW_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const ADD_NEW_OFFERED_MAINTEST = `${API_ENDPOINT}/api/lab/offered-test-main-lab`;
export const UPDATE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const DELETE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;

// Corporates
export const GET_COFFEREDTEST_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-test-share-list`;
export const GET_COFFEREDPROFILE_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-profile-share-list`;
export const GET_COFFEREDPACKAGE_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-packages-share-list`;
export const GET_COFFEREDRADIOLOGY_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-radiology-share-list`;
export const GET_CORPORATE_LIST = `${API_ENDPOINT}/api/corporate/list-corporate`;
// PATHOLOGIST
export const GET_ACTIVITY_LOG = `${API_ENDPOINT}/api/lab/activity-log`;
export const GET_NOTIFICATION = `${API_ENDPOINT}/api/lab/notifications`;
export const GET_SAMPLE_NOTIFICATION = `${API_ENDPOINT}/api/lab/sample-collector-notifications`;
export const GET_MARKETER_NOTIFICATION = `${API_ENDPOINT}/api/marketer-admin/marketer-notification`;
export const GET_CSR_ADMIN_NOTIFICATION = `${API_ENDPOINT}/api/csr-admin/csradmin-notification`;
export const GET_REG_ADMIN_NOTIFICATION = `${API_ENDPOINT}/api/registration-admin/regadmin-notification`;
export const GET_CSR_OFFICER_NOTIFICATION = `${API_ENDPOINT}/api/complaint/csrofficer-notification`;
export const GET_ACTIVITY_LOG_FINANCE = `${API_ENDPOINT}/api/finance-officer/activity-log-finance`;
export const GET_CORPORATE_COMMIT = `${API_ENDPOINT}/api/corporate/corporate-commit`;
export const GET_ACTIVITY_LOG_MARKETER = `${API_ENDPOINT}/api/marketer-admin/activity-log-marketer`;
export const GET_PATHOLOGISTS = `${API_ENDPOINT}/api/lab/pathologist-list`;
export const ADD_NEW_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const UPDATE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const DELETE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;


// CART
export const GET_CARTS = `${API_ENDPOINT}/api/patient/cart-list`;
export const EMPTY_CART = `${API_ENDPOINT}/api/patient/cart-list`;
export const DELETE_CART = `${API_ENDPOINT}/api/patient/cart-item`;
export const ADD_TO_CART = `${API_ENDPOINT}/api/patient/cart-item`;

export const GET_QUOTES = `${API_ENDPOINT}/api/patient/quote-list`;

// SAMPLE COLLECTOR
export const GET_SAMPLE_COLLECTORS = `${API_ENDPOINT}/api/lab/sample-collector-list`;
export const ADD_NEW_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const UPDATE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const DELETE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const GET_ANALYTESSAMPLE = `${API_ENDPOINT}/api/database-admin/analyte-samples`;
// QUALITY CERTIFICATES
export const ADD_NEW_COLLECTIONPOINT_QUALITY = `${API_ENDPOINT}/api/lab/quality-certificate-collectionpoint-list`;
export const GET_QUALITY_CERTIFICATES = `${API_ENDPOINT}/api/lab/quality-certificate-list`;
export const ADD_NEW_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const UPDATE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const DELETE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;

// ADVERTISEMENTS
export const GET_ADVERTISEMENTS = `${API_ENDPOINT}/api/marketer-admin/advertisement-list`;
export const ADD_NEW_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;
export const UPDATE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;
export const DELETE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;

// LAB ADVERTISEMENTS
export const GET_LAB_ADVERTISEMENTS = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const ADD_NEW_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const UPDATE_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const DELETE_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;

// LAB ADVERTISEMENTS REQUESTS PENDING
export const GET_LAB_ADVERTISEMENT_REQUESTS = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-request`;
export const UPDATE_LAB_ADVERTISEMENT_REQUEST = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-request`;

// LAB ADVERTISEMENTS REQUESTS ACCEPTED
export const GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-accepted-list`;

// ADVERTISEMENTS LIVE
export const GET_ADVERTISEMENT_LIVES = `${API_ENDPOINT}/api/marketer-admin/advertisement-live`;

// ADVERTISEMENTS LIVE
export const GET_ADV_LIVE = `${API_ENDPOINT}/api/marketer-admin/advertisement-live`;

// ADVERTISEMENT PRICE LIST
export const GET_ADVERTISEMENT_PRICE_LISTS = `${API_ENDPOINT}/api/marketer-admin/advertisement-price-list`;
export const ADD_NEW_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;
export const UPDATE_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;
export const DELETE_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;

// DISCOUNT NHS NEQAS
export const GET_DISCOUNT_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-test`;
export const UPDATE_DISCOUNT_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-test`;
export const UPDATE_DISCOUNT_ALL_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-all-tests`;
export const GET_LABS_LIST = `${API_ENDPOINT}/api/marketer-admin/labs-list`;
export const GET_DISCOUNT_LABHAZIRTOLABS = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-test`; 
export const UPDATE_DISCOUNT_LABHAZIRTOLAB = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-test`;
export const UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-all-tests`;


export const GET_REFERREL_FEES = `${API_ENDPOINT}/api/registration-admin/referrel-fee-labhazir`;
export const GET_PUT_REFERREL_FEES = `${API_ENDPOINT}/api/registration-admin/approve-referrel-fee-labhazir`;
export const UPDATE_REFERREL_FEE = `${API_ENDPOINT}/api/registration-admin/update-referrel-fee-labhazir`;
export const UPDATE_REFERREL_ALL_FEE = `${API_ENDPOINT}/api/registration-admin/all-referrel-fee-labhazir`;
export const GET_LABS_LIST_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/lab-list-pending`;
export const GET_LABS_LIST_APPROVED_FEE = `${API_ENDPOINT}/api/registration-admin/lab-list-approved`;
export const GET_SHARED_PERCENTAGE_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_pending_tests`;
export const GET_SHARED_PERCENTAGE_APPROVED_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_Approved_tests`;
export const UPDATE_SHARED_PERCENTAGE_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_pending_tests`;
export const UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_all_pending_tests`;

// DISCOUNT LAB
export const GET_DISCOUNT_LAB = `${API_ENDPOINT}/api/lab/offered-test-discount-list`;
export const UPDATE_DISCOUNT_LAB = `${API_ENDPOINT}/api/lab/discount-offered-test`;
export const UPDATE_DISCOUNT_ALL_LAB = `${API_ENDPOINT}/api/lab/discount-all-offered-tests`;
export const GET_FEEDBACKS = `${API_ENDPOINT}/api/lab/feedback-list`;

// TERRITORIES LIST
export const GET_TERRITORIES_LIST = `${API_ENDPOINT}/api/territories/district-city-list`;

// CORPORATES LIST
export const GET_CORPORATES_LIST = `${API_ENDPOINT}/api/corporate/corporates-list`;

// TERRITORIES LIST
export const GET_LAB_NAMES_LIST = `${API_ENDPOINT}/api/lab/lab-names`;

// MEDICAL LIST
export const GET_ONLY_MEDICAL_LIST = `${API_ENDPOINT}/api/medicaltest/only-medical-tests`;

// CSR CENTRAL TERRITORIES LIST
export const GET_CSR_CENTRAL_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-central-list`;
// CSR SOUTH TERRITORIES LIST
export const GET_CSR_SOUTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-south-list`;
// CSR NORTH TERRITORIES LIST
export const GET_CSR_NORTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-north-list`;


// AUDITOR CENTRAL TERRITORIES LIST
export const GET_AUDITOR_CENTRAL_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-central-list`;
// auditor SOUTH TERRITORIES LIST
export const GET_AUDITOR_SOUTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-south-list`;
// auditor NORTH TERRITORIES LIST
export const GET_AUDITOR_NORTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-north-list`;


// TEST APPOINTMENT
export const ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT = `${API_ENDPOINT}/api/lab/test-appointment-collectionpoint-list`;
export const GET_TEST_APPOINTMENTS_PENDING_LIST = `${API_ENDPOINT}/api/lab/test-appointment-pending-list`;
export const GET_TEST_APPOINTMENTS_IN_PROCESS_LIST = `${API_ENDPOINT}/api/lab/test-appointment-in-process-list`;
export const GET_TEST_APPOINTMENTS_COMPLETED_LIST = `${API_ENDPOINT}/api/lab/test-appointment-completed-list`;
export const UPDATE_TEST_APPOINTMENT = `${API_ENDPOINT}/api/lab/test-appointment-update`;

// PAYMENT IN STATUS
export const GET_ACCEPTED_LAB_ADVERTISEMENTS = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-accepted-list`;
export const GET_PAYMENT_IN_STATUS_CREATED_LIST = `${API_ENDPOINT}/api/finance-officer/get-payment-in-created`;
export const GET_PAYMENT_IN_STATUS_DEPOSITED_LIST = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_LABS_MOF = `${API_ENDPOINT}/api/finance-officer/lab-MOF-list`;
export const GET_LABS_C = `${API_ENDPOINT}/api/finance-officer/lab-c-list`;
export const GET_PARTICIPANT_PAYMENT = `${API_ENDPOINT}/api/registration-admin/payment-list`;


// CSR (COMPLAINTS)
export const GET_UNHANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/unhandled-complaints`;
export const UPDATE_UNHANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/unhandled-complaints`;
export const GET_HANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/handled-complaints`;
export const GET_CSR_COMPLAINTS = `${API_ENDPOINT}/api/staff/csr-appointment`;
export const UPDATE_CSR_COMPLAINTS = `${API_ENDPOINT}/api/staff/csr-appointment`;
export const GET_CSR_APPOINTMENTS = `${API_ENDPOINT}/api/staff/csr-admin-appointment`;
export const UPDATE_CSR_APPOINTMENTS = `${API_ENDPOINT}/api/staff/csr-admin-appointment`;
export const ADD_NEW_NOTE_COMPLAINT =`${API_ENDPOINT}/api/complaint/add-note`;
export const GET_NOTES_COMPLAINT = `${API_ENDPOINT}/api/complaint/add-note`;

export const ADD_NEW_NOTE =`${API_ENDPOINT}/api/staff/add-note`;
export const GET_NOTES = `${API_ENDPOINT}/api/staff/add-note`;
export const ADD_NEW_MSG =`${API_ENDPOINT}/api/marketer-admin/add-message`;
export const GET_MSGS = `${API_ENDPOINT}/api/marketer-admin/add-message`;
// TEST DESCRIPTION
export const GET_TEST_DESCRIPTIONS = `${API_ENDPOINT}/api/medicaltest/test`;

// LAB PROFILES
export const GET_LAB_PROFILE = `${API_ENDPOINT}/api/lab/lab-profile`;
export const UPDATE_LAB_PROFILE = `${API_ENDPOINT}/api/lab/lab-profile`;

export const UPDATE_LABS = `${API_ENDPOINT}/api/lab/update-lab-list/`;
// ADD CORPORATE EMPLOYEE DATA
export const ADD_NEW_CEMPLOYEE_DATA = `${API_ENDPOINT}/api/corporate/employee-data`;
export const GET_CEMPLOYEE = `${API_ENDPOINT}/api/corporate/employee-list`;
export const GET_LABCORPORATE = `${API_ENDPOINT}/api/lab/corporatelist`;
export const GET_ALABCORPORATE = `${API_ENDPOINT}/api/lab/accepted-corporates-list`;
export const GET_ACORPORATE = `${API_ENDPOINT}/api/corporate/all-corporates-list`;
export const GET_RFeeCORPORATE = `${API_ENDPOINT}/api/lab/corporate-feffrellfee`;
export const UPDATE_ACORPORATE_STATUS = `${API_ENDPOINT}/api/corporate/update-corporate-list`;
export const GET_EMPLOYEECORPORATE = `${API_ENDPOINT}/api/corporate/employee-list`;
export const GET_LABSCORPORATE = `${API_ENDPOINT}/api/corporate/corporate-lab-list`;
export const UPDATE_CEMPLOYEE = `${API_ENDPOINT}/api/corporate/employee-data`;
export const ADD_NEW_CORPORATE_TEST = `${API_ENDPOINT}/api/corporate/corporate-offered-test`;
export const GET_CORPORATE_TESTS = `${API_ENDPOINT}/api/corporate/corporate-test-list`;
export const UPDATE_CORPORATE_TEST = `${API_ENDPOINT}/api/corporate/corporate-offered-test`;
export const UPDATE_CORPORATE_STATUS = `${API_ENDPOINT}/api/lab/accepted-corporates-list`;
export const ADD_NEW_CORPORATE = `${API_ENDPOINT}/api/lab/corporatelist`;
export const ADD_NEW_CEMPLOYEE_FILE = `${API_ENDPOINT}/api/corporate/employee-data-file`;
export const DELETE_CEDATA = `${API_ENDPOINT}/api/corporate/employee-data`;

// About All Finance

export const ADD_NEW_IN_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-in`;
export const GET_IN_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-in`;

export const ADD_NEW_OUT_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const ADD_NEW_CORPORATE_PAYMENT = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;
export const GET_OUT_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const DELETE_PAYMENTOUT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const GET_LIST_DONATIONAPPOINTMENT = `${API_ENDPOINT}/api/finance-officer/alldonation-Appointments`;
export const GET_LIST_CLABS = `${API_ENDPOINT}/api/finance-officer/all-lab-c-list`;


export const ADD_NEW_INVOICE_ADJUSTMENT = `${API_ENDPOINT}/api/finance-officer/invoice-adjustment-detail`;

// Get Invoice LIst
export const GET_LIST_INVOICE = `${API_ENDPOINT}/api/finance-officer/all-invoices-list`;

// Get DONATION Appointments
export const GET_ALL_DONATION_APPOINTMENTS = `${API_ENDPOINT}/api/finance-officer/donation-Appointments`;


export const GET_PAYMENT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-created`;
export const GET_DEPOSIT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_CLEAR_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-cleared`;
export const UPDATE_PAYMENT_STATUS = `${API_ENDPOINT}/api/finance-officer/payment-in`;
export const UPDATE_PAYMENTIN_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_BOUNCEDIN_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-bounced`;
export const UPDATE_PAYMENTINBOUNCED_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-bounced`;
export const GET_PAYMENTOUT_CLEAR_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-cleared`;





export const GET_PAYMENTOUT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-pending`;
export const GET_CREATEDOUT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-created`;
export const UPDATE_PAYMENTOUT_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-pending`;
export const UPDATE_PAYMENTOUTCREATED_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-created`;
export const GET_BOUNCED_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-bounced`;


// Corporate out payment lists
export const GET_CCREATEDOUT_STATUSS  = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;
export const UPDATE_PAYMENTOUTCCREATED_STATUS = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;

// LAB SETTINGS
export const GET_LAB_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;
export const UPDATE_LAB_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;


// COMPLAINT
export const ADD_NEW_COMPLAINT = `${API_ENDPOINT}/api/complaint/register-complaint`;

// corporate PROFILES
export const GET_CORPORATE_PROFILE = `${API_ENDPOINT}/api/corporate/corporate-profile`;
export const UPDATE_CORPORATE_PROFILE = `${API_ENDPOINT}/api/corporate/corporate-profile`;


// REGION WISE ADVERTISEMENT
export const GET_REGION_WISE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/region-wise-advertisements`;

// export const GET_CL_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-account-statements-list`;
export const GET_CL_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-statements-list`;

// NEARBY TESTS

export const GET_PROFILES = `${API_ENDPOINT}/api/medicaltest/profile-list`;
export const GET_TESTSS = `${API_ENDPOINT}/api/medicaltest/tests-list`;
export const GET_PACKAGES = `${API_ENDPOINT}/api/medicaltest/package-list`;

export const GET_RADIOLOGY = `${API_ENDPOINT}/api/medicaltest/radiology-list`;
export const GET_TESTS_LIST = `${API_ENDPOINT}/api/database-admin/scheme-analytes-list`;
export const GET_CORPORATE_TESTS_LIST = `${API_ENDPOINT}/api/database-admin/scheme-analytes-list`;

// INVOICES
export const GET_INVOICE_DETAIL = `${API_ENDPOINT}/api/patient/invoice-detail`;

// ADVERTISEMENT INVOICES
export const GET_ADV_INVOICE = `${API_ENDPOINT}/api/lab/lab-advertisement-invoice`;

// PAYMENT
export const UPDATE_LAB_PAYMENTS = `${API_ENDPOINT}/api/patient/payment-info`;
export const GET_LAB_PAYMENTS = `${API_ENDPOINT}/api/patient/payment-info`;

// ACCOUNT STATEMENTS
export const GET_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/lab-account-statements`;

// STAFF PROFILES
export const GET_STAFF_PROFILE = `${API_ENDPOINT}/api/staff/staff-profile`;

// STAFF PROFILES
export const UPDATE_STAFF_PROFILE = `${API_ENDPOINT}/api/staff/staff-profile`;
// NEARBY LABS
export const GET_NEARBY_LABS = `${API_ENDPOINT}/api/patient/nearby-labs`;
// SAMPLE COLLECTOR PROFILES
export const GET_SAMPLE_COLLECTOR_PROFILE = `${API_ENDPOINT}/api/samplecollector/sample-collector-profile`;
export const UPDATE_SAMPLE_COLLECTOR_PROFILE = `${API_ENDPOINT}/api/samplecollector/sample-collector-profile`;

// SAMPLE COLLECTOR TEST APPOINTMENTS
export const GET_SAMPLE_COLLECTION_IN_PROCESS_LIST = `${API_ENDPOINT}/api/samplecollector/sample-collector-in-process`;
export const GET_SAMPLE_COLLECTION_COMPLETED_LIST = `${API_ENDPOINT}/api/samplecollector/sample-collector-completed`;
export const UPDATE_SAMPLE_COLLECTION_STATUS = `${API_ENDPOINT}/api/samplecollector/sample-collector-in-process`;

// REGISTRATION ADMIN

export const GET_ROUND_LIST = `${API_ENDPOINT}/api/registration-admin/round-list`;
export const ADD_NEW_ROUND = `${API_ENDPOINT}/api/registration-admin/post-round`;
export const UPDATE_ROUND = `${API_ENDPOINT}/api/registration-admin/update-round-list`;
export const DELETE_ROUND = `${API_ENDPOINT}/api/registration-admin/delete-round`;
export const UPDATE_MEMBERSHIP_STATUS = `${API_ENDPOINT}/api/registration-admin/update-membership-status`;
export const POST_SERELOGY_VALUES = `${API_ENDPOINT}/api/registration-admin/sereology-report-add`;
export const GET_SERELOGY_VALUES = `${API_ENDPOINT}/api/registration-admin/sereology-report-getValues`;
export const GET_SERELOGY_RESULT = `${API_ENDPOINT}/api/registration-admin/sereology-report-getResult`;

export const GET_PENDING_CORPORATE = `${API_ENDPOINT}/api/registration-admin/pending-corporate`;
export const GET_APPROVED_CORPORATE = `${API_ENDPOINT}/api/registration-admin/approved-corporate`;
export const GET_UNAPPROVED_CORPORATE = `${API_ENDPOINT}/api/registration-admin/unapproved-corporate`;
export const APPROVE_UNAPPROVE_CORPORATE = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-corporate`;
export const ADD_CHECKOUT_DATA = `${API_ENDPOINT}/api/patient/checkout`;
export const GET_CHECKOUT_ITEMS = `${API_ENDPOINT}/api/patient/checkout-items`;

export const GET_ALL_PARTICIPANT = `${API_ENDPOINT}/api/registration-admin/all-labs`;
export const GET_PENDING_LABS = `${API_ENDPOINT}/api/registration-admin/pending-labs`;
export const GET_APPROVED_LABS = `${API_ENDPOINT}/api/registration-admin/approved-labs`;
export const GET_UNAPPROVED_LABS = `${API_ENDPOINT}/api/registration-admin/unapproved-labs`;
export const APPROVE_UNAPPROVE_LAB = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-lab`;
export const GET_SUSPENDED_LABS = `${API_ENDPOINT}/api/registration-admin/suspended-labs`;

export const GET_LABS_RATING = `${API_ENDPOINT}/api/registration-admin/labs-rating`;

// FINANCE ADMIN


export const GET_CLEARED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/cleared-in-payments`;
export const GET_APPROVED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/cleared-out-payments`;
export const GET_UNAPPROVED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/unapproved-in-payments`;
export const UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT = `${API_ENDPOINT}/api/finance-admin/approve-unapprove-in-payment`;
export const GET_LC_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-account-statements-list`;



// STAFF
export const GET_CSR_LIST = `${API_ENDPOINT}/api/staff/csr-list`;
export const GET_AUDITOR_LIST = `${API_ENDPOINT}/api/staff/auditor-list`;
export const GET_FINANCE_OFFICER_LIST = `${API_ENDPOINT}/api/staff/finance-officer-list`;
export const ADD_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;
export const UPDATE_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;
export const DELETE_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;

// CSR ADMIN
export const GET_PENDING_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/pending-complaints-lab`;
export const GET_PENDING_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/pending-complaints-labhazir`;
export const GET_INPROCESS_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/inprocess-complaints`;
export const GET_INPROCESS_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/inprocess-complaints-labhazir`;
export const GET_RESOLVED_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/resolved-complaints`;
export const GET_RESOLVED_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/resolved-complaints-labhazir`;
export const ASSIGN_COMPLAINT = `${API_ENDPOINT}/api/csr-admin/pending-complaints-lab`;

// AUDITOR ADMIN
export const GET_PENDING_AUDITS = `${API_ENDPOINT}/api/auditor-admin/pending-audits`;
export const GET_INPROCESS_AUDITS = `${API_ENDPOINT}/api/auditor-admin/inprocess-audits`;
export const GET_PASSED_AUDITS = `${API_ENDPOINT}/api/auditor-admin/passed-audits`;
export const GET_FAILED_AUDITS = `${API_ENDPOINT}/api/auditor-admin/failed-audits`;
export const ASSIGN_AUDIT = `${API_ENDPOINT}/api/auditor-admin/pending-audits`;

// AUDITS
export const GET_ASSIGNED_AUDITS = `${API_ENDPOINT}/api/auditor/assigned-audits`;
export const UPDATE_ASSIGNED_AUDITS = `${API_ENDPOINT}/api/auditor/assigned-audits`;
export const GET_AUDITORS_COMPLETED_AUDITS = `${API_ENDPOINT}/api/auditor/completed-audits`;

export const GET_LAB_AUDITS = `${API_ENDPOINT}/api/lab/audits`;
export const ADD_NEW_AUDIT = `${API_ENDPOINT}/api/lab/audits`;
// -------------- TEMPLATES URLS --------------

//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";

//PRODUCTS
export const GET_PRODUCTS = "/products";
export const GET_PRODUCTS_DETAIL = "/product";
export const ADD_NEW_PROJECT = "/add/product";
export const UPDATE_PROJECT = "/update/product";
export const DELETE_PROJECT = "/delete/product";

//CALENDER
export const GET_EVENTS = "/events";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";
export const GET_CATEGORIES = "/categories";

//CHATS
export const GET_CHATS = "/chats";
export const GET_GROUPS = "/groups";
export const GET_CONTACTS = "/contacts";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "/add/messages";

//ORDERS
export const GET_ORDERS = "/orders";
export const ADD_NEW_ORDER = "/add/order";
export const UPDATE_ORDER = "/update/order";
export const DELETE_ORDER = "/delete/order";

//CART DATA
export const GET_CART_DATA = "/cart";

//CUSTOMERS
export const GET_CUSTOMERS = "/customers";
export const ADD_NEW_CUSTOMER = "/add/customer";
export const UPDATE_CUSTOMER = "/update/customer";
export const DELETE_CUSTOMER = "/delete/customer";

//SHOPS
export const GET_SHOPS = "/shops";

//CRYPTO
export const GET_WALLET = "/wallet";
export const GET_CRYPTO_ORDERS = "/crypto/orders";

//INVOICES
export const GET_INVOICES = "/invoices";
// export const GET_INVOICE_DETAIL = "/invoice";

//PROJECTS
export const GET_PROJECTS = "/projects";
export const GET_PROJECT_DETAIL = "/project";

//TASKS
export const GET_TASKS = "/tasks";

//CONTACTS
export const GET_USERS = "/users";
export const GET_USER_PROFILE = "/user";
export const ADD_NEW_USER = "/add/user";
export const UPDATE_USER = "/update/user";
export const DELETE_USER = "/delete/user";

//Mails
export const GET_INBOX_MAILS = "/inboxmails";
export const ADD_NEW_INBOX_MAIL = "/add/inboxmail";
export const DELETE_INBOX_MAIL = "/delete/inboxmail";

//starred mail
export const GET_STARRED_MAILS = "/starredmails";

//important mails
export const GET_IMPORTANT_MAILS = "/importantmails";

//Draft mail
export const GET_DRAFT_MAILS = "/draftmails";

//Send mail
export const GET_SENT_MAILS = "/sentmails";

//Trash mail
export const GET_TRASH_MAILS = "/trashmails";

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data";
export const GET_YEARLY_DATA = "/yearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

export const TOP_SELLING_DATA = "/top-selling-data";

export const GET_EARNING_DATA = "/earning-charts-data";

// export const GET_MANUFACTURAL_LIST1 = `${API_ENDPOINT}/api/lab/manufactural-list`;
