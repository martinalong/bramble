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
import Schedule from './pages/Schedule'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import {useSelector} from 'react-redux';
import { Stitch, 
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

const client = Stitch.initializeDefaultAppClient("bramble-bptsn");
const mongodb = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
export const patientCollection = mongodb.db("data").collection("patientCollection");

function App() {
  let auth = useSelector(state => state.auth)
  let info = useSelector(state => state.info)
  let accountType = null
  if (info) {
    accountType = info.accountType
  }
  console.log("auth", auth)
  console.log("info", info)
  console.log("accountType", accountType)
  return (
    <div className="app">
      <Router>
        <Navbar/>
        <Switch>

          <Route exact path="/">
            <Landing accountType={accountType}/>
          </Route>

          <Route exact path="/signup">
            <Login type="signup"/>
          </Route>
          
          <Route exact path="/login">
            <Login type="login" auth={auth}/>
          </Route>

          <Route exact path="/first-login">
            <Login type="first-login"/>
          </Route>

          <Route exact path="/onboarding">
            <Onboarding auth={auth}/>
          </Route>

          <Route exact path="/dashboard">
            <Dashboard accountType={accountType} info={info}/>
          </Route>

          <PrivateRoute exact path="/communication" accountType={accountType}>
            <Chat accountType={accountType} info={info}/>
          </PrivateRoute>

          <PrivateRoute exact path="/account" accountType={accountType}>
            <Account accountType={accountType} auth={auth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/appointments" accountType={accountType}>
            <Schedule accountType={accountType} info={info}/>
          </PrivateRoute>

          <PrivateRoute exact path="/patients" accountType={accountType}>
            <Patients auth={auth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/doctors" accountType={accountType}>
            <Doctors auth={auth}/>
          </PrivateRoute>

          <Route component={Error}/>
        </Switch>
        <Footer accountType={accountType}/>
      </Router>
    </div>
  )
}

function PrivateRoute({ children, ...rest }) {
  let authenticated = useSelector(state => state.auth)
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
