// React
import { useState } from "react";

// Global State
import { useEmployeesContext } from "../../hooks/useEmployeesContext";

// Services
import EmployeeService from "../../services/employee";

// Components
import EmployeeEdit from "./EmployeeEdit";
import EmployeeView from "./EmployeeView";

/**
 * Single Employee view/edit component
 * @param {Object} info Employee info object 
 * @returns Employee component
 */
const Employee = ({info})=>{
    // Edit or View mode
    const [editing,setEditing] = useState(false);
    const [error, setError] = useState(null);

    const {dispatch} = useEmployeesContext()

    // DELETE EMPLOYEE
    const handleDelete = async () => {
        const response = await EmployeeService.remove(info._id);

        if(response.status !== 200){
            setError(response.data.error)
        }else{
            dispatch({type: 'DELETE_EMPLOYEE', id: info._id})
            setError(null);
        }
    }

    return (
        <article>
            <hr/>
           {!editing 
                ? (<EmployeeView id={info._id}/>)
                : (<EmployeeEdit info={info} task="UPDATE"/>)
            }
            <div className="employee-edit">
                {!editing 
                    ? (<span className="material-icons-outlined" onClick={()=>setEditing(!editing)}>edit</span>)
                    : (<span className="material-icons-outlined" onClick={()=>setEditing(!editing)}>done</span>)
                }
                <span className="material-icons-outlined" onClick={handleDelete}>delete</span>
            </div>
            {error && <div className='error'>{error}</div>}
        </article>
    );
}

export default Employee
