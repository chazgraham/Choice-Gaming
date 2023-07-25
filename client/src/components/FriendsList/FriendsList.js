import React from 'react';
import { Link } from 'react-router-dom';

const FriendList = ({ friendCount, username, friends }) => {
  if (!friends || !friends.length) {
    return <p className="friend-container">{username}, make some friends!</p>;
  }

  return (
    <div className='friend-container'>
      <h5 className='friend_h5'>
        {username}'s  {friendCount === 1 ? 'friend' : 'friends'}
      </h5>
      {friends.map(friend => (
        <li className="profile-link" key={friend._id}>
          <Link to={`/profile/${friend.username}`} className="profile-link">{friend.username}</Link>
        </li>
      ))}
    </div>
  );
};

export default FriendList;