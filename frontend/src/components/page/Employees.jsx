// Global state
import { EmployeesContextProvider } from '../../context/EmployeeContext';

// Components
import PageTitle from '../PageTitle';
import EmployeeEdit from '../employee/EmployeeEdit';
import EmployeeList from '../employee/EmployeeList';

/**
 * Employee Listing main component, allows view, edit and creating new Employees to DB.
 * @returns Employees component
 */
export const Employees = ()=>{
    const intialForm = {
        firstName: '',
        lastName: '',
        DOB: new Date().toISOString().slice(0,10),
        age: 0,
        email: '',
        active: false, 
        skill: {
            name: '',
            description: ''
        },
    }

    return (
        <EmployeesContextProvider>
            <div className="employee-page">
                <PageTitle title="Employee Listing" text="Add, Edit, or View Employees"/>
                <div className='employee-listing'>
                    <EmployeeEdit info={intialForm} task="CREATE"/>
                    <EmployeeList /> 
                </div>
            </div>
        </EmployeesContextProvider>
    );
}

export default Employees;