import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {

  const [loginData, setLoginData] = useState({ 
          name: '', password: ''})

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {   
    setLoginData({...loginData, [e.target.name]:  e.target.value })
  }

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
     
    const formData = new FormData();
    formData.append('name', loginData.name);
    formData.append('password', loginData.password);
    await axios.post('https://localhost:44328/api/Login/login', formData, {withCredentials: true})
    .then((response) => {
      console.log(response.data);    
    });    
  }

  const getUser = async () => {
    await axios.get('https://localhost:44328/api/Login/user', {withCredentials: true})
    .then((response) => {
      console.log(response.data);    
    });
  }

  return(
    <div>
      <form onSubmit={submitPassword}>
      <label> Name </label>
        <input type='text'
        name='name'
              value={loginData.name}
              onChange={onInputChange}
        />
        <label> Password </label>
        <input type='text'
        name='password'
              value={loginData.password}
              onChange={onInputChange}
        />
       
        <input type='submit'
              value='SUBMIT PASSWORD'                    
        />
      </form>
      <button onClick={getUser}>GetUser</button>
    </div>
  );
}
export default Login;