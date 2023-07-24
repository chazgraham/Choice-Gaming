import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

function Footer() {
    const sendToTop = (location) => {
        if (window.location === location) {
            window.scrollTo(0, 0);
        } else {
            return
        }
    }

    return (
        <footer>
            <ul className='footer_ul'>
                <li>
                    <Link to='/' onClick={() => sendToTop(window.location)}>Home</Link>
                </li>
                <li>
                    <Link to='/users' onClick={() => sendToTop(window.location)}>Find Friends</Link>
                </li>
                <li>
                    {Auth.loggedIn() && (
                        <Link to='/profile' className='nav_link'><li>Profile</li></Link>
                    )}
                </li>
            </ul>
        </footer>
    )
}

export default Footer;