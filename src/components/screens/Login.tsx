import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import M from "materialize-css";

const Login: React.FC  = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const Login = () => {
        if (!validateEmail.test(email)) {
            M.toast({html: "Invalid email", classes:"#c62828 red darken-3"})
            return
        }
        fetch(
            "/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        ).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                } else {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    M.toast({html: data.message, classes:"#43a047 green darken-1"})
                    navigate("/")
                }
            }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue draken-1"
                onClick={() => Login()}
                >
                    Login
                </button>
                <h5>
                    <Link to="/register">Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Login