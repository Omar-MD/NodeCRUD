// React
import { useState } from "react";

// Services
import EmployeeService from "../../services/employee";

// Global State
import { useEmployeesContext } from "../../hooks/useEmployeesContext";


/**
 * Employee Edit component used in creating new Employee or updating existing employees.
 * @param {Object} info Employee info Object
 * @param {String} task Type of task UPDATE/CREATE
 * @returns EmployeeEdit component
 */
const EmployeeEdit = ({info, task})=>{

    // Update global state
    const {dispatch} = useEmployeesContext();

    // Form local state
    const [employee, setEmployee] = useState(info);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    // Controlled state change
    const handleChange = (event)=>{
        let {name, value} = event.target;
       
        if(name === 'name' || name === 'description'){
            setEmployee((prevState)=> {
                const newEmployee = {...prevState};
                newEmployee.skill[name] = value;
                return newEmployee;
            })
            return;
        }else if(name === 'active'){
            setEmployee((prevState)=> ({
                ...prevState,
                [name] : !employee.active
            }));
            return;
        }else {
            setEmployee((prevState)=> ({
                ...prevState,
                [name] : value
            }));
        }
    }

    // CREATE, UPDATE EMPLOYEE
    const handleSubmit = async (event)=> {
        event.preventDefault();
        setError(null)
        // setEmptyFields([])
        setSuccess(null)
        
        if(task === 'CREATE'){
            const response = await EmployeeService.create(JSON.stringify(employee));

            if(response.status !== 201){
                
                setError(response.data.error)
                if(response.status === 400 || response.status === 409){
                    // bad request
                    setEmptyFields(response.data.emptyFields)
                }
            }else{
                dispatch({type: 'CREATE_EMPLOYEE', payload: {
                    ...employee,
                    _id: response.data.id
                }});
                setSuccess(true)
                setError(null);
                setEmptyFields([]);
            }
        }else if(task === 'UPDATE'){
            const response = await EmployeeService.update(employee._id, JSON.stringify(employee));
    
            if(response.status !== 200){
                setError(response.data.error)
                if(response.status === 400 || response.status === 409){
                    // bad request
                    setEmptyFields(response.data.emptyFields)
                }
            }else{
                dispatch({type: 'UPDATE_EMPLOYEE', payload: {...response.data.employee}, id: response.data.employee._id});
                setSuccess(true)
                setError(null);
                setEmptyFields([]);
            }
        }
    }

    // Format date for HTML 'yyy-mm-dd'
    const formatDate = (d) => {
        let date = new Date(d);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();

        if(day < 10){
            day = '0'+day;
        }
        if(month < 10){
            month = '0'+month;
        }
        return (year +'-'+ month +'-'+ day)
    }
   
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input 
                    type="text"
                    onChange={handleChange}
                    name="firstName"
                    id="firstName"
                    value={employee.firstName}
                    placeholder="Enter first name"
                    className={emptyFields.includes('firstName') ?'error':''}
                />
            
                <label htmlFor="lastName">Last Name</label>
                <input  
                    type="text"
                    onChange={handleChange}
                    name="lastName"
                    id="lastName"
                    value={employee.lastName}
                    placeholder="Enter last name"
                    className={emptyFields.includes('lastName')?'error':''}
                />
                
                <label htmlFor="DOB">DOB</label>
                <input  
                    type="date"
                    onChange={handleChange}
                    name="DOB"
                    id="DOB"
                    value={formatDate(employee.DOB)}
                    className={emptyFields.includes('DOB')?'error':''}
                />
                
                <label htmlFor="age">Age</label> 
                <input 
                    type="number"
                    onChange={handleChange}
                    name="age"
                    id="age"
                    value={employee.age}
                    className={emptyFields.includes('age')?'error':''}
                />
                    
                <label htmlFor="email">Email</label>
                <input 
                    type="email"
                    onChange={handleChange}
                    name="email"
                    id="email"
                    value={employee.email}
                    placeholder="Enter email"
                    className={emptyFields.includes('email')?'error':''}
                />
                    
                <label htmlFor="active">Active</label>  
                <input 
                    name="active"
                    type="checkbox"
                    id="active"
                    checked ={employee.active}
                    onChange={handleChange}
                    className={emptyFields.includes('firstName') ?'error':''}
                />
                    
                <label htmlFor="skillName">Skill Name</label> 
                <input 
                    type="text"
                    onChange={handleChange}
                    name="name"
                    id="skillName"
                    value={employee.skill.name}
                    placeholder="Enter Skill name"
                    className={emptyFields.includes('name')?'error':''}
                />

                <label htmlFor="description">Skill Description</label> 
                <input 
                    type="text"
                    onChange={handleChange}
                    name="description"
                    id="description"
                    value={employee.skill.description}
                    placeholder="Enter Skill level"
                    className={emptyFields.includes('description')?'error':''}
                />
                
                {task==='UPDATE' 
                    ? (<span className="material-icons-outlined" onClick={handleSubmit}>save</span>)
                    : (<button type="submit" className="btn" onClick={handleSubmit}>submit</button>)
                }
                {error && <div className='error'>{error}</div>}
                {success && <div className="success">{task==="UPDATE"?("Employee update Successful"):("Employee creation Successful")}</div>}
            </form>
        </div>
    );
}

export default EmployeeEdit;