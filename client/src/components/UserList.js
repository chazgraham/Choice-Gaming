import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ users, username }) => {
    if (!users.length) {
        return <h3>No users Yet</h3>;
    }

    return (
        <>
            <h3>{username}</h3>
            {users &&
                users.map(users => (
                    <div key={users._id} className="card mb-3">
                        <p className="card-header">
                            <Link
                                to={`/profile/${users.username}`}
                                style={{ fontWeight: 700 }}
                                className="text-light"
                            >
                                {users.username}
                            </Link>{' '}
                        </p>
                    </div>
                ))}
        </>
    );
};

export default UserList;