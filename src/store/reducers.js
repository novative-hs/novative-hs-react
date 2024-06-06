import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

//Dashboard
import Dashboard from "./dashboard/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";

import LabInformation from "./auth/labinformation/reducer";

import ForgetPassword from "./auth/forgetpwd/reducer";
import ConfirmPassword from "./auth/confirmpwd/reducer";
import ChangePassword from "./auth/changepwd/reducer";
import LabProfile from "./auth/labprofile/reducer";

import StaffProfile from "./auth/staffprofile/reducer";

import LabSettings from "./auth/labsettings/reducer";
import Payments from "./auth/payments/reducer";


// Database Admin
import ListUnits from "./units/reducers";
import ListUnit from "./databaseofunits/reducer";
import ReagentList from "./reagents/reducers";
import activitylogUnits from "./databaseadmin-history/reducers";
import ManufacturalList from "./manufactural/reducers";
import Instrument from "./instrument/reducer"
//LabMarket
import LabMarket from "./labmarket/reducer";
import activitylog from "./activtylog/reducer";

import regAdminNotification from "./regadminnotification/reducer";

import activitylogfinance from "./activtylogfinance/reducer";

//carts
import carts from "./carts/reducer";
import quotes from "./quotes/reducer";

//test certificates
import qualityCertificates from "./quality-certificates/reducer";

//lab list Pending
import labsListPendingFee from "./labs-list-pending/reducer";
import labslisttt from "./labs-listttt/reducer";

//shared-percentage-pending-fee
import sharedPercentagePendingFeeTests from "./shared-percentage-pending-fee/reducer";

//Discount Labhazir
import discountLabHazirs from "./discount-labhazir/reducer";
import labsList from "./labs-list/reducer";
import discountLabs from "./discount-lab/reducer";

// Territories List
import territoriesList from "./territories-list/reducer";

// Lab Names List
import labNamesList from "./lab-names/reducer";

//Discount Labhazir to Labs
import discountLabHazirToLabs from "./discount-labhazir-to-lab/reducer";

import referrelFeeLabs from "./referrel-fee-to-lab/reducer";

//feedbacks
import feedbacks from "./feedbacks/reducer";

//test appointment

import complaints from "./complaints/reducer";

import checkout from "./checkout/reducer";

// invoices
import invoices from "./invoices/reducer";

// Advertisement invoices
import advinvoice from "./adv-invoice/reducer";

// account statements
import accountStatements from "./account-statements/reducer";
import staff from "./staff/reducer";

import msgs from "./chat-box/reducer";
// admins
import registrationAdmin from "./registration-admin/reducer";
import financeAdmin from "./finance-admin/reducer";

//Manufactural

import news from "./news/reducer";

const rootReducer = combineReducers({
  // public
  ReagentList,
  ListUnits,
  news,
  
  Dashboard,
  referrelFeeLabs,
  Layout,


  Login,
  Account,
  
  ManufacturalList,
  Login,
  Account,
  ListUnit,
  LabMarket,
  Instrument,
  LabMarket,

  financeAdmin,
  msgs,

  LabInformation,

  ForgetPassword,
  ConfirmPassword,
  ChangePassword,

  LabProfile,

  regAdminNotification,
  StaffProfile,
  labsListPendingFee,

  LabSettings,
  Payments,
  sharedPercentagePendingFeeTests,

  complaints,

  activitylog,
  activitylogfinance,

  ListUnits,
  activitylogUnits,


  discountLabHazirs,
  labsList,
  labslisttt,
  territoriesList,
  labNamesList,

  discountLabs,
  discountLabHazirToLabs,
  carts,
  quotes,

  qualityCertificates,
  feedbacks,

  checkout,
  invoices,
  advinvoice,
  accountStatements,

  staff,

  registrationAdmin,
  
});

export default rootReducer;
