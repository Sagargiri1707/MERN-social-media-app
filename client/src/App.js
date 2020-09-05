import React from 'react';
import './App.css';
import { Switch,Route } from 'react-router-dom'
import Home from './component/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Navbar from './component/navbar'
import Profile from './user/profile'
import Users from './user/users'
import ProfileEdit from './user/editprofile'
import PrivateRoute from './component/PrivateRoute'
import FIndPeople from './component/findpeople'
function App() {
  return (
    <div >
      <Navbar/>
      <Switch>
        <Route exact path="/" component={Home}/>
       
        <Route path="/users" component={Users}/>
        <Route exact path="/signup" component={Signup} />
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/profile/:userId" component={Profile}/>
        <PrivateRoute path="/user/edit/:userId" component={ProfileEdit}/>
        <PrivateRoute path="/findpeople" component={FIndPeople}/>

       </Switch>
    </div>
  );
}

export default App;

/* <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>
        <Route path="" component={}/>************/