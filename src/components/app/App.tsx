import React from 'react';
import NavBar from '../nav/NavBar';
import AddProject from '../addProject/AddProject';
import DeleteProject from '../deleteProject/DeleteProject'; 
import Homepage from '../homepage/Hompage';
import UpdateProject from '../updateProject/UpdateProject';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from '../login/Login';
import Register from '../register/Register';

function App() {
  return (
    <>
      {/* <Register />
      <Login /> */}
      <Router>
        <NavBar /> 
        <Route exact path = '/'> <Homepage/> </Route>       
        <Route exact path = '/add-project'> <AddProject/> </Route>
        <Route exact path = '/delete-project'> <DeleteProject/> </Route>
        <Route exact path = '/update-project'> <UpdateProject/> </Route>               
      </Router>     
    </>
  );
}
export default App;