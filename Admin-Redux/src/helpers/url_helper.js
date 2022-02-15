//REGISTER ORIGINAL

const API_ENDPOINT = process.env.REACT_APP_BACKENDURL;

// -------------- MY URLS --------------
export const POST_LOGIN = `${API_ENDPOINT}/api/account/login/`;
export const POST_REGISTER = `${API_ENDPOINT}/api/account/register/`;

// PASSWORD RESET
export const POST_FORGET_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/`;
export const POST_CONFIRM_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/confirm/`;

export const POST_PATIENT_INFORMATION = `${API_ENDPOINT}/api/patient/patient-information`;
export const POST_LAB_INFORMATION = `${API_ENDPOINT}/api/lab/lab-information`;
export const POST_CORPORATE_INFORMATION = `${API_ENDPOINT}/api/corporate/corporate-information`;

// LAB LIST
export const GET_LABS = `${API_ENDPOINT}/api/lab/lab-list`;

// TEST
export const GET_TESTS = `${API_ENDPOINT}/api/medicaltest/test-list`;
export const GET_UNITS = `${API_ENDPOINT}/api/medicaltest/unit-list`;

// OFFERED TEST
export const GET_OFFERED_TESTS = `${API_ENDPOINT}/api/lab/offered-test-list`;
export const ADD_NEW_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const UPDATE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const DELETE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;

// PATHOLOGIST
export const GET_PATHOLOGISTS = `${API_ENDPOINT}/api/lab/pathologist-list`;
export const ADD_NEW_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const UPDATE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const DELETE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;

// SAMPLE COLLECTOR
export const GET_SAMPLE_COLLECTORS = `${API_ENDPOINT}/api/lab/sample-collector-list`;
export const ADD_NEW_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const UPDATE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const DELETE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;

// SAMPLE COLLECTOR
export const GET_QUALITY_CERTIFICATES = `${API_ENDPOINT}/api/lab/quality-certificate-list`;
export const ADD_NEW_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const UPDATE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const DELETE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;

// TEST APPOINTMENT
export const GET_TEST_APPOINTMENTS_PENDING_LIST = `${API_ENDPOINT}/api/lab/test-appointment-pending-list`;
export const GET_TEST_APPOINTMENTS_IN_PROCESS_LIST = `${API_ENDPOINT}/api/lab/test-appointment-in-process-list`;
export const GET_TEST_APPOINTMENTS_COMPLETED_LIST = `${API_ENDPOINT}/api/lab/test-appointment-completed-list`;
export const UPDATE_TEST_APPOINTMENT = `${API_ENDPOINT}/api/lab/test-appointment-update`;

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
export const GET_INVOICE_DETAIL = "/invoice";

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
