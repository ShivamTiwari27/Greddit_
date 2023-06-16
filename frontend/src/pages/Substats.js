import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ModNavbar from "../components/ModNavbar";
import { isLoggedIn } from "../components/LoginChecker";

export default function Substats() {
    isLoggedIn();

    const navigator = useNavigate();
    const { subname } = useParams();
    let d = localStorage.getItem('user');

    const [isMod, setIsMod] = useState(false);
    const [stats, setStats] = useState([]);

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


    const getStats = () => {
        axios({
            method: "post",
            withCredentials: true,
            url: "http://localhost:4000/getStats",
        })
            .then(res => {
                console.log(res.data);
                setStats(res.data);
            })
    }


    useEffect(() => {
        checkifMod();
        getStats();
    }, []);


    const joined = stats.filter(item => item.action === "joined" && item.subname === subname);

    const posted = stats.filter(item => item.action === "posted" && item.subname === subname);

    const visited = stats.filter(item => item.action === "visited" && item.subname === subname);

    const report = stats.filter(item => item.action === "reported" && item.subname === subname);
    const deleted = stats.filter(item => item.action === "deleted" && item.subname === subname);

    console.log(joined);
    console.log(posted);
    console.log(visited);
    console.log(report);
    console.log(deleted);
    const postsByDate = {}
    posted.forEach((post) => {
        const date = new Date(post.date).toDateString()
        if (date in postsByDate) {
            postsByDate[date] += 1
        } else {
            postsByDate[date] = 1
        }
    })

    // Create rows for each date with post count
    const rows = Object.keys(postsByDate).map((date) => (
        <tr key={date} className="border-b border-gray-300 ml-5">
            <td className="px-4 py-2">{postsByDate[date]} posts</td>
            <td className="px-4 py-2">{date}</td>
        </tr>
    ))

    const visitsByDate = {}
    visited.forEach((post) => {
        const date = new Date(post.date).toDateString()
        if (date in visitsByDate) {
            visitsByDate[date] += 1
        } else {
            visitsByDate[date] = 1
        }
    })
    const rows2 = Object.keys(visitsByDate).map((date) => (
        <tr key={date} className="border-b border-gray-300 ml-5">
            <td className="px-4 py-2">{visitsByDate[date]} Visits</td>
            <td className="px-4 py-2">{date}</td>
        </tr>
    ))
    let growth = []
    let count = 0
    for (let i = 0; i < joined.length; i++) {
        count += 1
        growth.push({ count: count, date: joined[i].date })
    }


    let statss = stats;

    return (
        <>
            {
                isMod ?
                    <div>
                        <ModNavbar />

                        <div className="flex justify-center">

                            <table className="table-auto border border-collapse border-gray-400 ml-3">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Count</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {growth.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-300 ml-5">
                                            <td className="px-4 py-2">{item.count}</td>
                                            <td className="px-4 py-2">{new Date(item.date).toDateString()}</td>
                                            <td className="px-4 py-2">{index > 0 ? item.count - growth[index - 1].count : 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br />


                            <table className="table-auto border border-collapse border-gray-400 ml-5">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Action</th>
                                        <th className="px-4 py-2 text-left">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                            <br />


                            <table className="table-auto border border-collapse border-gray-400 ml-5">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Action</th>
                                        <th className="px-4 py-2 text-left">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows2}
                                </tbody>
                            </table>
                            <br />

                            <table className="table-auto border border-collapse border-gray-400 ml-5">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Reports</th>
                                        <th className="px-4 py-2 text-left">Removes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2">{report.length}</td>
                                        <td className="px-4 py-2">{deleted.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                        </div>
                    </div>
                    :
                    <div>
                        <h1></h1>
                    </div>
            }
        </>
    )
}
