import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IProjectsFromDb } from '../../utils/Interfaces';
import ListOfProjects from '../listOfProjects/ListOfProjects';
import './UpdateProject.css';


const UpdateProject = () => {

  const initProjectData : IProjectsFromDb = { 
     
  projectCategory : '',
  projectTitle : '',
  imageCategory : '',
  imageTitle : '',
  url: ''
  }

  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const [selectedProjectData, setSelectedProjectData] = useState(initProjectData);
  const [updatedProjectData, setUpdatedProjectData] = useState(initProjectData);
  const [fieldStatus, setFieldStatus] = useState(initProjectData);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProjectUpdated, setIsProjectUpdated] = useState(false);
  const [isStatusDivHidden, setIsStatusDivHidden] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const {projectCategory, projectTitle, imageCategory, imageTitle} = updatedProjectData;
  const {url} = selectedProjectData;

  const handleIsProjectSelected = () => {
    setIsProjectSelected(true);    
  }  

  const getSelectedProjectData = (data: IProjectsFromDb) => {       
    setSelectedProjectData(data);    
  } 

  const handleSelectedProject = (data: IProjectsFromDb) => {
    handleIsProjectSelected();
    getSelectedProjectData(data);
  }

  const updateProjectData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdatedProjectData({
      ...updatedProjectData, [e.target.name]: e.target.value, id: selectedProjectData.id
    });
    setFieldStatus({
      ...fieldStatus, [e.target.name]: 'filled'
    });
  }

  const formValidation = () => {
    const isFormFilled = {
      'projectCategory': projectCategory.length > 0 ? 'filled' : 'notFilled',
      'projectTitle' : projectTitle.length > 0 ? 'filled' : 'notFilled',
      'imageCategory' : imageCategory.length > 0 ? 'filled' : 'notFilled',
      'imageTitle' : imageTitle.length > 0 ? 'filled' : 'notFilled',
      'url': ''    
    };
    setFieldStatus({
      ...isFormFilled
    });   
  }

  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    
    if(projectCategory !== '' && projectTitle !== '' && imageCategory !== '' && imageTitle !=='' && url !== '') {
      const formData = new FormData();
      formData.append('projectCategory', projectCategory);
      formData.append('projectTitle', projectTitle);
      formData.append('imageCategory', imageCategory);
      formData.append('imageTitle', imageTitle);
      formData.append('url', url);
    
      await axios.put(`https://localhost:44328/api/ProjectsDbs/${selectedProjectData.id}`, formData)
      .then(response => {        
        if(response.status === 202) {
          setStatusMessage('Project successfully updated');
          setIsStatusDivHidden(false);         
          setIsProjectUpdated(true);                  
        }         
      })
      .catch(error => {
        setIsStatusDivHidden(false);
        if(!error.response) {
          setStatusMessage("Check if server is started!");
        } else {
          setStatusMessage("Internal server error!");
        }
      });
    } else {
      setStatusMessage('Please, fill all fields!');
      formValidation();
    }   
  }
  
  const handleBackToAllProjects = () => {
    clearFormFields();        
  }
  
  const clearFormFields = () => {
    setUpdatedProjectData(initProjectData);
    formRef.current?.reset();    
    setIsStatusDivHidden(false);
    setStatusMessage('');
    setIsProjectUpdated(false);
    setFieldStatus(initProjectData);
    setIsProjectSelected(false);
  } 

  useEffect(() => {
    if(projectCategory !== '' && projectTitle !== '' && imageCategory !== '' && imageTitle !== '') {
          setIsStatusDivHidden(true);
    }
  }, [projectCategory, projectTitle, imageCategory, imageTitle,]);  

  return(    
    <>
      {
        !isProjectSelected
        ?
          <>
            <div className='titleDivUpdate'> Click white circle to select project You want to update </div>
            <div className='containerDivUpdate'>
              
              <ListOfProjects handleSelection={handleSelectedProject}/>
            </div>
          </>
        :
        <div className='containerDivUpdate'>
          <div className='selectedProjectContainerDiv'>
            <div> Selected project current data:</div>
            <span className='projectPropertySpanUpdate'> Image id: </span> {selectedProjectData.id},
            <span className='projectPropertySpanUpdate'> Project Category: </span> {selectedProjectData.projectCategory},
            <span className='projectPropertySpanUpdate'> Project Title: </span> {selectedProjectData.projectTitle},                                  
            <span className='projectPropertySpanUpdate'> Image Category: </span> {selectedProjectData.imageCategory},
            <span className='projectPropertySpanUpdate'> Image Title: </span>{selectedProjectData.imageTitle} <br/>
          </div>
          <div className='instructionDivUpdate'> Use form to enter new data </div>
          <form className='formStyleUpdate' 
                onSubmit={handleFormSubmit}
                ref={formRef}
          >      
            <label htmlFor='projectCategory'> Chose project category: </label><br/>
            <div className={`${fieldStatus.projectCategory === 'filled' ? ' inputStyleUpdate selectStyleUpdate' : ''}
                            ${fieldStatus.projectCategory === 'notFilled' ? 'inputStyleUpdate inputEmptyUpdate' : ''}
                            ${fieldStatus.projectCategory === '' ? 'inputStyleUpdate' : ''} `}
            >
            <select className='inputUnset'
                  id='projectCategory'
                  name='projectCategory'                
                  onChange={updateProjectData}
                  defaultValue=''
            >          
              <option hidden value=''> Select project category </option>
              <option value='interior-design'> Interior Design </option>
              <option value='academic-projects'> Academic Projects</option> 
              <option value='competitions-projects'> Competition Projects</option>
            </select>
            </div>
          
            <label htmlFor='projectTitle'> Project Title: </label> <br/>
            <div className={` inputStyleUpdate ${fieldStatus.projectTitle === 'filled' ? 'selectStyleUpdate' : ''}`}>        
              <input className='inputUnset'
                    type='text'
                    id={`${fieldStatus.projectTitle === 'notFilled' ? 'inputIdForStyle' : 'projectTitle'}`}
                    name='projectTitle'
                    value={updatedProjectData.projectTitle}
                    placeholder ='Enter project title'
                    onChange={updateProjectData}               
              />
            </div>      
            
            <label htmlFor='imageCategory'> Chose image category: </label><br/>
            <div className={` inputStyleUpdate ${fieldStatus.imageCategory === 'filled' ? 'selectStyleUpdate' : ''}
                            ${fieldStatus.imageCategory === 'notFilled' ? 'inputEmptyUpdate' : ''}  `}
            >
            <select className='inputUnset'
                  id='imageCategory'
                  name='imageCategory'
                  onChange={updateProjectData}
                  defaultValue={updatedProjectData.imageCategory}
            >          
              <option hidden value=''> Select image category </option>
              <option value='Cover Photo'> Cover Photo </option>
              <option value='Project Content'> Project Content </option>
            </select>
            </div>      
        
            <label htmlFor='imageTitle'> Image Title: </label><br/> 
            <div className={`inputStyleUpdate ${fieldStatus.imageTitle === 'filled' ? 'selectStyleUpdate' : ''}`}>       
              <input className='inputUnset'
                    type='text'
                    id={`${fieldStatus.imageTitle === 'notFilled' ? 'inputIdForStyle' : 'imageTitle'}`}
                    name='imageTitle'
                    value={updatedProjectData.imageTitle}
                    placeholder='Enter image title'                
                    onChange={updateProjectData}               
              /> 
            </div>                  
            
            {
              statusMessage.length > 0 
              ? <div className={`statusMessageDivUpdate ${isProjectUpdated ? 'projectUpdated' : ''}
                                ${isStatusDivHidden ? 'statusDiVDisplayNoneUpdate' : ''}`}
                > 
                    {statusMessage} 
                </div> 
              : null
            }

            <input className='submitButtonUpdate'
                    style={{marginTop: "3vh"}}
                    type='submit' 
                    value='SUBMIT FORM'
            />                         
          
            <button className='backButtonUpdate'                    
                    type='button'
                    onClick={handleBackToAllProjects}> 
                    BACK TO ALL PROJECTS
            </button>
          </form>
        </div>
      } 
    </>    
  )
}
export default UpdateProject;