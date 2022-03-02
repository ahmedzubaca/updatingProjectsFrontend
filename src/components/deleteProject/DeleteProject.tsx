import React, { useRef, useState } from 'react';
import axios from 'axios';
import ListOfProjects from '../listOfProjects/ListOfProjects'
import './DeleteProject.css';
import { IProjectsFromDb } from '../../utils/Interfaces';

const DeleteProject = () => {

  const initProjectData: IProjectsFromDb = {
  id: 0,
  projectCategory : '',
  projectTitle : '',
  imageCategory : '',
  imageTitle : '',
  url: ''
  }
  
  const [projectData, setProjectData] = useState(initProjectData);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProjectDeleted, setIsProjectDeleted] = useState(false);  
  const inputRef = useRef<HTMLInputElement>(null);  

  const handleSelectedProject = (data: IProjectsFromDb) => { 
    if(data) {
      setProjectData(data);
      setTimeout(() => {
        if(inputRef !== null && inputRef.current !== null ) {
          inputRef.current.focus();
        } 
      },1000);           
    }   
  }

  const handleProjectDelete = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if(projectData && projectData.id) {
      await axios.delete(`https://localhost:44328/api/ProjectsDbs/${projectData.id}`)
      .then(response => {
        if(response.status === 202) {
          setStatusMessage('Project successfully deleted');          
          setIsProjectDeleted(true);
          setTimeout(() => {
            window.location.reload();
          },4000);          
        } 
      })
      .catch(error => {        
        if(!error.response) {
          setStatusMessage("Check if server is started!");
        } else {
          setStatusMessage("Internal server error!");
        }
      });
    }
  }

  return( 
    <>
      <div className='titleDivDelete'> Click white circle to select project You want to delete </div>  
      <form className='formLayoutDelete'
            onSubmit={handleProjectDelete}
      >
        <ListOfProjects handleSelection={handleSelectedProject}/>
        {
          statusMessage.length > 0 
          ? <div className={`statusMessageDivDelete ${isProjectDeleted ? 'projectDeleted' : ''}`}> 
                {statusMessage} 
            </div> 
          : null
        }                 
        <input className='submitInputDelete'
              type='submit' 
              ref={inputRef} 
              value = 'DELETE PROJECT'
        />          
      </form> 
    </>  
  );
}
export default DeleteProject