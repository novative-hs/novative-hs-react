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
import RegisterAffiliate from "../pages/Authentication/RegisterAffiliate";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import LabInformation from "../pages/Authentication/LabInformation";

import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ConfirmPwd from "../pages/Authentication/ConfirmPassword";

// Dashboard
import DashboardLab from "../pages/Dashboard-Lab/index";
// import DashboardFinanceOfficer from "pages/Dashboard-FinanceOfficer/StackedColumnChart";
import FinanceOfficerProfile from "../pages/Authentication/StaffProfile";
import DashboardFinance from "../pages/Dashboard-Finance/index";
import DashboardOrganization from "../pages/Dashboard-Organization";

//Database Admin
import DashboardatabaseAdmin from "pages/Dashboard-DatabaseAdmin";
import DatabaseOfUnitsPage from "pages/databaseadmin/database-of-units";
import DatabaseOfQualitativeTypePage from "pages/databaseadmin/database-of-qualitativetype";
import SampleListAnalytes from "pages/databaseadmin/sample-analyte";
import DatabaseOfReagentsPage from "pages/databaseadmin/database-of-reagents";
import DatabaseOfManufactural from "pages/databaseadmin/database-of-manufactural";
import DatabaseOfMethod from "pages/databaseadmin/method-list";
import DatabaseOfAnalyte from "pages/databaseadmin/database-of-analyte";
import AnalyteAddMethods from "pages/databaseadmin/analyte-add-methods";
import AnalyteAddUnits from "pages/databaseadmin/analyte-add-units";
import AnalyteAddQualitativeUnits from "pages/databaseadmin/analyte-add-qualitative-units";
import InstrumentAddAnalyte from "pages/databaseadmin/instrument-add-analyte";
import DatabaseOfinsrumentType from "pages/databaseadmin/instrument-type-list";
import InstrumentList from "pages/databaseadmin/instruments-list";
import Scheme from "pages/databaseadmin/scheme";
import Cycle from "pages/databaseadmin/cycle";
import CycleAnalytes from "pages/databaseadmin/cycle-analyte";
import SchemeAnalytes from "pages/databaseadmin/add-analytes-scheme-page";
import SchemeListAnalyte from "pages/databaseadmin/scheme-analytelist";
import Sample from "pages/databaseadmin/sample";
import SampleAnalytes from "pages/databaseadmin/add-analytes-sample-page";

import AnalyteAddReagents from "pages/databaseadmin/analyte-add-reagents";
import AnalyteAddEuipments from "pages/databaseadmin/analyte-add-equipments";
import DatabaseOfParticipantCity from "pages/databaseadmin/database-of-participantcity";
import DatabaseOfParticipantCountry from "pages/databaseadmin/database-of-participantcountry";
import DatabaseOfParticipantProvince from "pages/databaseadmin/database-of-participantprovince";
import InstrumentDetail from "pages/databaseadmin/instrument-list-detail";
import DatabaseOfParticipantDistrict from "pages/databaseadmin/database-of-participantdistrict";
import DatabaseOfParticipantDepartment from "pages/databaseadmin/database-of-participantdepartment";
import DatabaseOfParticipantDesignation from "pages/databaseadmin/database-of-participantdesignation";
import DatabaseOfParticipanttype from "pages/databaseadmin/database-of-participanttype";
import DatabaseOfParticipantSector from "pages/databaseadmin/database-of-participantsector";
import UnitsAnalytes from "pages/databaseadmin/units-analyte";
import InstrumentsInType from "pages/databaseadmin/instrumentsintype";
import InstrumentsInManufacturer from "pages/databaseadmin/instrumentsinmanufacturer";
import ReagentsInManufacturer from "pages/databaseadmin/reagentsinmanufacturer";

import MethodsAnalytes from "pages/databaseadmin/methods-analyte";
import InstrumentsAnalytes from "pages/databaseadmin/instruments-analyte";

import ReagentsAnalytes from "pages/databaseadmin/reagent-analyte";
import SchemeRoundList from "pages/databaseadmin/round-list";
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
import ParticipantsResult from "pages/Participant/results";
import Report from "pages/Participant/report";
import SereologyReport from "pages/Participant/sereologyReport";
import UpdateParticipantsResult from "pages/RegistrationAdmin/results";
import ResultHistory from "pages/Participant/result-history";
import ReportParticipant from "pages/Participant/report1_view";
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
import AllLabs from "pages/RegistrationAdmin/All-participant";
import PendingLabs from "pages/RegistrationAdmin/pending-labs";
import Dashboardregistrationadmin from "pages/Dashboard-RegistrationAdmin";
import RoundLabs from "pages/RegistrationAdmin/add-labs-round-page";
import labsListApprovedFeeOffered from "pages/RegistrationAdmin/labs-list-approved-fee";
import labsListPendingFeeOffered from "pages/RegistrationAdmin/labs-list-pending-fee";
import sharedPercentagePendingFeeTests from "pages/RegistrationAdmin/shared-percentage-pending-Fee";
import sharedPercentageApprovedFeeTests from "pages/RegistrationAdmin/shared-percentage-approved-Fee";
import ApprovedLabs from "pages/RegistrationAdmin/approved-labs";
import UnapprovedLabs from "pages/RegistrationAdmin/unapproved-labs";
import SuspendedLabs from "pages/RegistrationAdmin/suspended-labs";
import rounds from "pages/RegistrationAdmin/rounds";
import ReferrelLab from "pages/RegistrationAdmin/referrelfeelab";
import ApproveReferrelLab from "pages/RegistrationAdmin/Approvereferrelfeelab";
import News from "pages/RegistrationAdmin/news";
import Statistics from "pages/RegistrationAdmin/statics";
import SelectValues from "pages/RegistrationAdmin/reportValues";
import DisplayValues from "pages/RegistrationAdmin/analteTypeValues";
import RoundsHistory from "pages/RegistrationAdmin/registrationadmin-history";
import RegParticipant from "pages/Authentication/RegisterParticipant";
import ResultParticipantlist from "pages/RegistrationAdmin/submitted-participants";
import StatisticParticipant from "pages/RegistrationAdmin/statistic-participant";
import PendingSubmission from "pages/RegistrationAdmin/pending-submission";
// finance admin
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
import OrganizationRegister from "pages/HrAdmin/organization-register";
import OrganizationList from "pages/SuperAdmin/organization-list";

import StaffInfo from "pages/HrAdmin/staff-info";

import Payments from "pages/Authentication/Payments";
import UnitsHistory from "../pages/databaseadmin/databaseadmin-history";

import { invoiceList } from "common/data";
import labsListPendingFee from "store/labs-list-pending/reducer";

import msgBox from "pages/Complaints/msg-box";
import msgBoxFo from "pages/Complaints/msg-box";

import { components } from "react-select/dist/react-select.cjs.prod";
// import RegParticipant from "pages/RegisterParticipant";
// import RegParticipant from "pages/Authentication/RegisterParticipant";
import RegistrationAdminList from "pages/HrAdmin/registration-admin-list";
import RegParticipantCSR from "pages/Authentication/RegisterParticipantCSR";
import ParticipantPayments from "pages/Authentication/participant-payment";
import PaymentSchemeList from "pages/Authentication/payment-scheme-list";
import RoundParticipantlist from "pages/RegistrationAdmin/round-participant-list";
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
  { path: "/change-password", component: ChangePassword },

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
  {
    path: "/:organization_name/dashboard-databaseadmin",
    component: DashboardatabaseAdmin,
  },
  {
    path: "/:organization_name/database-of-units",
    component: DatabaseOfUnitsPage,
  },
  {
    path: "/:organization_name/database-of-qualitativetype",
    component: DatabaseOfQualitativeTypePage,
  },
  {
    path: "/:organization_name/database-of-reagents",
    component: DatabaseOfReagentsPage,
  },
  { path: "/:organization_name/equipment-list", component: InstrumentList },
  {
    path: "/:organization_name/database-of-equipmentType",
    component: DatabaseOfinsrumentType,
  },
  { path: "/instrument-add-analyte/:id", component: InstrumentAddAnalyte },
  { path: "/instrument-list-detail/:id", component: InstrumentDetail },
  {
    path: "/:organization_name/database-of-manufactural",
    component: DatabaseOfManufactural,
  },
  {
    path: "/:organization_name/database-of-method",
    component: DatabaseOfMethod,
  },
  {
    path: "/:organization_name/database-of-analyte",
    component: DatabaseOfAnalyte,
  },
  {
    path: "/:organization_name/databaseadmin-history/:id",
    component: UnitsHistory,
  },
  {
    path: "/:organization_name/sample-analyte/:id",
    component: SampleListAnalytes,
  },
  { path: "/:organization_name/scheme", component: Scheme },
  { path: "/:organization_name/cycle", component: Cycle },
  { path: "/:organization_name/cycle-analyte/:id", component: CycleAnalytes },
  { path: "/add-analytes-scheme-page/:id", component: SchemeAnalytes },
  { path: "/:organization_name/sample", component: Sample },
  { path: "/add-analytes-sample-page/:id", component: SampleAnalytes },
  { path: "/scheme-analytelist/:id", component: SchemeListAnalyte },
  {
    path: "/:organization_name/analyte-add-methods/:id",
    component: AnalyteAddMethods,
  },
  {
    path: "/:organization_name/analyte-add-units/:id",
    component: AnalyteAddUnits,
  },
  {
    path: "/analyte-add-qualitative-units/:id",
    component: AnalyteAddQualitativeUnits,
  },
  {
    path: "/:organization_name/analyte-add-reagents/:id",
    component: AnalyteAddReagents,
  },
  {
    path: "/:organization_name/analyte-add-equipments/:id",
    component: AnalyteAddEuipments,
  },
  { path: "/units-analytes/:id", component: UnitsAnalytes },
  { path: "/methods-analyte/:id", component: MethodsAnalytes },
  { path: "/instruments-analyte/:id", component: InstrumentsAnalytes },
  { path: "/reagents-analyte/:id", component: ReagentsAnalytes },
  { path: "/instruments-in-type/:id", component: InstrumentsInType },
  {
    path: "/instruments-in-manufacturer/:id",
    component: InstrumentsInManufacturer,
  },
  { path: "/reagents-in-manufacturer/:id", component: ReagentsInManufacturer },
  { path: "/round-list/:id", component: SchemeRoundList },
  //participant data
  {
    path: "/:organization_name/database-of-participantcity",
    component: DatabaseOfParticipantCity,
  },
  {
    path: "/:organization_name/database-of-participantcountry",
    component: DatabaseOfParticipantCountry,
  },
  {
    path: "/:organization_name/database-of-participantprovince",
    component: DatabaseOfParticipantProvince,
  },
  {
    path: "/:organization_name/database-of-participantdistrict",
    component: DatabaseOfParticipantDistrict,
  },
  {
    path: "/:organization_name/database-of-participantdepartment",
    component: DatabaseOfParticipantDepartment,
  },
  {
    path: "/:organization_name/database-of-participantdesignation",
    component: DatabaseOfParticipantDesignation,
  },
  {
    path: "/:organization_name/database-of-participanttype",
    component: DatabaseOfParticipanttype,
  },
  {
    path: "/:organization_name/database-of-participantSector",
    component: DatabaseOfParticipantSector,
  },
];
const participantsAuthProtectedRoutes = [
  {
    path: "/:organization_name/dashboard-participant",
    component: DashboardPartcipant,
  },
  { path: "/:organization_name/rounds-participant", component: Rounds },
  { path: "/:organization_name/performance", component: Performance },
  { path: "/:organization_name/newspage", component: NewsPage },
  { path: "/email", component: Email },
  {
    path: "/:organization_name/:id/:id1/participantsResults",
    component: ParticipantsResult,
  },
  { path: "/:organization_name/:id/:id1/report", component: Report },
  {
    path: "/:organization_name/:id/:id1/sereology-report",
    component: SereologyReport,
  },
  {
    path: "/:organization_name/rounds-history/participant/:id",
    component: RoundsHistory,
  },
  { path: "/:organization_name/result-history/:id", component: ResultHistory },
  {
    path: "/:organization_name/:id/:id1/report1_view",
    component: ReportParticipant,
  },
];

const registrationAdminAuthProtectedRoutes = [
  {
    path: "/:organization_name/dashboard-registrationadmin",
    component: Dashboardregistrationadmin,
  },
  {
    path: "/:organization_name/UpdateParticipantsResults/:id",
    component: UpdateParticipantsResult,
  },
  { path: "/:organization_name/round", component: rounds },
  { path: "/:organization_name/all-participant", component: AllLabs },
  { path: "/:organization_name/add-labs-round-page/:id", component: RoundLabs },
  { path: "/:organization_name/pending-participant", component: PendingLabs },
  { path: "/labs-list-approved-fee", component: labsListApprovedFeeOffered },
  { path: "/labs-list-pending-fee", component: labsListPendingFeeOffered },
  {
    path: "/:organization_name/shared-percentage-pending-Fee/:id",
    component: sharedPercentagePendingFeeTests,
  },
  { path: "/round-participant-list/:id", component: RoundParticipantlist },
  {
    path: "/:organization_name/register-participant",
    component: RegParticipant,
  },
  {
    path: "/:organization_name/participant-payment",
    component: ParticipantPayments,
  },

  {
    path: "/:organization_name/shared-percentage-approved-Fee/:id",
    component: sharedPercentageApprovedFeeTests,
  },
  { path: "/:organization_name/approved-participant", component: ApprovedLabs },
  {
    path: "/:organization_name/unapproved-participant",
    component: UnapprovedLabs,
  },
  {
    path: "/:organization_name/suspended-participant",
    component: SuspendedLabs,
  },
  { path: "/payment-scheme-list/:id", component: PaymentSchemeList },
  {
    path: "/referrellab",
    component: ReferrelLab,
  },
  {
    path: "/approvereferrellab",
    component: ApproveReferrelLab,
  },
  { path: "/:organization_name/all-participant1", component: AllParticipant1 },
  { path: "/:organization_name/news", component: News },
  { path: "/:organization_name/statistics/:id", component: Statistics },
  { path: "/:organization_name/slectValues/:id", component: SelectValues },
  { path: "/:organization_name/displayValues/:id", component: DisplayValues },
  { path: "/:organization_name/rounds-history/:id", component: RoundsHistory },
  { path: "/:organization_name/:id/participant-report", component: Report },
  { path: "/submitted-participants/:id", component: ResultParticipantlist },
  {
    path: "/statistic-participant/:roundId/:analyteId",
    component: StatisticParticipant,
  },
  { path: "/submitted-participants/:id", component: ResultParticipantlist },
];

//CSR
const CSRAdminAuthProtectedRoutes = [
  {
    path: "/:organization_name/register-participant-CSR",
    component: RegParticipantCSR,
  },
  { path: "/:organization_name/all-participant2", component: AllParticipant2 },
];

//organization dashboard
const hrAdminAuthProtectedRoutes = [
  {
    path: "/:organization_name/dashboard-organization",
    component: DashboardOrganization,
  },
  { path: "/:organization_name/add-staff", component: StaffRegister },
  { path: "/add-organization", component: OrganizationRegister },
  { path: "/organization-list", component: OrganizationList },
  { path: "/staff-info/:id", component: StaffInfo },
  {
    path: "/:organization_name/databaseadmin-list",
    component: DatabaseadminList,
  },
  { path: "/:organization_name/csr-list", component: csrList },
  {
    path: "/:organization_name/registration-admin-list",
    component: RegistrationAdminList,
  },
  { path: "/:organization_name/all-participants", component: AllParticipant },
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
