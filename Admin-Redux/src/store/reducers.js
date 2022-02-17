import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import PatientInformation from "./auth/patientinformation/reducer";
import LabInformation from "./auth/labinformation/reducer";
import CorporateInformation from "./auth/corporateinformation/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import ConfirmPassword from "./auth/confirmpwd/reducer";
import Profile from "./auth/profile/reducer";
import LabProfile from "./auth/labprofile/reducer";

//E-commerce
import LabMarket from "./e-commerce/reducer";

//LabMarket
import ecommerce from "./labmarket/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//crypto
import crypto from "./crypto/reducer";

//invoices
import invoices from "./invoices/reducer";

//projects
import projects from "./projects/reducer";

//tasks
import tasks from "./tasks/reducer";

//contacts
import contacts from "./contacts/reducer";

//offered tests
import offeredTests from "./offered-tests/reducer";

//pathologists
import pathologists from "./pathologists/reducer";

//sample collectors
import sampleCollectors from "./sample-collectors/reducer";

//test certificates
import qualityCertificates from "./quality-certificates/reducer";

//test certificates
import testAppointments from "./test-appointments/reducer";

//mails
import mails from "./mails/reducer";

//Dashboard
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  PatientInformation,
  LabInformation,
  CorporateInformation,
  ForgetPassword,
  ConfirmPassword,
  Profile,
  LabProfile,
  LabMarket,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  projects,
  tasks,
  contacts,
  offeredTests,
  pathologists,
  sampleCollectors,
  qualityCertificates,
  testAppointments,
  Dashboard,
  DashboardSaas,
});

export default rootReducer;
