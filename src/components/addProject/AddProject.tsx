import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './AddProject.css';
import { IProjectsFromDb } from '../../utils/Interfaces';

interface IProjectData {
  projectProperties: IProjectsFromDb,
  imageFile: string | Blob,
  imageName : string       
}

const AddProject= () => {

  const initialProjectData : IProjectData = {    
      projectProperties : {
        projectCategory: '',
        projectTitle : '',
        imageCategory : '',
        imageTitle : '',
        url : '',
      },     
      imageFile : '', 
      imageName : ''          
  }   
  const [previewUrl, setPreviewUrl] = useState ('default.jpg');
  const [projectData, setProjectData] = useState(initialProjectData);
  const [statusMessage, setStatusMessage] = useState('');
  const [fieldStatus, setFieldStatus] = useState<Record<string, string>>({});
  const [isProjectAdded, setIsProjectAdded] = useState(false);
  const [statusDivDisappear, setStatusDivDisappear] = useState(false);  
  const formRef = useRef<HTMLFormElement>(null);
  const {projectCategory, projectTitle, imageCategory, imageTitle, url } = projectData.projectProperties;
  const{imageFile, imageName } = projectData; 
  
  const handleImagePreviewAndImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {  
        const file = e.target.files[0];
        setProjectData({
          ...projectData, imageFile : file, imageName : file.name
        });
        setFieldStatus({
          ...fieldStatus, imageFile: 'filled'
        });               
       
        const reader = new FileReader();
        reader.onload = x => {
          if(x.target) {            
            setPreviewUrl(x.target.result as string);                             
          }
        }
      reader.readAsDataURL(file);                   
    }
  }  

  const handleProjectData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) => {       
    setProjectData({      
      ...projectData, projectProperties: {
        ...projectData.projectProperties, [e.target.name] : e.target.value
      }                
    });
    setFieldStatus({
      ...fieldStatus, [e.target.name] : 'filled' 
    });      
  } 
  
  const formValidation = () => {
    const isFormFilled = {
      'projectCategory': projectCategory.length > 0 ? 'filled' : 'notFilled',
      'projectTitle' : projectTitle.length > 0 ? 'filled' : 'notFilled',
      'imageCategory' : imageCategory.length > 0 ? 'filled' : 'notFilled',
      'imageTitle' : imageTitle.length > 0 ? 'filled' : 'notFilled',
      'imageFile' : imageFile ? 'filled' : 'notFilled',
    };
    setFieldStatus({
      ...isFormFilled
    });   
  }
          
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if(projectCategory !== '' && projectTitle !== '' && imageCategory !== ''
         && imageTitle !== '' && imageFile !== '') {      
      const formData = new FormData();
      formData.append('projectCategory', projectCategory);
      formData.append('projectTitle', projectTitle);
      formData.append('imageCategory', imageCategory);
      formData.append('imageTitle', imageTitle);
      formData.append('url', url);
      formData.append('imageFile', imageFile);
      formData.append('imageName', imageName);

      await axios.post('https://localhost:44328/api/ProjectsDbs', formData)      
      .then(response => {
        if(response.status === 201) {         
          setStatusMessage("Project successfully added!");
          setStatusDivDisappear(false)
          setIsProjectAdded(true);
          setTimeout(()=> {
            setTimeout(() => {
              clearFormFields();
            });            
            setStatusDivDisappear(true);
          },3500);
      }})
      .catch(error => {
        setStatusDivDisappear(false)
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

  const clearFormFields = () => {
      setProjectData(initialProjectData);
      formRef.current?.reset();
      setPreviewUrl('default.jpg');
      setStatusDivDisappear(false);
      setStatusMessage('');
      setIsProjectAdded(false);
  }
  
  useEffect(() => {
    if(projectCategory !== '' && projectTitle !== '' && imageCategory !== ''
         && imageTitle !== '' && imageFile !== '') {
          setStatusDivDisappear(true)
         }
  }, [projectCategory, projectTitle, imageCategory, imageTitle, imageFile]);

  useEffect(() => {
    setFieldStatus({
      'projectCategory': '',
      'projectTitle' : '',
      'imageCategory' : '',
      'imageTitle' : '',
      'imageFile' : '',
    }); 
  },[]);

  return(
    <div className='formContainerDivAdd'>      
      <form className='formStyleAdd'
            onSubmit={handleFormSubmit}
            ref={formRef}
      >        
        <label htmlFor='projectCategory'> Chose project category: </label><br/>
        <div className={` inputStyleAdd ${fieldStatus.projectCategory === 'filled' ? 'selectStyleAdd' : ''}
                         ${fieldStatus.projectCategory === 'notFilled' ? 'inputEmptyAdd' : ''}  `}
        >
          <select className='inputUnset'
                id='projectCategory'
                name='projectCategory'                
                onChange={handleProjectData}
                defaultValue=''
          >          
            <option hidden value=''> Select project category </option>
            <option value='interior-design'> Interior Design </option>
            <option value='academic-projects'> Academic Projects</option> 
            <option value='competitions-projects'> Competition Projects</option>
          </select>
        </div>
      
        <label htmlFor='projectTitle'> Project Title: </label> <br/>
        <div className={` inputStyleAdd ${fieldStatus.imageTitle === 'filled' ? 'selectStyleAdd' : ''}`}>      
          <input className='inputUnset'
                type='text'
                id={`${fieldStatus.projectTitle === 'notFilled' ? 'inputIdForStyle' : 'projectTitle'}`}
                name='projectTitle'
                value={projectData.projectProperties.projectTitle}
                placeholder ='Enter project title'                
                onChange={handleProjectData}               
          />
        </div>       
        
        <label htmlFor='imageCategory'> Chose image category: </label><br/>
        <div className={` inputStyleAdd ${fieldStatus.imageCategory === 'filled' ? 'selectStyleAdd' : ''}
                         ${fieldStatus.imageCategory === 'notFilled' ? 'inputEmptyAdd' : ''}  `}
        >
          <select className='inputUnset'
                id='imageCategory'
                name='imageCategory'
                onChange={handleProjectData}
                defaultValue={projectData.projectProperties.imageCategory}
          >          
            <option hidden value=''> Select image category </option>
            <option value='Cover Photo'> Cover Photo </option>
            <option value='Project Content'> Project Content </option>
          </select>
          </div>      
      
        <label htmlFor='imageTitle'> Image Title: </label><br/>
        <div className={` inputStyleAdd ${fieldStatus.imageTitle === 'filled' ? 'selectStyleAdd' : ''}`}>        
          <input className='inputUnset'
                type='text'
                id={`${fieldStatus.imageTitle === 'notFilled' ? 'inputIdForStyle' : 'imageTitle'}`}
                name='imageTitle'
                value={projectData.projectProperties.imageTitle}
                placeholder='Enter image title'                
                onChange={handleProjectData}               
          />
        </div>        
        
        <input className= {`inputUnset ${fieldStatus.imageFile === 'notFilled' ? 'inputEmptyAdd' : ''}
                            ${fieldStatus.imageFile === 'filled' ? 'selectStyleAdd' : ''}`}
              type='file'                
              onChange={handleImagePreviewAndImageFile}
        />
        
        <input className='inputStyleAdd submitButtonAdd'
              style={{backgroundColor: 'lightgray', color: 'black'}}
              value='SUBMIT'
              type='submit'
        /> 

        {
          statusMessage.length > 0 
          ? <div className={`statusMessageDivAdd ${isProjectAdded ? 'projectAdded' : ''}
                             ${statusDivDisappear ? 'statusDiVDisplayNone' : ''}`}
            > 
                {statusMessage} 
            </div> 
          : null
        } 

      </form >     
      <div className='imgContainerDivAdd'>
        <img className='imgStyleAdd' alt='preview' src={previewUrl} />
      </div>
    </div>
  );
}
export default AddProject;