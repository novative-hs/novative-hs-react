import { all, fork } from "redux-saga/effects";

//public
import LayoutSaga from "./layout/saga";
import dashboardSaga from "./dashboard/saga";

import AccountSaga from "./auth/register/saga";

import LabInformationSaga from "./auth/labinformation/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ConfirmSaga from "./auth/confirmpwd/saga";
import ChangeSaga from "./auth/changepwd/saga";
import LabProfileSaga from "./auth/labprofile/saga";
import StaffProfileSaga from "./auth/staffprofile/saga";
import LabSettingsSaga from "./auth/labsettings/saga";
import PaymentsSaga from "./auth/payments/saga";
import InstrumentListSaga from "./instrument/saga"

import activitylogSaga from "./activtylog/saga";
import activitylogfinanceSaga from "./activtylogfinance/saga";
import activitylogmarketerSaga from "./activtylogmarketer/saga";

import regAdminNotificationSaga from "./regadminnotification/saga";

import cartsSaga from "./carts/saga";
import quotesSaga from "./quotes/saga";
import LabsListPendingFeeSaga from "./labs-list-pending/saga";
import sharedPercentagePendingFeeTestsSaga from "./shared-percentage-pending-fee/saga";
//////////// database admin units
import UnitsListSaga from "./units/sagas";
import UnitsHistorySaga from "./databaseadmin-history/sagas";
import ReagentsListSaga from "./reagents/sagas";
import ManufacturalListSaga from "./manufactural/sagas";
// organization
import organizationaccountSaga from "./organization/saga";

import msgsSaga from "./chat-box/saga";

import discountLabHazirsSaga from "./discount-labhazir/saga";
import discountLabHazirToLabsSaga from "./discount-labhazir-to-lab/saga";
import referrelFeeLabsSaga from "./referrel-fee-to-lab/saga";
import labsListSaga from "./labs-list/saga";
import labslisttsaga from "./labs-listttt/saga";
import TerritoriesListSaga from "./territories-list/saga";
import LabNamesListSaga from "./lab-names/saga";

import discountLabSaga from "./discount-lab/saga";
import feedbacksSaga from "./feedbacks/saga";

import checkoutSaga from "./checkout/saga";

import invoiceSaga from "./invoices/saga";
import advinvoiceSaga from "./adv-invoice/saga";



import complaintsSaga from "./complaints/saga";


import LabMarketSaga from "./labmarket/saga";

import AccountStatementsSaga from "./account-statements/saga";
import StaffSaga from "./staff/saga";
;
import RegistrationAdminSaga from "./registration-admin/saga";
import FinanceAdminSaga from "./finance-admin/saga";
import InstrumentTypeListSaga from "./databaseofunits/saga";
import NewsSaga from "./news/saga";





export  default function* rootSaga() {
  yield all([
    //public
    fork(organizationaccountSaga),
    fork(NewsSaga),
    fork(InstrumentListSaga),
    fork(ReagentsListSaga),
    fork(UnitsListSaga),
    fork(UnitsHistorySaga),
    fork(dashboardSaga),
    fork(LayoutSaga),
    fork(AccountSaga),
  fork(ManufacturalListSaga),
   fork(LabInformationSaga),
    fork(InstrumentTypeListSaga),
    fork(AuthSaga),
    fork(msgsSaga),

    fork(LabMarketSaga),
    
    fork(FinanceAdminSaga),
    fork(ForgetSaga),
    fork(ConfirmSaga),
    fork(ChangeSaga),
    fork(LabProfileSaga),
    fork(referrelFeeLabsSaga),
    fork(LabSettingsSaga),
    fork(LabNamesListSaga),
  
    fork(StaffProfileSaga),
  
    fork(PaymentsSaga),
   
    fork(activitylogSaga),
    fork(activitylogfinanceSaga),
    fork(activitylogmarketerSaga),
    
    fork(cartsSaga),
    fork(quotesSaga),
   
    fork(LabsListPendingFeeSaga),
    fork(sharedPercentagePendingFeeTestsSaga),

 
    fork(discountLabHazirsSaga),
    fork(discountLabHazirToLabsSaga),
    fork(labsListSaga),
    fork(labslisttsaga),
   
    fork(discountLabSaga),
    fork(feedbacksSaga),
   
    fork(complaintsSaga),
 
  
    fork(regAdminNotificationSaga),

    
    fork(checkoutSaga),

    fork(invoiceSaga),
    fork(advinvoiceSaga),
    fork(AccountStatementsSaga),

    fork(StaffSaga),
    fork(RegistrationAdminSaga),
    
  ]);
}
