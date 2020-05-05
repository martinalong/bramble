import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Error from './pages/Error'
import Login from './pages/Login'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Account from './pages/Account'
import Schedule from './pages/Schedule'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import {useSelector} from 'react-redux';

function App() {
  let authenticated = useSelector(state => state.authenticated)
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/patient">
            <Navbar isPatient={true} authenticated={authenticated}/>
          </Route>

          <Route path="/provider">
            <Navbar isPatient={false} authenticated={authenticated}/>
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/signup">
            <Login hasAccount={false} authenticated={authenticated}/>
          </Route>
          
          <Route exact path="/login">
            <Login hasAccount={true} authenticated={authenticated}/>
          </Route>

          <Route exact path="/patient">
            <Home isPatient={true} authenticated={authenticated}/>
          </Route>

          <PrivateRoute exact path="/patient/communication">
            <Chat isPatient={true} authenticated={authenticated}/>
          </PrivateRoute>

          <PrivateRoute exact path="/patient/appointments">
            <Schedule isPatient={true} authenticated={authenticated}/>
          </PrivateRoute>

          <Route exact path="/patient/doctors">
            <Doctors authenticated={authenticated}/>
          </Route>

          <PrivateRoute exact path="/patient/profile">
            <Account isPatient={true} authenticated={authenticated}/>
          </PrivateRoute>

          <Route exact path="/provider">
            <Home isPatient={false} authenticated={authenticated}/>
          </Route>

          <PrivateRoute exact path="/provider/communication">
            <Chat isPatient={false} authenticated={authenticated}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/appointments">
            <Schedule isPatient={false} authenticated={authenticated}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/patients">
            <Patients authenticated={authenticated}/>
          </PrivateRoute>

          <PrivateRoute exact path="/provider/profile">
            <Account isPatient={false} authenticated={authenticated}/>
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

function PrivateRoute({ children, ...rest }) {
  let authenticated = useSelector(state => state.authenticated)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
