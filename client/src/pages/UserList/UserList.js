import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USERS, GET_ME } from '../../utils/queries';
import "./userList.css";

const UserList = () => {
    const { data: allUsers } = useQuery(QUERY_USERS);
    const { loading, data: meUser } = useQuery(GET_ME)

    const users = allUsers?.users || [];
    const user = meUser?.me || meUser?.user || {};
    const [searchResults, setSearchResults] = useState(users);

    const handleFormSubmit = (event) => {
        event.preventDefault();
    }

    const handleSearchChange = (e) => {
        if (!e.target.value) setSearchResults(users);

        const resultsArray = users.filter(user => user.username.includes(e.target.value))

        setSearchResults(resultsArray);
    }

    useEffect(() => {
        setSearchResults(users)
    }, [users])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <section className='friends_container'>
                <div className='friend_container'>
                    <h5 className='friend_h5'>
                        {user.friendCount === 1 ? 'Friend' : 'Friends'}
                    </h5>
                    <div className='friend-container'>
                        {user.friends.map(friend => (
                            <li className="profile-link" key={friend._id}>
                                <Link to={`/profile/${friend.username}`} className="profile-link">{friend.username}</Link>
                            </li>
                        ))}
                    </div>
                </div>
                <div className='allUsers'>
                    <h5 className='allUsers_h5'>All Users</h5>
                    <form className="user_search" onSubmit={handleFormSubmit}>
                        <input className="searchTerm" type="text" placeholder="Search" onChange={handleSearchChange}></input>
                        <button className="searchButton" type="submit"><i class="fa fa-search"></i></button>
                    </form>
                    <div className='users'>
                        {searchResults.map(users => (
                            <>
                                <Link
                                    className='user'
                                    to={`/profile/${users.username}`}
                                    style={{ fontWeight: 700 }}
                                >
                                    {users.username}
                                </Link>{' '}
                            </>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserList;