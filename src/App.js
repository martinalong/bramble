import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Error from './pages/Error'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Account from './pages/Account'
import ProviderSchedule from './pages/ProviderSchedule'
import PatientSchedule from './pages/PatientSchedule'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import {useSelector} from 'react-redux';
import { Stitch, 
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

const client = Stitch.initializeDefaultAppClient("bramble-bptsn");
const mongodb = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
export const patientCollection = mongodb.db("data").collection("patientCollection");
export const providerCollection = mongodb.db("data").collection("providerCollection");
export const practiceCollection = mongodb.db("data").collection("practiceCollection");
export const appointmentCollection = mongodb.db("data").collection("appointmentCollection");

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar/>
        <Switch>

          <Route exact path="/">
            <Landing/>
          </Route>

          <Route exact path="/signup">
            <Login type="signup"/>
          </Route>
          
          <Route exact path="/login">
            <Login type="login"/>
          </Route>

          <Route exact path="/onboarding/provider">
            <Onboarding type="provider"/>
          </Route>

          <Route exact path="/onboarding/patient">
            <Onboarding type="patient"/>
          </Route>

          <Route exact path="/dashboard">
            <Dashboard/>
          </Route>

          <PrivateRoute exact path="/communication">
            <Chat/>
          </PrivateRoute>

          <PrivateRoute exact path="/account">
            <Account/>
          </PrivateRoute>

          <Route exact path="/appointments">
            <ProviderSchedule/>
          </Route>

          {/* <PrivateRoute exact path="/appointments">
            {info.accountType === "patient" ?
            <PatientSchedule info={info}/> :
            info.accountType === "provider" ? 
            <ProviderSchedule info={info}/> :
            <Error type="onboarding"/>
            }
          </PrivateRoute> */}

          <PrivateRoute exact path="/patients">
            <Patients/>
          </PrivateRoute>

          <PrivateRoute exact path="/doctors">
            <Doctors/>
          </PrivateRoute>

          <Route component={Error}/>
        </Switch>
        <Footer/>
      </Router>
    </div>
  )
}

function PrivateRoute({ children, ...rest }) {
  let authenticated = useSelector(state => state.login)
  let path = "/login"
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: path,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
