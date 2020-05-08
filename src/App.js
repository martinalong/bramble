import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Error from './pages/Error'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Account from './pages/Account'
import Schedule from './pages/Schedule'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import {useSelector} from 'react-redux';

function App() {
  let docAuth = useSelector(state => state.docAuth)
  let patientAuth = useSelector(state => state.patientAuth)
  return (
    <div className="app">
      <Router>
        <Switch>

          <Route path="/patient">
            <Navbar isPatient={true} authenticated={patientAuth}/>
          </Route>

          <Route path="/provider">
            <Navbar isPatient={false} authenticated={patientAuth}/>
          </Route>

          <Route>
            <Navbar landingPage={true}/>
          </Route>

        </Switch>
        <Switch>

          <Route exact path="/">
            <Landing/>
          </Route>

          <Route exact path="/patient">
            <Home isPatient={true} authenticated={patientAuth}/>
          </Route>

          <Route exact path="/patient/signup">
            <Signup isPatient={true} authenticated={patientAuth}/>
          </Route>
          
          <Route exact path="/patient/login">
            <Login isPatient={true} authenticated={patientAuth}/>
          </Route>

          <PrivateRoute exact path="/patient/communication" isPatient={true}>
            <Chat isPatient={true} authenticated={patientAuth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/patient/appointments" isPatient={true}>
            <Schedule isPatient={true} authenticated={patientAuth}/>
          </PrivateRoute>

          <Route exact path="/patient/doctors">
            <Doctors authenticated={patientAuth}/>
          </Route>

          <PrivateRoute exact path="/patient/profile" isPatient={true}>
            <Account isPatient={true} authenticated={patientAuth}/>
          </PrivateRoute>

          <Route exact path="/provider">
            <Home isPatient={false} authenticated={docAuth}/>
          </Route>

          <Route exact path="/provider/signup">
            <Signup isPatient={false} authenticated={docAuth}/>
          </Route>
          
          <Route exact path="/provider/login">
            <Login isPatient={false} authenticated={docAuth}/>
          </Route>

          <PrivateRoute exact path="/provider/communication" isPatient={false}>
            <Chat isPatient={false} authenticated={docAuth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/appointments" isPatient={false}>
            <Schedule isPatient={false} authenticated={docAuth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/patients" isPatient={false}>
            <Patients authenticated={docAuth}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/profile" isPatient={false}>
            <Account isPatient={false} authenticated={docAuth}/>
          </PrivateRoute>

          <Route component={Error}/>
        </Switch>
        <Switch>
          <Route path="/patient">
            <Footer isPatient={true}/>
          </Route>

          <Route path="/provider">
            <Footer isPatient={false}/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

function PrivateRoute({ isPatient, children, ...rest }) {
  let authenticated = useSelector(state => state.authenticated)
  let path = isPatient ? "/patient/login" : "/provider/login"
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
