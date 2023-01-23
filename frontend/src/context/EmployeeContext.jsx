// React
import {createContext, useReducer} from 'react';

// Employee Context
export const EmployeesContext = createContext();

/**
 * Employee state Reducer
 * @param {Object} state Employess state
 * @param {Object} action Type and Payload/id
 * @returns 
 */
export const employeesReducer = (state, action) =>{
    switch(action.type){
        case 'SET_EMPLOYEES':
            return {
                employees: action.payload
            }
        case 'CREATE_EMPLOYEE':
            return {
                employees: [...state.employees,action.payload]
            }
        case 'DELETE_EMPLOYEE':
            return {
                employees: [...state.employees.filter(employee => employee._id !== action.id)] 
            }
        case 'UPDATE_EMPLOYEE':
            const editedEmployeeList = state.employees.map( (employee)=> {
                if(employee._id === action.id){
                    const updatedEmployee = {
                        ...action.payload
                    };
                    return updatedEmployee;
                }
                return employee;
            });
            return {
                employees: editedEmployeeList
            }
        default:
            return state
    }
}

export const EmployeesContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(employeesReducer, {
        employees: null
    });
    
    return (
        <EmployeesContext.Provider value={{...state, dispatch}}>
            {children}
        </EmployeesContext.Provider>
    )
}
