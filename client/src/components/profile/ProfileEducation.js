import React from 'react';
import Moment from 'react-moment';

const ProfileEducation = ({education}) => {

    const { school, degree, fieldofstudy, current, to, from, description } = education;

    return (
        <div className='m-1'>
            <h3 className='text-dark'>{school}</h3>
            <p>
                <Moment format='YYYY/MM/DD'>{from}</Moment> - { to ?  <Moment format='YYYY/MM/DD'>{to}</Moment> : ' Now'}
            </p>
            <p>
                <strong>Degree: </strong>{degree}
            </p>
            <p>
                <strong>Field of study: </strong>{fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong>{description}
            </p>
        </div>
    )
}


export default ProfileEducation;