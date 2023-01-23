// Global State
import { useEmployeesContext } from "../../hooks/useEmployeesContext"

/**
 * Display employee info. Fetch employee from global state.
 * @param {String} id Employee ID 
 * @returns EmployeeView component
 */
const EmployeeView = ({id}) => {
    const {employees} = useEmployeesContext();
    const employee = employees.find(e => e._id === id);

    return (
        <article>
            <h4>Employee Info</h4>
            <pre><i>First Name</i>: {employee.firstName}</pre>  
            <pre><i>Last Name</i>:  {employee.lastName}</pre>

            <pre><i>DOB</i>:        {employee.DOB.substring(0,10)}</pre>
            <pre><i>age</i>:        {employee.age}</pre> 

            <pre><i>Email</i>:      {employee.email}</pre>
            <pre><i>active</i>:     {String(employee.active)}</pre>

            <h4>Skill level</h4>
            <pre><i>Name</i>:       {employee.skill.name}</pre> 
            <p><i>Description</i>:  {employee.skill.description}</p>
        </article>
    )
}

export default EmployeeView