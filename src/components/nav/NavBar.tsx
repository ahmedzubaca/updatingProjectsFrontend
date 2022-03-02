import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  
  return (
    <>      
      <div className='buttonContainerDivNavBar'>
        <Link to= '/'>
          <button className='actionButton' style={{margin: 0}}> HOME </button> 
        </Link>
        <Link to='/add-project'>
          <button className='actionButton'> ADD PROJECT</button>
        </Link>
        <Link to='/delete-project'>
          <button className='actionButton'> DELETE PROJECT</button>
        </Link>
        <Link to='/update-project'>
          <button className='actionButton'> UPDATE PROJECT</button>
        </Link>         
      </div>     
    </>
  );
}
export default NavBar
