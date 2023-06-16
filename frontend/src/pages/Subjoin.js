import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ModNavbar from "../components/ModNavbar";
import { isLoggedIn } from "../components/LoginChecker";

export default function Subjoin() {
    isLoggedIn();

    const navigator = useNavigate();
    const { subname } = useParams();
    let d = localStorage.getItem('user');

    const [isMod, setIsMod] = useState(false);

    const [request, setRequest] = useState([]);
    const [returning, setReturning] = useState([]);

    const [staterefresh, setStaterefresh] = useState(false);

    const checkifMod = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/checkifMod",
        })
            .then(res => {
                console.log(res);
                if (res.data === false) {
                    navigator("..");
                }
                setIsMod(true);
            })
    }

    const getRequest = () => {
        axios({
            method: "post",
            data: {
                sub: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/returnRequest",
        })
            .then(res => {
                console.log(res);
                setRequest(res.data);
            })
    }

    const getReturning = () => {
        axios({
            method: "post",
            data: {
                sub: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/returning",
        })
            .then(res => {
                console.log(res);
                setReturning(res.data);
            })
    }


    useEffect(() => {
        checkifMod();
        getRequest();
        getReturning();
    }, []);


    let requestss = request;
    let returnss = returning;
    return (
        <div>
            {isMod ? (
                <div>
                    <ModNavbar />
                    <div>
                        {requestss.map((request) => (
                            <>
                                <div
                                    key={request}
                                    className="block my-2 p-2 border border-gray-600 rounded-lg w-4/12 bg-amber-100 text-black"
                                >
                                    {request}
                                    {
                                        returnss.includes(request) ?
                                            (
                                                <p>Returning User</p>
                                            )
                                            :
                                            (
                                                <></>
                                            )
                                    }
                                </div>

                                <button className="ml-3 w-20 h-10 rounded-full bg-green-600"
                                    onClick={
                                        () => {
                                            console.log("Accepted Req");
                                            axios({
                                                method: "post",
                                                data: {
                                                    sub: subname,
                                                    user: request,
                                                },
                                                withCredentials: true,
                                                url: "http://localhost:4000/acceptRequest",
                                            })
                                                .then(res => {
                                                    if (res != null) {
                                                        console.log(res);
                                                    }
                                                    getRequest();
                                                })
                                        }
                                    }
                                >
                                    Accept
                                </button>

                                <button className="ml-3 w-20 h-10 rounded-full bg-red-500"
                                    onClick={
                                        () => {
                                            console.log("Accepted Req");
                                            axios({
                                                method: "post",
                                                data: {
                                                    sub: subname,
                                                    user: { request },
                                                },
                                                withCredentials: true,
                                                url: "http://localhost:4000/declineRequest",
                                            })
                                                .then(res => {
                                                    if (res != null) {
                                                        console.log(res);
                                                    }
                                                    getRequest();
                                                })
                                        }
                                    }
                                >
                                    Reject
                                </button>
                            </>


                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h1></h1>
                </div>
            )}
        </div>
    );
}

