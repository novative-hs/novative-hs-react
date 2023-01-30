import React from "react";
import { Redirect } from "react-router-dom";

// User profile
import LabProfile from "../pages/Authentication/LabProfile";
import PatientProfile from "../pages/Authentication/PatientProfile";
import CorporateProfile from "../pages/Authentication/CorporateProfile";
import SampleCollectorProfile from "../pages/Authentication/SampleCollectorProfile";
import StaffProfile from "../pages/Authentication/StaffProfile";
// LabMarket Pages
import NearbyLabs from "../pages/LabMarket/NearbyLabs/index";
import NearbyLabDetail from "pages/LabMarket/NearbyLabs/NearbyLabDetail";
// TestMarket Pages
import labs from "pages/LabMarket/NearbyLabs/labs";
import NearbyTests from "pages/LabMarket/NearbyLabs/NearbyTests";
import NearbyProfiles from "pages/LabMarket/NearbyLabs/NearbyProfiles";
import NearbyPackages from "pages/LabMarket/NearbyLabs/NearbyPackages";
//ContactUs
import ContactUs from "../pages/Contact/contact-us";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import PatientInformation from "../pages/Authentication/PatientInformation";
import B2bClientInformation from "../pages/Authentication/B2bClientInformation";
import DonorInformation from "../pages/Authentication/DonorInformation";
import LabInformation from "../pages/Authentication/LabInformation";
import CorporateInformation from "../pages/Authentication/CorporateInformation";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ConfirmPwd from "../pages/Authentication/ConfirmPassword";

// Dashboard
import DashboardPatient from "../pages/Dashboard-Patient/index";
import DashboardLab from "../pages/Dashboard-Lab/index";
import DashboardB2b from "../pages/Dashboard-B2b/index";
import DashboardFinanceOfficer from "pages/Dashboard-FinanceOfficer/StackedColumnChart";
import FinanceOfficerProfile from "../pages/Authentication/StaffProfile";
//Finance Admin
import DashboardFinanceAdmin from "pages/Dashboard-FinanceAdmin";
// import FinanceAdminProfile from "../pages/Authentication/StaffProfile";


// Lab Components
import OfferedTestsList from "../pages/OfferedTests/offered-tests-list";
import SampleCollectorRegister from "pages/SampleCollectors/sample-collectors-register";
import SampleCollectorInfo from "pages/SampleCollectors/sample-collector-info";
import SampleCollectorsList from "../pages/SampleCollectors/sample-collectors-list";
import QualityCertificatesList from "../pages/QualityCertificates/quality-certificates-list";
import PathologistsList from "../pages/Pathologists/pathologists-list";
import TestAppointmentsPendingList from "../pages/TestAppointments/test-appointments-pending-list";
import TestAppointmentsInProcessList from "../pages/TestAppointments/test-appointments-in-process-list";
import TestAppointmentsCompletedList from "../pages/TestAppointments/test-appointments-completed-list";
import FeedbacksList from "../pages/Feedbacks/feedbacks-list";
import LabInvoiceDetail from "pages/Checkouts/invoice-detail";
import LabAdvertisements from "../pages/LabAdvertisements/lab-advertisement";


// Payment In Status
import InPayments from "pages/Payments Form/in-payment-mathod";
import PaymentStatussList from "../pages/PaymentStatuss/payment-statuss-list";
import depositStatussList from "../pages/PaymentStatuss/deposit-statuss-list";
import clearStatussList from "../pages/PaymentStatuss/clear-statuss-list";
import bouncedStatussList from "../pages/PaymentStatuss/payment-bounced-statuss-list"

// Payment Out

import OutPayments from "pages/Payments Form/out-payment-mathod";
import PaymentOutStatussList from "pages/PaymentStatuss/paymentout-pending-clearence-statuss-list"
import PaymentOutCreatedStatussList from "pages/PaymentStatuss/paymentout-created-statuss-list"
import PaymentOutBouncedStatussList from "pages/PaymentStatuss/paymentout-bounced-statuss-list"

// sample collector components
import SampleCollectorTestAppointmentsInProcessList from "../pages/SampleCollectorTestAppointments/test-appointments-in-process-list";
import SampleCollectorTestAppointmentsCompletedList from "../pages/SampleCollectorTestAppointments/test-appointments-completed-list";
import CollectorInvoiceDetail from "pages/Checkouts/invoice-detail";

// Patient Lab Components
import LabQualityCertificates from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/quality-certificates-list";
import LabSampleCollectors from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/sample-collectors-list";
import LabPathologists from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/pathologists-list";

// Patient Components
import TestAppointmentsList from "../pages/PatientTestAppointments/test-appointments-list";
import TestsOfferedbyLab from "pages/LabMarket/NearbyLabs/TestsOfferedbyLab";
import CartsList from "../pages/Carts/carts-list";
// import checkout from "pages/Checkouts/checkout-list";
import Checkout from "pages/Checkouts/checkout";
import InvoiceDetail from "pages/Checkouts/invoice-detail";
import LabSettings from "pages/Authentication/LabSettings";
import FeedbackDetail from "pages/Feedbacks-List/FeedbackDetail";
import TestDescriptions from "pages/Test-Description/test-descriptions-list";


// LAB ADV INVOICE
import AdvInvoiceDetail from "pages/advInvoice/adv-invoice-detail";


// B2B Reffered
import B2bReferredPatient from "pages/B2bReferredPatients/referred-patients-list";
import B2bLabShare from "pages/B2bLabShares/lab-shares-list";
// import B2bSettings from "pages/Authentication/B2bSettings";
import B2bProfile from "pages/Authentication/B2bProfile";

// Donor
import DonorProfile from "pages/Authentication/DonorProfile";
import DonorAppointments from "pages/DonorReferredAppointments/referred-appointments-list";
import DonorPayments from "pages/DonorPaymentMathods/payment-mathod";
import DonorSettings from "pages/Authentication/DonorSettings";
import DonorAccountStatements from "pages/AccountStatements/donor-account-statements";
import B2bAccountStatements from "pages/AccountStatements/b2b-account-statements";
import Invoiceb2b from "pages/Checkouts/invoice-detail"

import CreateBanks from "pages/CreateBanks/create-bank";
import BankAccounts from "pages/BankAccounts/bank-account"

// Admin
// import B2bAllClients from "pages/B2bAllClients/all-clients-list";
// import OfferedLabsshares from "pages/OfferedLabShares/offered-shares-list";
// B2B Admin
import B2bAllClients from "pages/B2BAdmin/all-clients-list";
import B2BClientShares from "pages/B2BAdmin/b2b-client-shares";
import B2bPayments from "pages/B2bPaymentMathods/payment-mathod";


// import B2bReferredPatient from "pages/B2bReferredPatients/referred-patients-list";
import AccountStatements from "pages/AccountStatements/account-statements";
import MedicalTestSheet from "pages/OfferedTests/medical-test-sheet";
import Disclaimer from "pages/Public/disclaimer";
import AboutUs from "pages/Public/about-us";
import TermsConditions from "pdf/LabHazir - Terms & Conditions.pdf";
import ChangePassword from "pages/Authentication/ChangePassword";
import DashboardAuditor from "pages/Dashboard-Auditor";
import DashboardSampleCollector from "pages/Dashboard-SampleCollector";

// registration admin
import PendingLabs from "pages/RegistrationAdmin/pending-labs";
import labsListPendingFeeOffered from "pages/RegistrationAdmin/labs-list-pending-fee";
import sharedPercentagePendingFeeTests from "pages/RegistrationAdmin/shared-percentage-pending-Fee";
import ApprovedLabs from "pages/RegistrationAdmin/approved-labs";
import UnapprovedLabs from "pages/RegistrationAdmin/unapproved-labs";
import PendingB2bClients from "pages/RegistrationAdmin/pending-b2b-clients";
import ApprovedB2bClients from "pages/RegistrationAdmin/approved-b2b-clients";
import UnapprovedB2bClients from "pages/RegistrationAdmin/unapproved-b2b-clients";
import PendingDonors from "pages/RegistrationAdmin/pending-donors";
import ApprovedDonors from "pages/RegistrationAdmin/approved-donors";
import UnapprovedDonors from "pages/RegistrationAdmin/unapproved-donors";
import ReferrelLab from "pages/RegistrationAdmin/referrelfeelab";
import ApproveReferrelLab from "pages/RegistrationAdmin/Approvereferrelfeelab";



// finance admin
import ClearedInPayments from "pages/FinanceAdmin/cleared-in-payments";
import ApprovedInPayments from "pages/FinanceAdmin/approved-in-payments";
import UnapprovedInPayments from "pages/FinanceAdmin/unapproved-in-payments";

// Maeketer Admin routes
import Advertisements from "pages/MarketerAdmin/advertisement";
import AdvertisementPriceLists from "pages/MarketerAdmin/advertisement-price-list";
import DiscountLabHazir from "pages/MarketerAdmin/discount-labhazir";
import labsList from "pages/MarketerAdmin/labs-list";
import discountLab from "pages/MarketerAdmin/discount-lab";
import LabAdvertisementRequests from "pages/MarketerAdmin/pending-lab-advertisement-requests";
import LabAdvertisementRequestsAccepted from "pages/MarketerAdmin/accepted-lab-advertisement-requests";

// Discount of Labhazir to lab
// import DiscountLabHazirToLab from "pages/MarketerAdmin/discount-labhazir-to-lab";


// Registration of Marketer Admin
import PendingComplaints from "pages/CSRAdmin/pending-complaints";
import InProcessComplaints from "pages/CSRAdmin/inprocess-complaints";
import inprocessComplaintslabhazir from "pages/CSRAdmin/inprocess-complaintslabhazir";
import ResolvedComplaints from "pages/CSRAdmin/resolved-complaints";
import ResolvedComplaintsLabhazir from "pages/CSRAdmin/resolved-complaintslabhazir";

import CSRsList from "pages/CSRAdmin/csrs-list";

import DashboardCsr from "pages/Dashboard-Csr";
import UnhandledComplaints from "pages/Complaints/unhandled-complaints";
import HandledComplaints from "pages/Complaints/handled-complaints";


import AssignedAudits from "pages/Auditor/assigned-audits";
import LabAudits from "pages/Dashboard-Lab/lab-audits";
import AuditorCompletedAudits from "pages/Auditor/completed-audits";
import AuditorProfile from "../pages/Authentication/StaffProfile";

import PendingAudits from "pages/AuditorAdmin/pending-audits";
import InProcessAudits from "pages/AuditorAdmin/inprocess-audits";
import PassedAudits from "pages/AuditorAdmin/passed-audits";
import FailedAudits from "pages/AuditorAdmin/failed-audits";
import AuditorsList from "pages/AuditorAdmin/auditors-list";

import PagesMaintenance from "pages/Utility/pages-maintenance";
import PagesComingsoon from "pages/Utility/pages-comingsoon";
import Pages404 from "pages/Utility/pages-404";
import Pages500 from "pages/Utility/pages-500";

import StaffRegister from "pages/HrAdmin/staff-register";
import StaffInfo from "pages/HrAdmin/staff-info";
import CSRList from "pages/HrAdmin/csr-list";
import AuditorList from "pages/HrAdmin/auditor-list";
import FinanceOfficerList from "pages/HrAdmin/finance-officer-list";
import DiscountLab from "pages/MarketerAdmin/discounttolab";
import BanksList from "pages/CreateBanks/banks-list";
import BankAccountsList from "pages/BankAccounts/bankaccounts-list";
import Payments from "pages/Authentication/Payments";


import csrsList from "pages/CSRAdmin/csrs-list";
import pendingComplaintslabhazir from "pages/CSRAdmin/pending-complaintslabhazir";
import { invoiceList } from "common/data";
import labsListPendingFee from "store/labs-list-pending/reducer";

// All general public routes will be listed here
const publicRoutes = [
  { path: "/register/:uuid?", component: Register },
  { path: "/logout", component: Logout },
  { path: "/login/:guest_id?/:uuid?", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/:token/confirm-password", component: ConfirmPwd },
  { path: "/patient-information/:id/:uuid?", component: PatientInformation },
  { path: "/b2bclient-information/:id", component: B2bClientInformation },
  { path: "/donor-information/:id", component: DonorInformation },
  { path: "/lab-information/:id", component: LabInformation },
  { path: "/corporate-information/:id", component: CorporateInformation },
  { path: "/feedback-detail/:lab_account_id", component: FeedbackDetail },
  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
  {
    path: "/cart/:guest_id?/:uuid?",
    component: CartsList,
  },
  {
    path: "/labs/:uuid?",
    component: labs,
  },
  {
    path: "/nearby-tests/:guest_id?/:uuid?",
    component: NearbyTests,
  },
  {  path: "/nearby-profiles/:guest_id?/:uuid?",
     component: NearbyProfiles 
  },
  {  path: "/nearby-packages/:guest_id?/:uuid?",
    component: NearbyPackages 
  },
  {
    path: "/nearby-lab-detail/:lab_account_id/:guest_id?/:uuid?",
    component: NearbyLabDetail,
  },
  {
    path: "/:lab_account_id/offered-test-by-lab/:guest_id?/:uuid?",
    component: TestsOfferedbyLab,
  },

];

const labAuthProtectedRoutes = [
  // { path: "/change-password", component: ChangePassword },
  { path: "/dashboard-lab", component: DashboardLab },
  {
    path: "/offered-tests",
    component: OfferedTestsList,
  },
  {
    path: "/discount-lab",
    component: discountLab,
  },
  {
    path: "/medical-test-sheet",
    component: MedicalTestSheet,
  },
  {
    path: "/sample-collectors",
    component: SampleCollectorsList,
  },
  {
    path: "/sample-collector-info/:id",
    component: SampleCollectorInfo,
  },
  {
    path: "/add-sample-collector",
    component: SampleCollectorRegister,
  },
  {
    path: "/quality-certificates",
    component: QualityCertificatesList,
  },
  {
    path: "/feedbacks",
    component: FeedbacksList,
  },
  {
    path: "/pathologists",
    component: PathologistsList,
  },
  {
    path: "/pending-test-appointments",
    component: TestAppointmentsPendingList,
  },
  {
    path: "/in-process-test-appointments",
    component: TestAppointmentsInProcessList,
  },
  {
    path: "/completed-test-appointments",
    component: TestAppointmentsCompletedList,
  },
  {
    path: "/lab-audit",
    component: LabAudits,
  },
  {
    path: "/lab-profile",
    component: LabProfile,
  },
  {
    path: "/lab-settings",
    component: LabSettings,
  },
  {
    path: "/lab-invoice-detail/:id",
    component: LabInvoiceDetail,
  },
  { path: "/account-statements", component: AccountStatements },
  { path: "/lab-advertisement", component: LabAdvertisements },
  { path: "/lab-advertisement", component: LabAdvertisements },
  {
    path: "/adv-invoice-detail/:id",
    component: AdvInvoiceDetail,
  },
  {
    path: "/lab-payments/:id",
    component: Payments,
  },
];

const b2bclientAuthProtectedRoutes = [
  { path: "/dashboard-b2bclient", component: DashboardB2b },
  {
    path: "/b2b-referred-patients",
    component: B2bReferredPatient,
  },
  { path: "/b2b-payment", component: B2bPayments },
  { path: "/b2b-account-statements", component: B2bAccountStatements },
  {
    path: "/in-process-b2b/:id",
    component: Invoiceb2b,
  },
  {
    path: "/b2b-shares",
    component: B2bLabShare,
  },
  {
    path: "/b2b-profile",
    component: B2bProfile,
  },
];
const financeOfficerAuthProtectedRoutes = [
  { path: "/dashboard-financeofficer", component: DashboardFinanceOfficer },
  { path: "/financeofficer-profile", component: FinanceOfficerProfile },
  { path: "/in-payment", component: InPayments },
  
  { path: "/out-payment", component: OutPayments },
  {
    path: "/payment-status",
    component: PaymentStatussList,
  },
  {
    path: "/deposit-status",
    component: depositStatussList,
  },
  {
    path: "/clear-status",
    component: clearStatussList,
  },
  {
    path: "/bounced-status",
    component: bouncedStatussList,
  },
  {
    path: "/payment-out-bounced-status",
    component: PaymentOutBouncedStatussList,
  },
  {
    path: "/payment-out-pending-clearence-status",
    component: PaymentOutStatussList,
  },
  {
    path: "/payment-out-created-status",
    component: PaymentOutCreatedStatussList,
  },



];
const financeAdminAuthProtectedRoutes = [
  { path: "/dashboard-financeadmin", component: DashboardFinanceAdmin },

  { path: "/cleared-in-payments", component: ClearedInPayments },
  { path: "/approved-in-payments", component: ApprovedInPayments },
  { path: "/unapproved-in-payments", component: UnapprovedInPayments },

  {path: "/create-bank", component: CreateBanks},
  {path: "/bank-account", component: BankAccounts},
  {path: "/banks-list", component: BanksList},
  {path: "/bankaccounts-list", component: BankAccountsList},

  // { path: "/financeadmin-profile", component: FinanceAdminProfile },
];
const donorAuthProtectedRoutes = [
  { path: "/donor-profile", component: DonorProfile },
  { path: "/donor-appointment", component: DonorAppointments },
  { path: "/donor-payment", component: DonorPayments },
  {
    path: "/donor-settings",
    component: DonorSettings,
  },
  { path: "/donor-account-statements", component: DonorAccountStatements },

];
// const b2badminAuthProtectedRoutes = [
//   { path: "/offeredlabs-shares/:id", component: OfferedLabsshares },
//   { path: "/b2blist", component: B2bAllClients },

const b2badminAuthProtectedRoutes = [
  { path: "/b2b-clients-shares/:id", component: B2BClientShares },
  // { path: "/offeredlabs-shares/:id", component: OfferedLabsshares },

  { path: "/b2b-clients-list", component: B2bAllClients },
];

const sampleCollectorAuthProtectedRoutes = [
  { path: "/dashboard-samplecollector", component: DashboardSampleCollector },
  {
    path: "/sample-collector-profile",
    component: SampleCollectorProfile,
  },
  // {
  //   path: "/sample-invoice-detail/:id",
  //   component: SampleInvoiceDetail,
  // },
  {
    path: "/sample-collector-in-process",
    component: SampleCollectorTestAppointmentsInProcessList,
  },
  {
    path: "/collector-invoice-detail/:id",
    component: CollectorInvoiceDetail,
  },
  {
    path: "/sample-collector-completed",
    component: SampleCollectorTestAppointmentsCompletedList,
  },

];

const auditorAuthProtectedRoutes = [
  { path: "/dashboard-auditor", component: DashboardAuditor },
  { path: "/auditor-profile", component: AuditorProfile },
  { path: "/assigned-audits", component: AssignedAudits },
  { path: "/audited-audits", component: AuditorCompletedAudits },
];

const registrationAdminAuthProtectedRoutes = [
  { path: "/pending-labs", component: PendingLabs },
  { path: "/labs-list-pending-fee", component: labsListPendingFeeOffered },
  {
    path: "/shared-percentage-pending-Fee/:id",component: sharedPercentagePendingFeeTests,
  },
  { path: "/approved-labs", component: ApprovedLabs },
  { path: "/unapproved-labs", component: UnapprovedLabs },
  { path: "/pending-b2b-clients", component: PendingB2bClients },
  { path: "/approved-b2b-clients", component: ApprovedB2bClients },
  { path: "/unapproved-b2b-clients", component: UnapprovedB2bClients },
  { path: "/pending-donors", component: PendingDonors },
  { path: "/approved-donors", component: ApprovedDonors },
  { path: "/unapproved-donors", component: UnapprovedDonors },
  {
    path: "/referrellab",component: ReferrelLab,
  },
  {
    path: "/approvereferrellab",component: ApproveReferrelLab,
  },
];

const marketerAdminAuthProtectedRoutes = [
  { path: "/advertisement", component: Advertisements },
  { path: "/advertisement-price-list", component: AdvertisementPriceLists },
  { path: "/discount-labhazir", component: DiscountLabHazir },
  { path: "/labs-list", component: labsList},
  {
    path: "/discountlab/:id",component: DiscountLab,
  },
  { path: "/pending-lab-advertisement-requests", component: LabAdvertisementRequests},
  { path: "/accepted-lab-advertisement-requests", component: LabAdvertisementRequestsAccepted}

];

const csrAuthProtectedRoutes = [
  { path: "/dashboard-csr", component: DashboardCsr },
  { path: "/staff-profile", component: StaffProfile},
  { path: "/handled-complaints", component: HandledComplaints },
  { path: "/unhandled-complaints", component: UnhandledComplaints },
];

const csrAdminAuthProtectedRoutes = [
  { path: "/pending-complaints-lab", component: PendingComplaints },
  { path: "/pending-complaints-labhazir", component: pendingComplaintslabhazir },
  { path: "/inprocess-complaints-lab", component: InProcessComplaints },
  { path: "/inprocess-complaints-labhazir", component: inprocessComplaintslabhazir },
  { path: "/resolved-complaints-lab", component: ResolvedComplaints },
  { path: "/resolved-complaints-labhazir", component: ResolvedComplaintsLabhazir },
  { path: "/csrs-list", component: CSRsList}
];

const auditorAdminAuthProtectedRoutes = [
  { path: "/pending-audits", component: PendingAudits },
  { path: "/inprocess-audits", component: InProcessAudits },
  { path: "/passed-audits", component: PassedAudits },
  { path: "/failed-audits", component: FailedAudits },
  { path: "/auditors-list", component: AuditorsList}
];


const hrAdminAuthProtectedRoutes = [
  { path: "/add-staff", component: StaffRegister },
  { path: "/staff-info/:id", component: StaffInfo },
  { path: "/csr-list", component: CSRList },
  { path: "/auditor-list", component: AuditorList },
  { path: "/finance-officer-list", component: FinanceOfficerList },
];

// All authenticated routes of the patient module will be listed here
const patientAuthProtectedRoutes = [
  { path: "/dashboard-patient/:uuid?", component: DashboardPatient },
  {
    path: "/test-appointments",
    component: TestAppointmentsList,
  },
  {
    path: "/profile",
    component: PatientProfile,
  },
  {
    path: "/cart/:uuid?",
    component: CartsList,
  },
  {
    path: "/checkout/:uuid?",
    component: Checkout,
  },
  {
    path: "/invoice-detail/:id",
    component: InvoiceDetail,
  },
  // { path: "/nearby-labs/:uuid?", component: NearbyLabs },

    // {
    //   path: "/nearby-tests/:uuid?",
    //   component: NearbyTests,
    // },
    // {  path: "/nearby-profiles/:uuid?",
    //    component: NearbyProfiles 
    // },
    // {  path: "/nearby-packages/:uuid?",
    //   component: NearbyPackages 
    // },
];

// All public routes of the patient module will be listed here
const patientPublicRoutes = [
  { path: "/change-password", component: ChangePassword },
  { path: "/contact-us", component: ContactUs },
  { path: "/disclaimer", component: Disclaimer },
  { path: "/about-us", component: AboutUs },
  { path: "/terms", component: TermsConditions},
  { path: "/nearby-labs/:uuid?", component: NearbyLabs },
  {
    path: "/labs/:guest_id?/:uuid?",
    component: labs,
  },
  {
    path: "/nearby-tests/:guest_id?/:uuid?",
    component: NearbyTests,
  },
  {  path: "/nearby-profiles/:guest_id?/:uuid?",
     component: NearbyProfiles 
  },
  {  path: "/nearby-packages/:guest_id?/:uuid?",
    component: NearbyPackages 
  },
  {
    path: "/nearby-lab-detail/:lab_account_id/:guest_id?/:uuid?",
    component: NearbyLabDetail,
  },
  {
    path: "/:lab_account_id/offered-test-by-lab/:guest_id?/:uuid?",
    component: TestsOfferedbyLab,
  },
  {
    path: "/:lab_account_id/lab-quality-certificates/:uuid?",
    component: LabQualityCertificates,
  },
  {
    path: "/:lab_account_id/lab-sample-collectors/:uuid?",
    component: LabSampleCollectors,
  },
  {
    path: "/:lab_account_id/lab-pathologists/:uuid?",
    component: LabPathologists,
  },
  { path: "/test-descriptions/:test_id/:uuid?", component: TestDescriptions },

  
];

const corporateAuthProtectedRoutes = [
  {
    path: "/dashboard-corporate/:id/profile",
    component: CorporateProfile,
  },
];

const authProtectedRoutes = [
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
];

export {
  authProtectedRoutes,
  labAuthProtectedRoutes,
  b2bclientAuthProtectedRoutes,
  donorAuthProtectedRoutes,
  sampleCollectorAuthProtectedRoutes,
  b2badminAuthProtectedRoutes,
  auditorAuthProtectedRoutes,
  financeOfficerAuthProtectedRoutes,
  financeAdminAuthProtectedRoutes,
  registrationAdminAuthProtectedRoutes,
  marketerAdminAuthProtectedRoutes,
  csrAdminAuthProtectedRoutes,
  csrAuthProtectedRoutes,
  auditorAdminAuthProtectedRoutes,
  hrAdminAuthProtectedRoutes,
  patientAuthProtectedRoutes,
  patientPublicRoutes,
  corporateAuthProtectedRoutes,
  publicRoutes,
};
