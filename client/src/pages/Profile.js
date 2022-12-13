import React, { useState, useEffect } from 'react';

import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';

const Profile = () => {
    const [userData, setUserData] = useState({});

    const userDataLength = Object.keys(userData).length;

    useEffect(() => {
        const getUserData = async () => {
          try {
            const token = Auth.loggedIn() ? Auth.getToken() : null;
    
            if (!token) {
              return false;
            }
    
            const response = await GET_ME(token);
    
            if (!response.ok) {
              throw new Error('something went wrong!');
            }
    
            const user = await response.json();
            setUserData(user);
          } catch (err) {
            console.error(err);
          }
        };

        getUserData();
  }, [userDataLength]);

   // if data isn't here yet, say so
   if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
    <h1>user Profile data here</h1>
    </>
  )
}

export default Profile;