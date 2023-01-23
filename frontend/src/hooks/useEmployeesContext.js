// React
import { useContext} from "react";

// Global State
import { EmployeesContext } from "../context/EmployeeContext";

// Employees state hook
export const useEmployeesContext = () => {
    const context = useContext(EmployeesContext);

    if(!context){
        throw Error('useEmployeesContext must be used inside EmployeesContextProvider');
    }
    return context;
}
