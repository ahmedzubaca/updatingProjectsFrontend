import React, { useEffect, useState } from 'react';
import useMountedState  from '../../utils/use-mounted-state';
import axios from 'axios';
import { IProjectsFromDb } from '../../utils/Interfaces';
import './ListOfProjects.css';

interface IGroupedProjects {
  item1: string;
  item2: {
    item1: string;
    item2: IProjectsFromDb[]
  }[]
}

const ListOfProjects = (props: any) => {

  const [groupedProjects, setGroupedProjects] = useState<IGroupedProjects[]>();   
  const isMounted = useMountedState();  

  const fetchImgData = async () => {
    await axios.get('https://localhost:44328/api/ProjectsDbs')    
    .then(response => {
      if(isMounted()) {
        setGroupedProjects(response.data);
      }           
    });      
  };
  
  useEffect(() => {
    fetchImgData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps  

  return(
    <div>           
       { 
        groupedProjects ? groupedProjects.map((listByCategory, i) => {
          return(
            <div key={i}> 
              <span>
                {
                  listByCategory.item1.replace('-', ' ').toUpperCase()
                }
              </span>
              <div className='projectCategoryContainerDivList'>
              {            
                listByCategory.item2.map((listByTitle, i) => {
                  return(
                    <div key={i} >
                      <span className='projectTitleSpanList'>{listByTitle.item1}</span>
                      {
                        listByTitle.item2.map(project => {
                          return(                           
                            <div key={project.id}>
                              <input type='radio'
                                    name='project'                                                        
                                    value={project.id}
                                    onChange={() => props.handleSelection(project)}                                    
                              />
                              <label> 
                                <span className='projectPropertySpanList'> Image id: </span> {project.id},                                  
                                <span className='projectPropertySpanList'> Image Category: </span> {project.imageCategory},
                                <span className='projectPropertySpanList'> Image Title: </span>{project.imageTitle} <br/>
                              </label>
                            </div>
                          );
                        })
                      }                      
                    </div>
                  );      
                })
              }
              </div>
            </div>              
          );                       
        })
        : 'Need to load projects'
       }      
    </div>
  );
}
export default ListOfProjects