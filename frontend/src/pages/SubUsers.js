import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ModNavbar from "../components/ModNavbar";
import { isLoggedIn } from "../components/LoginChecker";


export default function Subusers() {
    isLoggedIn();

    const navigator = useNavigate();
    const { subname } = useParams();
    let d = localStorage.getItem('user');

    const [isMod, setIsMod] = useState(false);

    const [members, setMembers] = useState([]);
    const [banned, setBanned] = useState([]);

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

    const getMembers = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/getMembers",
        })
            .then(res => {
                console.log(res);
                setMembers(res.data);
            })
    }

    const getBanned = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/getBanned",
        })
            .then(res => {
                console.log(res);
                setBanned(res.data);
            })
    }

    useEffect(() => {
        checkifMod();
        getMembers();
        getBanned();
    }, []);


    let memberss = members;
    let bannedd = banned;

    return (
        <div>
            {isMod ? (
                <div>
                    <ModNavbar />
                    <div>
                        {memberss.map((member) => (
                            <div
                                key={member}
                                className="block my-2 p-2 border border-gray-600 rounded-lg w-4/12 bg-amber-100 text-black"
                            >
                                {member}
                            </div>
                        ))}
                    </div>
                    <div>
                        {bannedd.map((member) => (
                            <div
                                key={member}
                                className="block my-2 p-2 border border-gray-600 rounded-lg w-4/12 bg-pink-400 text-black"
                            >
                                {member}
                            </div>
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