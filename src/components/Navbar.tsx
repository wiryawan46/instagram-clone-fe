import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {UserContext} from "../App";

const Navbar: React.FC = () => {
    const context = useContext(UserContext)
    if (!context) {
        return null // or return a loading state
    }
    const {state, dispatch} = context
    const renderList = () => {
        if (state) {
            return [
                <li key="profile"><Link to="/profile">Profile</Link></li>,
                <li key="create-post"><Link to="/create-post">Create Post</Link></li>
            ]
        } else {
            return [
                <li key="login"><Link to="/login">Login</Link></li>,
                <li key="register"><Link to="/register">Register</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? '/' : '/login'} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;