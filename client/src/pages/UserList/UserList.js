import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USERS, QUERY_USER, GET_ME } from '../../utils/queries';
import "./userList.css";

const UserList = () => {
    const { username: userParam } = useParams();
    const { data: users } = useQuery(QUERY_USERS);
    const { loading, data } = useQuery(userParam ? QUERY_USER : GET_ME, {
        variables: { username: userParam }
    });

    const allUsers = users?.users || [];
    const user = data?.me || data?.user || {};
    console.log(allUsers)

    if (!user.friends || !user.friends.length) {
        return <p className="friend-container">{user.username}, make some friends!</p>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <section className='friends_container'>
                <div className='friend-container'>
                    <h5 className='friend_h5'>
                        {user.username}'s  {user.friendCount === 1 ? 'friend' : 'friends'}
                    </h5>
                    {user.friends.map(friend => (
                        <li className="profile-link" key={friend._id}>
                            <Link to={`/profile/${friend.username}`} className="profile-link">{friend.username}</Link>
                        </li>
                    ))}
                </div>
                <div>
                    {allUsers.map(users => (
                        <div>
                            <Link
                                to={`/profile/${users.username}`}
                                style={{ fontWeight: 700 }}
                            >
                                {users.username}
                            </Link>{' '}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default UserList;