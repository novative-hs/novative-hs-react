import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";



// Import Routes
import {
  authProtectedRoutes,
  labAuthProtectedRoutes,
  

  financeOfficerAuthProtectedRoutes,
  databaseAdminAuthProtectedRoutes,
  participantsAuthProtectedRoutes,
 
  registrationAdminAuthProtectedRoutes,

  hrAdminAuthProtectedRoutes,
  publicRoutes,
} from "./routes/";
import AppRoute from "./routes/route";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Import fackbackend Configuration file
import fakeBackend from "./helpers/AuthType/fakeBackend";
import Pages404 from "pages/Utility/pages-404";

// Activating fake backend
fakeBackend();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.getLayout = this.getLayout.bind(this);
  }


  render() {
    // const Layout = this.getLayout();

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isParticipantAuthProtected= {false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
                isParticipantAuthProtected= {false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                 isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
               
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {labAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={true}
                isCorporateAuthProtected={false}
                
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                isParticipantAuthProtected= {true}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            
            {registrationAdminAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
               
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                
                isParticipantAuthProtected= {false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={true}
                isMarketerAdminAuthProtected={false}
              
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

          

            {hrAdminAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
            
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                isParticipantAuthProtected= {false}
              
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
             
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={true}
                exact
              />
            ))}

          
             {financeOfficerAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={VerticalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={true}
                isdatabaseAdminAuthProtected={false}
                isParticipantAuthProtected= {false}
                isAuditorAuthProtected={false}
               
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
            
                
                isHRAdminAuthProtected={false}
                exact
              />
            ))}
{databaseAdminAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={true}
                isParticipantAuthProtected= {false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
              
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}
          

          {  participantsAuthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isCorporateAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isdatabaseAdminAuthProtected={false}
                isParticipantAuthProtected= {true}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
              
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}
       
            <Route path="*" component={Pages404} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

App.propTypes = {
  layout: PropTypes.object,
};

export default connect(mapStateToProps, null)(App);
