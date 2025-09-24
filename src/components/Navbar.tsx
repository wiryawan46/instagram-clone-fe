import React from 'react';
import {Link} from "react-router-dom";


const Navbar: React.FC = () => {
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to="/" className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/create-post">Create Post</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;