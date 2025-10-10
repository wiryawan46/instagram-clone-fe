import React, {useContext} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../App";
import M from "materialize-css";

const Navbar: React.FC = () => {
    const context = useContext(UserContext)
    const navigate = useNavigate()
    if (!context) {
        return null // or return a loading state
    }
    const {state, dispatch} = context
    const renderList = () => {
        if (state) {
            return [
                <li key="profile"><Link to="/profile">Profile</Link></li>,
                <li key="create-post"><Link to="/create-post">Create Post</Link></li>,
                <li key="logout">
                    <button className="btn waves-effect waves-light red darken-1"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({type: "CLEAR", payload: null})
                                M.toast({html: "You are logout", classes:"#43a047 red darken-1"})
                                navigate("/login")
                            }}
                    >
                        Logout
                    </button>
                </li>
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