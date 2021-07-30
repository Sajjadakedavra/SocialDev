import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteEducation } from '../../store/action/profile';
import Moment from 'react-moment';

const Education = () => {

    const dispatch = useDispatch();
    const educationArray = useSelector( state => state.profile.profile.education );

    const eduMap = educationArray.map(edu => (
        <tr key={edu._id}>
        <td>{ edu.school }</td>
        <td className="hide-sm">{ edu.degree }</td>
        <td>
            <Moment format='YYYY/MM/DD'>{ edu.from }</Moment> - {' '}
            { edu.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{ edu.to }</Moment>) }
        </td>
        <td>
            <button className="btn btn-danger" onClick={ () => dispatch(deleteEducation(edu._id)) }>Delete</button>
        </td>
    </tr>
    ))

    return(
        <Fragment>
        <h2 className="my-2">Education Credentials</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>School</th>
                    <th className="hide-sm">Degree</th>
                    <th className="hide-sm">Years</th>
                    <th />
                </tr>
            </thead>
            <tbody>{eduMap}</tbody>
        </table>
    </Fragment>
    )
}


export default Education;