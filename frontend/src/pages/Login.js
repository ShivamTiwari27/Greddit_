import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";

export default function Login() {
    const [LoginUsername, setLoginUsername] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerFname, setRegisterFname] = useState("");
    const [registerLname, setRegisterLname] = useState("");
    const [registerContact, setRegisterContact] = useState("");
    const [registerAge, setRegisterAge] = useState("");

    const clientId = "488005509384-2notep271o7d6bobuvrplt4ato3l36f8.apps.googleusercontent.com";

    const [color, setColor] = useState('red');
    useEffect(() => {
        if (LoginUsername === '' || LoginPassword === '') {
            setColor('red');
        }
        else setColor('green');
    });

    const [color2, setColor2] = useState('red');
    useEffect(() => {
        if (registerFname === '' || registerLname === '' || registerUsername === '' || registerPassword === '' || registerEmail === '' || registerContact === '' || registerAge === '') {
            setColor2('red');
        }
        else setColor2('green');
    });


    const navigate = useNavigate();

    const [data, setData] = useState(null);


    const register = () => {
        axios({
            method: "post",
            data: {
                username: registerUsername,
                password: registerPassword,
                fname: registerFname,
                lname: registerLname,
                email: registerEmail,
                age: registerAge,
                contact: registerContact,
            },
            withCredentials: true,
            url: "http://localhost:4000/register",
        })
            .then(res => console.log(res))
    };


    const login = () => {
        axios({
            method: "post",
            data: {
                username: LoginUsername,
                password: LoginPassword,
            },
            withCredentials: true,
            url: "http://localhost:4000/login",
        })
            .then(res => {
                localStorage.setItem('user', res.data._id);
                setData(res.data);
                console.log(res);
                if (res.data !== 'no user exists') navigate("/");

            })
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }
    const getUser = () => {
        axios({
            method: "get",
            withCredentials: true,
            url: "http://localhost:4000/user",
        })
            .then(res => {
                setData(res.data);
                console.log(res.data);
            })
    };

    const getId = () => {
        axios({
            method: "get",
            withCredentials: true,
            url: "http://localhost:4000/id",
        })
            .then(res => {
                if (res != null)
                    console.log(res)
            })
    };

    let d = localStorage.getItem('user');
    return (
        <div className="loginPage">
            {d ? (
                <div>
                <button
                  className="bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg text-white"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
                <div>
                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                        <h1 className="text-lg font-medium text-white">Login</h1>
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                            placeholder="Username"
                            onChange={event => setLoginUsername(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                            placeholder="Password"
                            onChange={event => setLoginPassword(event.target.value)}
                            type="password"
                        />
                        <button
                            style={{ backgroundColor: color }}
                            className={`block my-2 p-2 w-48 rounded-lg text-white font-medium`}
                            disabled={LoginUsername === '' || LoginPassword === ''}
                            onClick={login}
                        >
                            Submit
                        </button>
                    </div>

                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                        <h1 className="text-lg font-medium text-white">Register</h1>
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="First Name"
                            onChange={event => setRegisterFname(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Last Name"
                            onChange={event => setRegisterLname(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Age"
                            onChange={event => setRegisterAge(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Contact"
                            onChange={event => setRegisterContact(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Username"
                            onChange={event => setRegisterUsername(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Email"
                            onChange={event => setRegisterEmail(event.target.value)}
                        />
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                            placeholder="Password"
                            onChange={event => setRegisterPassword(event.target.value)}
                            type="password"
                        />
                        <button
                            style={{ backgroundColor: color2 }}
                            className={`block my-2 p-2 w-full rounded-lg bg-${registerUsername === '' ||
                                registerPassword === '' ||
                                registerFname === '' ||
                                registerLname === '' ||
                                registerAge === '' ||
                                registerContact === '' ||
                                registerEmail === ''
                                ? 'red-500'
                                : 'green-500'
                                } text-white font-medium`}

                            disabled={registerUsername === '' || registerPassword === ''
                                || registerFname === '' || registerLname === '' || registerAge === '' || registerContact === '' || registerEmail === ''}
                            onClick={register}>Submit</button>
                    </div>
                    <br />
                </div>
            )
            }

        </div>
    );
}