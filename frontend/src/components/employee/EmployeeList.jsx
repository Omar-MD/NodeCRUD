// React 
import { useEffect, useState } from "react";

// Services
import EmployeeService from "../../services/employee";

// Global State
import { useEmployeesContext } from "../../hooks/useEmployeesContext"; 

// Components
import Employee from "./Employee";

/**
 * List of Employees. Fetches employees from DB, each of component Employee.
 * @returns EmployeeList component.
 */
const EmployeeList = () => {

    const {employees, dispatch } = useEmployeesContext();
    const [error, setError] = useState(null);

    useEffect( ()=>{

        try {
            const getEmployees = async ()=> await EmployeeService.getAll();
            getEmployees()
            .then(response => {
                if(response.status !== 200){
                    setError(response.data.error)
                }else{
                    dispatch({type: 'SET_EMPLOYEES', payload: response.data.employees})
                    setError(null);
                }
            })
        }catch(error){
            setError(error);
        }
    },[dispatch]);

    

    return (
        <article className="employee-list">
            {employees?.length
                ? (
                    <ul>
                        {employees.map( employee => 
                            <li key={employee._id}><Employee info = {employee}/></li>
                            )
                        }
                    </ul>
                ) : <p>No employees to display</p>
            
            }
            {error && <div className='error'>{error}</div>}  
        </article>
    );
}

export default EmployeeList;