import { Switch, useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { GET_ME, QUERY_USER } from '../utils/queries';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : GET_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Switch to="/profile" />;
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
    <>
      <h2 className="bg-dark text-secondary p-3 display-inline-block">
        Viewing {userParam ? `${user.username}'s` : 'your'} profile.
      </h2>
    </>
  )
}

export default Profile;