import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isLabAuthProtected,
  isPatientAuthProtected,
  isCorporateAuthProtected,
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
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      } else if (
        isAuthProtected &&
        isLabAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "patient"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-patient/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        isCorporateAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "patient"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-patient/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        isPatientAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "labowner"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-lab/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        isCorporateAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "labowner"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-lab/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        isPatientAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "corporate"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-corporate/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        isLabAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "corporate"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-corporate/" +
                JSON.parse(localStorage.getItem("authUser")).user_id,
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
  isPatientAuthProtected: PropTypes.bool,
  isCorporateAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
