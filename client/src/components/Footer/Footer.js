import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

import "./footer.css";

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
                <li className='footer_li'>
                    <Link to='/' onClick={() => sendToTop(window.location)} className='footer_link'>Home</Link>
                </li>
                <li className='footer_li'>
                    <Link to='/users' onClick={() => sendToTop(window.location)} className='footer_link'>Friends</Link>
                </li>
                <li className='footer_li'>
                    {Auth.loggedIn() && (
                        <Link to='/profile' className='footer_link'>Profile</Link>
                    )}
                </li>
            </ul>
            <p className='footer_p'>©2022 <a href='https://github.com/chazgraham' className='footer_link'>Chaz Graham</a> Game Seeker. All right reserved.</p>
        </footer>
    )
}

export default Footer;