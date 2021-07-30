import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExperience } from '../../store/action/profile';
import Moment from 'react-moment';

const Experience = () => {

    const dispatch = useDispatch();
    const experiencesArray = useSelector( state => state.profile.profile.experience );

    const expMap =  experiencesArray.map(experience => (
        <tr key={experience._id}>
            <td>{ experience.company }</td>
            <td className="hide-sm">{ experience.title }</td>
            <td>
                <Moment format='YYYY/MM/DD'>{ experience.from }</Moment> - {' '}
                { experience.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{ experience.to }</Moment>) }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => dispatch(deleteExperience(experience._id))}>Delete</button>
            </td>
        </tr>
    ))

    return(
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{expMap}</tbody>
            </table>
        </Fragment>
    )
}


export default Experience;