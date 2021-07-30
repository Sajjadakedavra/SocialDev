import React from 'react';
import Moment from 'react-moment';

const ProfileExperience = ({experience}) => {

    const { company, title, location, current, to, from, description } = experience;

    return (
        <div className='m-1'>
            <h3 className='text-dark'>{company}</h3>
            <p>
                <Moment format='YYYY/MM/DD'>{from}</Moment> - { to ?  <Moment format='YYYY/MM/DD'>{to}</Moment> : ' Now'}
            </p>
            <p>
                <strong>Position: </strong>{title}
            </p>
            <p>
                <strong>Description: </strong>{description}
            </p>
        </div>
    )
}


export default ProfileExperience;