import './App.css'
import './components/Navbar.css'
import {motion} from "framer-motion"
import {custom_cursor} from "./components/customCursor.js"
import Navbar from "./components/Navbar"
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import {Routes,Route,Link} from "react-router-dom";
import Landing from "./pages/Landing";
import Mysub from "./pages/MySubReddit";
import SearchSubs from "./pages/SearchSubs";
import All from "./pages/AllSubs";
import Saved from "./pages/Saved";
import Mod from "./pages/Mod";
import Subuser from "./pages/SubUsers";
import Subjoin from "./pages/Subjoin";
import Substats from "./pages/Substats";
import Subreports from "./pages/Subreports";
import Chat from "./pages/Chat";

function App() {
    // const variants = custom_cursor();
    return (
  <div className="App">
      <Navbar/>
      {/*<motion.div*/}
      {/*  className="cursor"*/}
      {/*  variants = {variants}*/}
      {/*  animate="default"*/}
      {/*/>*/}

    <Routes>
        <Route path = "/" element = {<Landing/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/about" element = {<About/>}/>
        <Route path = "/profile" element = {<Profile/>}/>
        <Route path = "/mysub" element = {<Mysub/>}/>
        <Route path = "/sub" element = {<SearchSubs/>}/>
        <Route path = "/sub/:subname" element = {<All/>}/>
        <Route path = "/sub/mod/:subname" element = {<Mod/>}/>
        <Route path = "/sub/mod/:subname/users" element = {<Subuser/>}/>
        <Route path = "/sub/mod/:subname/joinreq" element = {<Subjoin/>}/>
        <Route path = "/sub/mod/:subname/stats" element = {<Substats/>}/>
        <Route path = "/sub/mod/:subname/reports" element = {<Subreports/>}/>
        <Route path = "/chat" element = {<Chat/>}/>
        <Route path= "/saved" element = {<Saved/>}/>
    </Routes>
  </div>
  );
}

export default App;
