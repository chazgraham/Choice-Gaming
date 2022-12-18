import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, GET_ME } from '../utils/queries';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import { ADD_FRIEND } from '../utils/mutations';



const Profile = () => {
  const [addFriend] = useMutation(ADD_FRIEND);
  const { username: userParam } = useParams();
  console.log(userParam)

  const { loading, data } = useQuery(userParam ? QUERY_USER : GET_ME, {
    variables: { username: userParam }
  });

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="profile-h2">
        <h2>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="friend-container">

        <div className="">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
