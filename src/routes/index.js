import React from "react";
import { Redirect } from "react-router-dom";

// User profile
import LabProfile from "../pages/Authentication/LabProfile";


import StaffProfile from "../pages/Authentication/StaffProfile";
// LabMarket Pages
import NearbyLabs from "../pages/LabMarket/NearbyLabs/index";

import NearbyLabDetail from "pages/LabMarket/NearbyLabs/NearbyLabDetail";

// TestMarket Pages
import labs from "pages/LabMarket/NearbyLabs/labs";

//ContactUs
import ContactUs from "../pages/Contact/contact-us";
import ChatBox from "../pages/Public/chat";
// Authentication related pages
import Login from "../pages/Authentication/Login";
import RegisterAffiliate from "../pages/Authentication/RegisterAffiliate"
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import LabInformation from "../pages/Authentication/LabInformation";

import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ConfirmPwd from "../pages/Authentication/ConfirmPassword";

// Dashboard
import DashboardLab from "../pages/Dashboard-Lab/index";
// import DashboardFinanceOfficer from "pages/Dashboard-FinanceOfficer/StackedColumnChart";
import FinanceOfficerProfile from "../pages/Authentication/StaffProfile";
import DashboardFinance from "../pages/Dashboard-Finance/index"


//Database Admin
import DashboardatabaseAdmin from "pages/Dashboard-DatabaseAdmin";
import DatabaseOfUnitsPage from "pages/databaseadmin/database-of-units";
import DatabaseOfReagentsPage from "pages/databaseadmin/database-of-reagents";
import DatabaseOfManufactural from "pages/databaseadmin/database-of-manufactural";
import DatabaseOfMethod from "pages/databaseadmin/method-list";
import DatabaseOfAnalyte from "pages/databaseadmin/database-of-analyte";
import AnalyteAddMethods from "pages/databaseadmin/analyte-add-methods";
import AnalyteAddUnits from "pages/databaseadmin/analyte-add-units";
import DatabaseOfinsrumentType from "pages/databaseadmin/instrument-type-list";
import InstrumentList from "pages/databaseadmin/instruments-list";
import Scheme from "pages/databaseadmin/scheme";
import Cycle from "pages/databaseadmin/cycle";
import CycleAnalytes from "pages/databaseadmin/add-analytes-cycle-page";
import Sample from "pages/databaseadmin/sample";

import AnalyteAddReagents from "pages/databaseadmin/analyte-add-reagents";
import AnalyteAddEuipments from "pages/databaseadmin/analyte-add-equipments";
import DatabaseOfParticipantCity from "pages/databaseadmin/database-of-participantcity";
import DatabaseOfParticipantDistrict from "pages/databaseadmin/database-of-participantdistrict";
import DatabaseOfParticipantDepartment from "pages/databaseadmin/database-of-participantdepartment";
import DatabaseOfParticipantDesignation from "pages/databaseadmin/database-of-participantdesignation";
import DatabaseOfParticipanttype from "pages/databaseadmin/database-of-participanttype";
import DatabaseOfParticipantSector from "pages/databaseadmin/database-of-participantsector";
import UnitsAnalytes from "pages/databaseadmin/units-analyte";

//HR  Admin
import DatabaseadminList from "pages/HrAdmin/databaseadmin-list";
// import FinanceAdminProfile from "../pages/Authentication/StaffProfile";

// //Dashboard PArticipant
import DashboardPartcipant from "pages/Dashboard-Participant";
import Rounds from "pages/Participant/rounds";
import Performance from "pages/Participant/performance";
import NewsPage from "pages/Participant/news-paritcipant";
import Email from "pages/Participant/email";
import AllParticipant from "pages/Participant/all-participants";
import AllParticipant1 from "pages/Participant/all-participants1";
import AllParticipant2 from "pages/Participant/all-participants1";

// Lab Componentsss


import QualityCertificatesList from "../pages/QualityCertificates/quality-certificates-list";


import FeedbacksList from "../pages/Feedbacks/feedbacks-list";
import LabInvoiceDetail from "pages/Checkouts/invoice-detail";



// import checkout from "pages/Checkouts/checkout-list";
import Checkout from "pages/Checkouts/checkout";

import InvoiceDetail from "pages/Checkouts/invoice-detail";
import LabSettings from "pages/Authentication/LabSettings";
import FeedbackDetail from "pages/Feedbacks-List/FeedbackDetail";



// LAB ADV INVOICE
import AdvInvoiceDetail from "pages/advInvoice/adv-invoice-detail";
import AllLabsList from "pages/Admin/lab-labs-list";




import Disclaimer from "pages/Public/disclaimer";
import AboutUs from "pages/Public/about-us";
// import ChatBox from "pages/Public/chat";
// import TermsConditions from "pdf/LabHazir - Terms & Conditions.pdf";
import ChangePassword from "pages/Authentication/ChangePassword";

// registration admin
import PendingLabs from "pages/RegistrationAdmin/pending-labs";
import Roundss from "pages/RegistrationAdmin/rounds";
import labsListApprovedFeeOffered from "pages/RegistrationAdmin/labs-list-approved-fee";
import labsListPendingFeeOffered from "pages/RegistrationAdmin/labs-list-pending-fee";
import sharedPercentagePendingFeeTests from "pages/RegistrationAdmin/shared-percentage-pending-Fee";
import sharedPercentageApprovedFeeTests from "pages/RegistrationAdmin/shared-percentage-approved-Fee";
import ApprovedLabs from "pages/RegistrationAdmin/approved-labs";
import UnapprovedLabs from "pages/RegistrationAdmin/unapproved-labs";
import rounds from "pages/RegistrationAdmin/rounds";
import ReferrelLab from "pages/RegistrationAdmin/referrelfeelab";
import ApproveReferrelLab from "pages/RegistrationAdmin/Approvereferrelfeelab";
import News from "pages/RegistrationAdmin/news";




// finance admin
;

// Marketer Admin routes


import labList from "pages/Admin/labs-list";


// Discount of Labhazir to lab



// Registration of Marketer Admin

import MsgsList from "pages/Complaints/msg-box";


import LabAudits from "pages/Dashboard-Lab/lab-audits";
import activityLog from "pages/Dashboard-Lab/activity-log";

import PagesMaintenance from "pages/Utility/pages-maintenance";
import PagesComingsoon from "pages/Utility/pages-comingsoon";
import Pages404 from "pages/Utility/pages-404";
import Pages500 from "pages/Utility/pages-500";

import StaffRegister from "pages/HrAdmin/staff-register";
import OrganizationRegister  from "pages/HrAdmin/organization-register";
import OrganizationList  from "pages/SuperAdmin/organization-list";

import StaffInfo from "pages/HrAdmin/staff-info";



import Payments from "pages/Authentication/Payments"
import UnitsHistory from "../pages/databaseadmin/databaseadmin-history";

import { invoiceList } from "common/data";
import labsListPendingFee from "store/labs-list-pending/reducer";

import msgBox from "pages/Complaints/msg-box";
import msgBoxFo from "pages/Complaints/msg-box";

import { components } from "react-select/dist/react-select.cjs.prod";
// import RegParticipant from "pages/RegisterParticipant";
import RegParticipant from "pages/Authentication/RegisterParticipant";
import RegistrationAdminList from "pages/HrAdmin/registration-admin-list";
import RegParticipantCSR from "pages/Authentication/RegisterParticipantCSR";

import csrList from "pages/HrAdmin/csr-list";
import organizationList from "pages/HrAdmin/organizationList";
import RegisterParticipant from "pages/Authentication/RegisterParticipant";

// All general public routes will be listed here
const publicRoutes = [

  { path: "/register/:guest_id?/:uuid?", component: Register },
  { path: "/logout", component: Logout },
  { path: "/login/:guest_id?/:uuid?", component: Login },
  { path: "/register-affiliate", component: RegisterAffiliate },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/:token/confirm-password", component: ConfirmPwd },
  
  // { path: "/register-participant-copy", component: RegParticipantCopy},


  { path: "/lab-information/:id", component: LabInformation },

  { path: "/nearby-labs/:uuid?/:guest_id?", component: NearbyLabs },
  { path: "/contact-us", component: ContactUs },

  // {
  //   path: "/labs/:uuid?",
  //   component: labs,
  // },
  // {
  //   path: "/nearby-tests/:guest_id?/:uuid?",
  //   component: NearbyTests,
  // },
  // {  path: "/nearby-profiles/:guest_id?/:uuid?",
  //    component: NearbyProfiles 
  // },
  // {  path: "/nearby-packages/:guest_id?/:uuid?",
  //   component: NearbyPackages 
  // },
  // {
  //   path: "/nearby-lab-detail/:lab_account_id/:guest_id?/:uuid?",
  //   component: NearbyLabDetail,
  // },
  // {
  //   path: "/:lab_account_id/offered-test-by-lab/:guest_id?/:uuid?",
  //   component: TestsOfferedbyLab,
  // },

];

const labAuthProtectedRoutes = [
  { path: "/change-password", component: ChangePassword },
  { path: "/dashboard-lab", component: DashboardLab },



  {
    path: "/lab-profile",
    component: LabProfile,
  },
  {
    path: "/lab-settings",
    component: LabSettings,
  },





  {
    path: "/lab-payments/:id",
    component: Payments,
  },


];


const financeOfficerAuthProtectedRoutes = [
  { path: "/dashboard-finance", component: DashboardFinance },
  { path: "/financeofficer-profile", component: FinanceOfficerProfile },





];
const databaseAdminAuthProtectedRoutes = [
  { path: "/dashboard-databaseadmin", component: DashboardatabaseAdmin },
  { path: "/database-of-units", component: DatabaseOfUnitsPage },
  { path: "/database-of-reagents", component: DatabaseOfReagentsPage },
  { path: "/equipment-list", component: InstrumentList },
  { path: "/database-of-equipmentType", component: DatabaseOfinsrumentType },
  { path: "/database-of-manufactural", component: DatabaseOfManufactural },
  { path: "/database-of-method", component: DatabaseOfMethod },
  { path: "/database-of-analyte", component: DatabaseOfAnalyte },
  { path: "/databaseadmin-history/:id", component: UnitsHistory },

  

  {path: "/scheme", component: Scheme},
  {path: "/cycle", component: Cycle},
  {path: "/add-analytes-cycle-page/:id", component: CycleAnalytes},
  
  {path: "/sample", component: Sample},

  { path: "/analyte-add-methods/:id", component: AnalyteAddMethods }, 
  { path: "/analyte-add-units/:id", component: AnalyteAddUnits }, 
  { path: "/analyte-add-reagents/:id", component: AnalyteAddReagents }, 
  { path: "/analyte-add-equipments/:id", component: AnalyteAddEuipments }, 
  { path: "/units-analytes/:id", component: UnitsAnalytes }, 
  //participant data
  { path: "/database-of-participantcity", component: DatabaseOfParticipantCity },
  { path: "/database-of-participantdistrict", component: DatabaseOfParticipantDistrict },
  { path: "/database-of-participantdepartment", component: DatabaseOfParticipantDepartment },
  { path: "/database-of-participantdesignation", component: DatabaseOfParticipantDesignation },
  { path: "/database-of-participanttype", component: DatabaseOfParticipanttype },
  { path: "/database-of-participantSector", component: DatabaseOfParticipantSector },

];
const participantsAuthProtectedRoutes = [
  { path: "/dashboard-partcipant", component: DashboardPartcipant },
  { path: "/rounds", component: Rounds },
  { path: "/performance", component: Performance},
  { path: "/newspage", component: NewsPage},
  { path: "/email", component: Email},
  
 
];



const registrationAdminAuthProtectedRoutes = [
  { path: "/round", component: rounds },
  { path: "/pending-participant", component: PendingLabs },
  { path: "/rounds", component: Roundss },
  { path: "/labs-list-approved-fee", component: labsListApprovedFeeOffered },
  { path: "/labs-list-pending-fee", component: labsListPendingFeeOffered },
  {
    path: "/shared-percentage-pending-Fee/:id", component: sharedPercentagePendingFeeTests,
  },
  {
    path: "/shared-percentage-approved-Fee/:id", component: sharedPercentageApprovedFeeTests,
  },
  { path: "/approved-participant", component: ApprovedLabs },
  { path: "/unapproved-participant", component: UnapprovedLabs },

  {
    path: "/referrellab", component: ReferrelLab,
  },
  {
    path: "/approvereferrellab", component: ApproveReferrelLab,
  },
  { path: "/register-participant", component: RegParticipant},
  { path: "/all-participant1", component: AllParticipant1},
  {path: "/news", component: News},
  

];

//CSR
const CSRAdminAuthProtectedRoutes = [
  { path: "/register-participant-CSR", component: RegParticipantCSR},
  { path: "/all-participant2", component: AllParticipant2},
];

//organization dashboard
const hrAdminAuthProtectedRoutes = [
  { path: "/add-staff", component: StaffRegister },
  { path: "/add-organization", component: OrganizationRegister },
  { path: "/organization-list", component: OrganizationList },
  { path: "/staff-info/:id", component: StaffInfo },
  { path: "/databaseadmin-list", component: DatabaseadminList },
  { path: "/csr-list", component: csrList },
  { path: "/registration-admin-list", component: RegistrationAdminList },
  { path: "/all-participant", component: AllParticipant},
];

const authProtectedRoutes = [
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
];

export {
  authProtectedRoutes,
  labAuthProtectedRoutes,
  participantsAuthProtectedRoutes,
  financeOfficerAuthProtectedRoutes,
  databaseAdminAuthProtectedRoutes,
  registrationAdminAuthProtectedRoutes,
  CSRAdminAuthProtectedRoutes,
  hrAdminAuthProtectedRoutes,
  publicRoutes,
};