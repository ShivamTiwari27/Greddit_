import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ModNavbar from "../components/ModNavbar";
import { isLoggedIn } from "../components/LoginChecker";

export default function Subreports() {

    isLoggedIn();
    const navigator = useNavigate();
    const { subname } = useParams();
    let d = localStorage.getItem('user');

    const [isMod, setIsMod] = useState(false);

    const [reports, setReports] = useState([]);

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


    const deleteStatus = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
                action: "deleted"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }
    const getReports = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/getReports",
        })
            .then(res => {
                console.log(res);
                setReports(res.data);
            })
    }


    useEffect(() => {
        checkifMod();
        getReports();
    }, []);


    let reportss = reports;

    return (
        <>
            {isMod && (
                <div>
                    <ModNavbar />
                    <h1>Reports</h1>
                    {reports.map((reports) => {
                        return (
                            <div>
                                {reports.status !== "resolved" ? (
                                    <div>
                                        {reports.reported} was reported by {reports.reporter} for{" "}
                                        {reports.reason} on{" "}
                                        {new Date(reports.date).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}{" "}
                                        for the following post: {reports.text}
                                        <br />
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                let confirmed = false;

                                                const modal = window.confirm("Are you sure you want to ban this user?");
                                                if (modal) {
                                                    confirmed = true;
                                                }

                                                if (confirmed) {
                                                    axios({
                                                        method: "post",
                                                        data: {
                                                            subname: reports.subname,
                                                            postid: reports.postid,
                                                            uid: reports._id,
                                                            reporter: reports.reporter,
                                                            reported: reports.reported,
                                                        },
                                                        withCredentials: true,
                                                        url: "http://localhost:4000/banUser",
                                                    }).then((res) => {
                                                        console.log(res);
                                                        getReports();
                                                    });
                                                }
                                            }}
                                        >
                                            Ban User
                                        </button>


                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                axios({
                                                    method: "post",
                                                    data: {
                                                        postid: reports.postid,
                                                        uid: reports._id,
                                                        reporter: reports.reporter,
                                                        reported: reports.reported,
                                                    },
                                                    withCredentials: true,
                                                    url: "http://localhost:4000/removePost",
                                                }).then((res) => {
                                                    console.log(res);
                                                    deleteStatus();
                                                    getReports();
                                                });
                                            }}
                                        >
                                            Remove
                                        </button>

                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                axios({
                                                    method: "post",
                                                    data: {
                                                        postid: reports.postid,
                                                        uid: reports._id,
                                                        reporter: reports.reporter,
                                                        reported: reports.reported,
                                                    },
                                                    withCredentials: true,
                                                    url: "http://localhost:4000/ignoreReport",
                                                }).then((res) => {
                                                    console.log(res);
                                                    getReports();
                                                });
                                            }}
                                        >
                                            Ignore
                                        </button>
                                        <br />
                                        <br />
                                    </div>
                                ) : (
                                    <div>
                                        <h1></h1>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}



