import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

//Dashboard
import Dashboard from "./dashboard/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import PatientInformation from "./auth/patientinformation/reducer";
import B2bClientInformation from "./auth/b2bclientinformation/reducer";
import DonorInformation from "./auth/donorinformation/reducer";
import LabInformation from "./auth/labinformation/reducer";
import CorporateInformation from "./auth/corporateinformation/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import ConfirmPassword from "./auth/confirmpwd/reducer";
import ChangePassword from "./auth/changepwd/reducer";
import LabProfile from "./auth/labprofile/reducer";
import B2bProfile from "./auth/b2bprofile/reducer";
import DonorProfile from "./auth/donorprofile/reducer";
import StaffProfile from "./auth/staffprofile/reducer";
import SampleCollectorProfile from "./auth/samplecollectorprofile/reducer";
import LabSettings from "./auth/labsettings/reducer";
import Payments from "./auth/payments/reducer";
import DonorSettings from "./auth/donorsettings/reducer";
import PatientProfile from "./auth/patientprofile/reducer";
import CorporateProfile from "./auth/corporateprofile/reducer";

//LabMarket
import LabMarket from "./labmarket/reducer";
//test market
import TestMarket from "./testmarket/reducer";
import ProfileMarket from "./profilemarket/reducer";
import PackageMarket from "./packagemarket/reducer";

//offered tests
import offeredTests from "./offered-tests/reducer";

//pathologists
import pathologists from "./pathologists/reducer";

//pathologists
import bankaccounts from "./bankaccounts/reducer";

//carts
import carts from "./carts/reducer";

//home sample collectors
import sampleCollectors from "./sample-collectors/reducer";

//sample collectors test appointments
import sampleCollectorDatas from "./sample-collector-test-appointments/reducer";

//test certificates
import qualityCertificates from "./quality-certificates/reducer";

import paymentStatuss from "./payment-statuss/reducer";

//Advertisement
import advertisements from "./advertisements/reducer";
//Advertisement price list
import advertisementPriceLists from "./advertisement-price-lists/reducer";

//Advertisement Live
import advertisementLives from "./advertisement-live/reducer";

//lab Advertisement
import labAdvertisements from "./lab-advertisements/reducer";

//lab Advertisement
import labAdvertisementRequests from "./lab-advertisement-requests/reducer";


//Discount Labhazir
import discountLabHazirs from "./discount-labhazir/reducer";
import labsList from "./labs-list/reducer";
import discountLabs from "./discount-lab/reducer";

// Territories List
import territoriesList from "./territories-list/reducer";

// CSR  Territories List
import csrTerritoryList from "./csr-territory-list/reducer";

// auditor  Territories List
import auditorTerritoryList from "./auditor-territory-list/reducer";


//Discount Labhazir to Labs
import discountLabHazirToLabs from "./discount-labhazir-to-lab/reducer";

import referrelFeeLabs from "./referrel-fee-to-lab/reducer";

//feedbacks
import feedbacks from "./feedbacks/reducer";

//test appointment
import testAppointments from "./test-appointments/reducer";


// patient test appointments
import patientTestAppointments from "./patient-test-appointments/reducer";

// b2b
import b2bReferredPatients from "./b2b-referred-patients/reducer";
import b2bLabShares from "./b2b-lab-shares/reducer";
import b2bPayments from "./b2bcheckout/reducer";


// donor
import donorReferredAppointments from "./donor-referred-appointments/reducer";
import donorPayments from "./donorcheckout/reducer";

//admin
import b2bAllClients from "./b2b-all-clients/reducer";

// feedback and checkout
import patientFeedback from "./patient-feedback/reducer";

import complaints from "./complaints/reducer";

import testDescriptions from "./test-descriptions/reducer";

import checkout from "./checkout/reducer";

// invoices
import invoices from "./invoices/reducer";


// Advertisement invoices
import advInvoiceDetail from "./adv-invoice/reducer";


// account statements
import accountStatements from "./account-statements/reducer";
import donoraccountStatements from "./donor-account-statements/reducer";
import b2baccountStatements from "./b2b-account-statements/reducer";


import staff from "./staff/reducer";
import audits from "./auditor/reducer";

// admins
import registrationAdmin from "./registration-admin/reducer";
import financeAdmin from "./finance-admin/reducer";
import csrAdmin from "./csr-admin/reducer";
import auditorAdmin from "./auditor-admin/reducer";
import inPayments from "./inpayments/reducer";
import outPayments from "./outpayments/reducer";


import createBank from "./createbank/reducer";
import bankAccount from "./bankaccount/reducer";



const rootReducer = combineReducers({
  // public
  Dashboard,
  referrelFeeLabs,
  Layout,
  createBank,
  Login,
  Account,
  outPayments,
  bankAccount,
  PatientInformation,
  B2bClientInformation,
  DonorInformation,
  financeAdmin,
  bankaccounts,
  DonorProfile,
  LabInformation,
  CorporateInformation,
  ForgetPassword,
  ConfirmPassword,
  ChangePassword,
  LabProfile,
  B2bProfile,
  b2baccountStatements,
  StaffProfile,
  SampleCollectorProfile,
  sampleCollectorDatas,
  LabSettings,
  Payments,
  PatientProfile,
  CorporateProfile,
  donorReferredAppointments,
  LabMarket,
  complaints,
  testDescriptions,
  TestMarket,
  ProfileMarket,
  PackageMarket,
  offeredTests,
  pathologists,
  donorPayments,
  inPayments,
  paymentStatuss,
  advertisements,
  b2bPayments,
  advertisementPriceLists,
  labAdvertisements,
  labAdvertisementRequests,
  advertisementLives,
  advertisementPriceLists,
  labAdvertisements,
  labAdvertisementRequests,
  b2bPayments,
  discountLabHazirs,
  labsList,
  territoriesList,
  csrTerritoryList,
  auditorTerritoryList,
  discountLabs,
  discountLabHazirToLabs, 
  carts,
  sampleCollectors,
  qualityCertificates,
  feedbacks,
  testAppointments,
  DonorSettings,
  patientTestAppointments,
  b2bReferredPatients,
  b2bLabShares,
  b2bAllClients,
  patientFeedback,
  checkout,
  invoices,
  advInvoiceDetail,
  accountStatements,
  donoraccountStatements,
  staff,
  audits,
  registrationAdmin,
  csrAdmin,
  auditorAdmin,
});

export default rootReducer;