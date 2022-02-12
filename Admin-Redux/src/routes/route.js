import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isLabAuthProtected,
  isPatientAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthProtected && !localStorage.getItem("authUser")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      } else if (
        isAuthProtected &&
        isLabAuthProtected &&
        JSON.parse(localStorage.getItem("authUser")).account_type != "labowner"
      ) {
        console.log(JSON.parse(localStorage.getItem("authUser")));
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
        JSON.parse(localStorage.getItem("authUser")).account_type != "patient"
      ) {
        console.log(JSON.parse(localStorage.getItem("authUser")));
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
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
