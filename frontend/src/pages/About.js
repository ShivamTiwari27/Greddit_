import {isLoggedIn} from "../components/LoginChecker";

export default function About(){
    isLoggedIn();
    return <h1>About</h1>
}