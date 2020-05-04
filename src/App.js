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
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/patient">
            <Navbar isPatient={true}/>
          </Route>
          <Route path="/provider">
            <Navbar isPatient={false}/>
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/patient">
            <Home isPatient={true}/>
          </Route>
          <Route exact path="/patient/login">
            <Login isPatient={true}/>
          </Route>
          <Route exact path="/patient/communication">
            <Chat isPatient={true}/>
          </Route>
          <Route exact path="/patient/appointments">
            <Schedule isPatient={true}/>
          </Route>
          <Route exact path="/patient/doctors" component={Doctors}/>
          <Route exact path="/patient/profile">
            <Account isPatient={true}/>
          </Route>
          <Route exact path="/provider">
            <Home isPatient={false}/>
          </Route>
          <Route exact path="/provider/communication">
            <Chat isPatient={false}/>
          </Route>
          <Route exact path="/provider/appointments">
            <Schedule isPatient={false}/>
          </Route>
          <Route exact path="/provider/patients" component={Patients}/>
          <Route exact path="/provider/profile">
            <Account isPatient={false}/>
          </Route>
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

export default App;
