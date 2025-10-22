import React, {createContext, useContext, useEffect, useReducer} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Register from './components/screens/Register';
import CreatePost from './components/screens/CreatePost';
import {initialState, reducer} from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";

export const UserContext = createContext<{
    state: any,
    dispatch: React.Dispatch<{ type: any, payload: any }>
} | null>(null)

const Routing = () => {
    const navigate = useNavigate()
    const context = useContext(UserContext)
    useEffect(()=>{
        if(context) {
            const user = JSON.parse(localStorage.getItem("user") as string)
            if(user) {
                context.dispatch({type:"USER",payload:user})
            } else {
                navigate("/login")
            }
        }
    },[])
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/create-post" element={<CreatePost/>}/>
            <Route path="/profile/:userId" element={<UserProfile/>}/>
        </Routes>
    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <UserContext.Provider value={{state, dispatch}}>
            <BrowserRouter>
                <Navbar/>
                <Routing/>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
