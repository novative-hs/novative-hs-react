import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';


const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isLabAuthProtected,
  isCorporateAuthProtected,
 
  isDonorAuthProtected,
  isSampleCollectorAuthProtected,
  
  isAuditorAuthProtected,
  isfinanceOfficerAuthProtected,
  isdatabaseAdminAuthProtected,
  isParticipantAuthProtected,
  isRegistrationAdminAuthProtected,
  isCSRAdminAuthProtected,
  isMarketerAdminAuthProtected,
  isCSRAuthProtected,
  isAuditorAdminAuthProtected,
  isHRAdminAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      /* If the route is LabAuthProtected or CorporateAuthProtected then check if account type is patient
        - If yes then redirect it to the dashboard of the patient */

      /* If the route is PatientAuthProtected or CorporateAuthProtected then check if account type is labowner
        - If yes then redirect it to the dashboard of the labowner */

      /* If the route is PatientAuthProtected or LabAuthProtected then check if account type is corporate
        - If yes then redirect it to the dashboard of the corporate */

      if (isAuthProtected && !localStorage.getItem("authUser")) {
        // const guest_id = Math.floor(Math.random() * 10);
        // this.setState({ guest_id: guest_id });
        // guest_id = this.state.guest_id
        // console.log("differ route main set hoi:",guest_id)




        return (
          <Redirect
            to={
              { pathname: "/login", state: { from: props.location } }
       
            }
          />
        );
      }

      // Auth protection logics for the lab
      else if (
        isAuthProtected &&
        (
          isCorporateAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected||
          isRegistrationAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "labowner"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-lab",
              state: { from: props.location },
            }}
          />
        );
      }

      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isRegistrationAdminAuthProtected ||

          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isMarketerAdminAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "donor"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/unhandled-complaints",
              state: { from: props.location },
            }}
          />
        );
      }

      

      // Auth protection logics for the auditor
      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          
          isDonorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "auditor"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-auditor",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the sample collector
      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "samplecollector"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-samplecollector",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the registration admin
      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          
          isDonorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isAuditorAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "registration-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/pending-participant",
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
      
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isAuditorAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "CSR"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/register-participant-CSR",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the auditor admin
      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
         
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isDonorAuthProtected ||
          isCSRAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "auditor-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/pending-audits",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the hr admin
      else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
        
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isdatabaseAdminAuthProtected ||
          isParticipantAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isDonorAuthProtected ||
          isMarketerAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "organization"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/add-staff",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the marketer admin
      
       // Auth protection logics for the finance officer
       else if (
        isAuthProtected &&
        (
          isLabAuthProtected ||
          isCorporateAuthProtected ||
         
          isdatabaseAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isDonorAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "finance-officer"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-finance",
              state: { from: props.location },
            }}
          />
        );
      }
             // Auth protection logics for the finance Admin
             else if (
              isAuthProtected &&
              (
                isLabAuthProtected ||
                isCorporateAuthProtected ||
               
                isfinanceOfficerAuthProtected ||
                isSampleCollectorAuthProtected ||
                isAuditorAuthProtected ||
                isCSRAdminAuthProtected ||
                isCSRAuthProtected ||
                isAuditorAdminAuthProtected ||
                isDonorAuthProtected ||
                isRegistrationAdminAuthProtected ||
                isMarketerAdminAuthProtected ||
                isHRAdminAuthProtected) &&
              JSON.parse(localStorage.getItem("authUser")).account_type ==
                "admin"
            ) {
              return (
                <Redirect
                  to={{
                    pathname: "/dashboard-databaseadmin",
                    state: { from: props.location },
                  }}
                />
              );
            }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  isLabAuthProtected: PropTypes.bool,
  
  isDonorAuthProtected: PropTypes.bool,
  isSampleCollectorAuthProtected: PropTypes.bool,
  isfinanceOfficerAuthProtected: PropTypes.bool,
  isdatabaseAdminAuthProtected: PropTypes.bool,
  isParticipantAuthProtected: PropTypes.bool,
  isAuditorAuthProtected: PropTypes.bool,
  isRegistrationAdminAuthProtected: PropTypes.bool,
  isMarketerAdminAuthProtected: PropTypes.bool,
  isCSRAdminAuthProtected: PropTypes.bool,
  isCSRAuthProtected: PropTypes.bool,
  isAuditorAdminAuthProtected: PropTypes.bool,
  isHRAdminAuthProtected: PropTypes.bool,

  isCorporateAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
