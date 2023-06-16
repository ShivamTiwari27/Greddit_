import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ModNavbar from "../components/ModNavbar";
import { isLoggedIn } from "../components/LoginChecker";


export default function Mod() {
    isLoggedIn();

    const navigator = useNavigate();
    const { subname } = useParams();
    let d = localStorage.getItem('user');

    const [isMod, setIsMod] = useState(false);
    // let isMod = false;

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
                console.log(subname)
                setIsMod(true);
            })
    }


    useEffect(() => {
        checkifMod();
    }, []);

    return (
        <>
            {
                isMod ?
                    <div>
                        <ModNavbar />
                        <h1>Hello</h1>


                    </div>
                    :
                    <div>
                        <h1></h1>
                    </div>
            }
        </>
    )
}