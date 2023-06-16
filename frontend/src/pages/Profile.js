import { useEffect, useState } from "react";
import axios from 'axios';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn } from "../components/LoginChecker";

// import {useNavigate} from "react-router";

export default function Profile() {
    isLoggedIn();

    const [id, setId] = useState();
    // let ID = "";
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const [contact, setContact] = useState("");


    const [newFname, setNewFname] = useState("");
    const [newLname, setNewLname] = useState("");
    const [newContact, setNewContact] = useState("");

    const [password, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [isOpened, setIsOpened] = useState(false);

    const [isResetPass, setIsResetPass] = useState(false);


    const popUpStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            backgroundColor: 'transparent',
            border: 'none',
        }
    };

    // const navigate = useNavigate();

    let d = localStorage.getItem('user');
    console.log(d);

    const getInfo = () => {
        if (id === "") return;
        axios({
            method: "post",
            data: {
                id: d
            },
            withCredentials: true,
            url: "http://localhost:4000/userInfo",

        })
            .then(res => {
                if (res != null) {
                    setFname(res.data.fname);
                    setLname(res.data.lname);
                    setContact(res.data.contact);
                    // setPassword(res.data.password);
                }
            })

    }

    const setInfo = () => {
        if (isResetPass) {
            axios({
                method: "post",
                data: {
                    id: d,
                    fname: newFname,
                    lname: newLname,
                    contact: newContact,
                    password: password,
                    newPassword: newPassword,
                },
                withCredentials: true,
                url: "http://localhost:4000/setInfo",
            })
                .then(res => {
                    if (res != null) {
                        console.log(res);
                    }
                })
        }
        else {
            console.log("id: " + id + " fname: " + newFname + " lname: " + newLname + " contact: " + newContact);
            axios({
                method: "post",
                data: {
                    id: d,
                    fname: newFname,
                    lname: newLname,
                    contact: newContact,
                },
                withCredentials: true,
                url: "http://localhost:4000/setInfo",
            })
                .then(res => {
                    if (res != null) {
                        console.log(res);
                    }
                })
        }
    }

    const getFollowers = () => {
        axios({
            method: "post",
            data: {
                id: d
            },
            withCredentials: true,
            url: "http://localhost:4000/getFollowers",
        })
            .then(res => {
                if (res != null) {
                    setFollowers(res.data);
                }
                console.log(followers[0] + '\n');
                console.log(followers.length);

            })
    }

    const getFollowing = () => {
        axios({
            method: "post",
            data: {
                id: d
            },
            withCredentials: true,
            url: "http://localhost:4000/getFollowing",
        })
            .then(res => {
                if (res != null) {
                    setFollowing(res.data);
                }
                console.log(following[0] + '\n');
                console.log(following.length);

            })
    }

    const showOldPassword = () => {
        setIsOldPasswordVisible(!isOldPasswordVisible);
    }

    const showNewPassword = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    }

    const resetPassword = () => {
        setIsResetPass(true);
    }

    const editClicked = () => {
        setIsOpened(true);
        setNewFname(fname);
        setNewLname(lname);
        setNewContact(contact);
        setIsResetPass(false);
        setNewPassword("");
        setOldPassword("");
    }



    useEffect(() => {
        getInfo();
    }, []);

    let followingList = following.map((follow, index) => {
        return (
            <>
                <div className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-amber-100 text-black">
                    {follow}

                    <button className="ml-3 w-10 h-10 rounded-full bg-red-600"
                        onClick={
                            () => {
                                console.log("unfollow called");
                                axios({
                                    method: "post",
                                    data: {
                                        id: d,
                                        followingName: follow
                                    },
                                    withCredentials: true,
                                    url: "http://localhost:4000/removeFollowing",
                                })
                                    .then(res => {

                                        if (res != null) {
                                            console.log(res);
                                        }
                                    })
                            }
                        }
                    >-</button>

                </div>
            </>
        )
    });

    let followerList = followers.map((follower, index) => {
        return (
            <>
                <div className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-amber-100 text-black">
                    {follower}
                    <button className="ml-3 w-10 h-10 rounded-full bg-red-600"
                        onClick={
                            () => {
                                console.log("unfollow called");
                                axios({
                                    method: "post",
                                    data: {
                                        id: d,
                                        followerName: follower
                                    },
                                    withCredentials: true,
                                    url: "http://localhost:4000/removeFollower",
                                })
                                    .then(res => {

                                        if (res != null) {
                                            console.log(res);
                                        }
                                    })
                            }
                        }
                    >-</button>
                </div>

            </>
        )
    });

    useEffect(() => {
        getFollowers();
    }, []);
    useEffect(() => {
        getFollowing();
    }, []);


    return (
        <div>
            {
                d ?

                    <div>
                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css"
                            integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc"
                            crossOrigin="anonymous">
                        </link>

                        <br></br>
                        <br></br>
                        <div className="flex">
                            <form className="w-full max-w-sm">
                                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                                    <h1 className="text-lg font-medium text-white">Followers</h1>
                                    {followerList}
                                </div>
                            </form>
                            <form className="ml-3 w-full max-w-sm">
                                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                                    <h1 className="text-lg font-medium text-white">Following</h1>
                                    {followingList}
                                </div>
                            </form>
                        </div>
                        <br></br>

                        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                            <h1 className="text-lg font-medium text-white">First Name</h1>
                            <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={fname} onChange={event => setFname(event.target.value)}
                                disabled={true}
                            />

                            <h1 className="text-lg font-medium text-white">Last Name</h1>
                            <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={lname} onChange={event => setLname(event.target.value)}
                                disabled={true}
                            />

                            <h1 className="text-lg font-medium text-white">Contact</h1>
                            <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={contact} onChange={event => setContact(event.target.value)}
                                disabled={true}
                            />
                            {/*<br></br>*/}
                            <button className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-blue-500 text-black mr-auto" onClick={editClicked}>Edit</button>
                        </div>

                        <ReactModal
                            isOpen={isOpened}
                            onRequestClose={() => setIsOpened(false)}
                            style={popUpStyle}>
                            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white">First Name</h1>
                                <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={newFname}
                                    onChange={event => setNewFname(event.target.value)} />

                                <h1 className="text-lg font-medium text-white">Last Name</h1>
                                <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={newLname}
                                    onChange={event => setNewLname(event.target.value)} />

                                <h1 className="text-lg font-medium text-white">Contact</h1>
                                <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={newContact}
                                    onChange={event => setNewContact(event.target.value)} />



                                <br />
                                {
                                    !isResetPass ?
                                        <button
                                            className="block my-3 p-2 border border-gray-600 rounded-lg w-50 bg-blue-500 text-black mr-auto"
                                            onClick={resetPassword}
                                        >
                                            Reset Password Too</button>
                                        :
                                        <></>
                                }

                                {
                                    isResetPass ?
                                        <>
                                            <h1 className="text-lg font-medium text-white">Old Password</h1>
                                            <input className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white" value={password}
                                                type={isOldPasswordVisible ? "text" : "password"}
                                                onChange={event => setOldPassword(event.target.value)} />
                                            <FontAwesomeIcon icon={faEye}
                                                className="text-white"
                                                onClick={showOldPassword}

                                            />


                                            <h1 className="text-lg font-medium text-white">New Password</h1>
                                            <input
                                                className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                                                value={newPassword}
                                                type={isNewPasswordVisible ? "text" : "password"}
                                                onChange={event => setNewPassword(event.target.value)} />
                                            <FontAwesomeIcon icon={faEye}
                                                className="text-white"
                                                onClick={showNewPassword}

                                            />
                                        </>
                                        :
                                        <></>
                                }
                                <button className="block my-3 p-2 border border-gray-600 rounded-lg w-50 bg-blue-500 text-black mr-auto"
                                    onClick={setInfo}>Update</button>

                            </div>
                        </ReactModal>

                    </div>



                    :
                    <div>
                        <h1>Notloggeddin</h1>
                    </div>
            }
        </div>
    )
}