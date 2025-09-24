import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Register from './components/screens/Register';
import CreatePost from './components/screens/CreatePost';

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/create-post" element={<CreatePost/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
