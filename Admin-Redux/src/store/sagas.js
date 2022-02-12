import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import PatientInformationSaga from "./auth/patientinformation/saga";
import LabInformationSaga from "./auth/labinformation/saga";
import CorporateInformationSaga from "./auth/corporateinformation/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ConfirmSaga from "./auth/confirmpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import ecommerceSaga from "./e-commerce/saga";
import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import cryptoSaga from "./crypto/saga";
import invoiceSaga from "./invoices/saga";
import projectsSaga from "./projects/saga";
import tasksSaga from "./tasks/saga";
import mailsSaga from "./mails/saga";
import contactsSaga from "./contacts/saga";
import offeredTestsSaga from "./offered-tests/saga";
import pathologistsSaga from "./pathologists/saga";
import sampleCollectorsSaga from "./sample-collectors/saga";
import qualityCertificatesSaga from "./quality-certificates/saga";
import testAppointmentsSaga from "./test-appointments/saga";
import dashboardSaga from "./dashboard/saga";
import dashboardSaasSaga from "./dashboard-saas/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(PatientInformationSaga),
    fork(LabInformationSaga),
    fork(CorporateInformationSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ConfirmSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ecommerceSaga),
    fork(calendarSaga),
    fork(chatSaga),
    fork(mailsSaga),
    fork(cryptoSaga),
    fork(invoiceSaga),
    fork(projectsSaga),
    fork(tasksSaga),
    fork(contactsSaga),
    fork(offeredTestsSaga),
    fork(pathologistsSaga),
    fork(sampleCollectorsSaga),
    fork(qualityCertificatesSaga),
    fork(testAppointmentsSaga),
    fork(dashboardSaga),
    fork(dashboardSaasSaga),
  ]);
}
