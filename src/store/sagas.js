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
import InstrumentListSaga from "./instrument/saga";

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
import SchemeListSaga from "./scheme/saga";
import CycleListSaga from "./cycle/saga";
import RoundListSaga from "./rounds/saga";
import SampleSaga from "./sample/saga";
import PaymentSaga from "./Payment/saga";

//Participant
import participantListSaga from "./participant-list/sagas";
import regParticipantSaga from "./registerParticipantFile/saga";

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
import RegistrationAdminSaga from "./registration-admin/saga";
import FinanceAdminSaga from "./finance-admin/saga";
import InstrumentTypeListSaga from "./databaseofunits/saga";
import NewsSaga from "./news/saga";
import MethodsListSaga from "./methods/sagas";

import CityListSaga from "./participantcity/sagas";
import CountryListSaga from "./participantcountry/sagas";
import ProvinceListSaga from "./participantprovince/sagas";
import DistrictListSaga from "./participantdistrict/sagas";
import DepartmentListSaga from "./participantdepartment/sagas";
import DesignationListSaga from "./participantdesignation/sagas";
import TypeListSaga from "./participanttype/sagas";
import SectorListSaga from "./participantsector/sagas";
import QualitativeTypeListSaga from "./qualitativetype/sagas";

//selected schemes
import SelectedSchemeListSaga from "./selected-scheme/saga";
import AnalyteSchemeSaga from "./results/saga";
import ResultSubmitSaga from "./resultsSubmit/saga";

export  default function* rootSaga() {
  yield all([
    //public
    fork(QualitativeTypeListSaga),
    fork(PaymentSaga),
    fork(ProvinceListSaga),
    fork(CountryListSaga),
    fork(SectorListSaga),
    fork(TypeListSaga),
    fork(DesignationListSaga),
    fork(DepartmentListSaga),
    fork(DistrictListSaga),
    fork(CityListSaga),
    fork(SampleSaga),
    fork(organizationaccountSaga),
    fork(NewsSaga),
    fork(MethodsListSaga),
    fork(InstrumentListSaga),
    fork(ReagentsListSaga),
    fork(UnitsListSaga),
    fork(regParticipantSaga),
    fork(UnitsHistorySaga),
    fork(dashboardSaga),
    fork(LayoutSaga),
    fork(AccountSaga),
    fork(ManufacturalListSaga),
    fork(SchemeListSaga),
    fork(SelectedSchemeListSaga),
    fork(AnalyteSchemeSaga),
    fork(ResultSubmitSaga),
    fork(CycleListSaga),
    fork(RoundListSaga),
    fork(participantListSaga),
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
