import React from 'react';
import { useSelector } from 'react-redux';

// function valCheck(element) {
//     if(element[0]){
//         if(element[0].msg.toString() === 'Passwords do not match'){
//             return true;
//         }
//         return false;
//     }
//     return false;
// }

const Alert = () => {

    const alerts = useSelector(state => Object.values(state.alert))
    return(
    alerts !== null && alerts.length > 0 && alerts.map(element => (
        <div key = { element.id } className = { `alert alert-${element.alertType}` }>
            {/* { element[0] ? element[0].msg : null } */}
            { element.msg }
        </div>
    ))
    )
};


export default Alert;