import express from 'express';
import {signup , login, getUser , removefollower , removefollowing , updateinfo , mygreddit ,mygredditgetdata , deletepost , sendpost  , getpost, upvote, downvote, comment , Savepost, getsavepost, gredditgetdata, getAllusergreddit, getJoinuser, decline,accept, followUser, report ,getreport, fetchgredFollowing, fetchgredNotFollowing }  from '../controllers/user-controllers.js';

const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login );
router.post("/user" , getUser);
router.post("/removefollower" , removefollower);
router.post("/removefollowing" , removefollowing);
router.post("/updateinfo" , updateinfo);
router.post("/mygreddit" , mygreddit)
router.post("/mygredditgetdata" , mygredditgetdata);
router.post("/deletepost" , deletepost)
router.post("/sendpost" , sendpost);
router.post("/getpost" , getpost);
router.post("/upvote" , upvote)
router.post("/downvote" , downvote);
router.post("/comment" , comment);
router.post("/Savepost" , Savepost);
router.post("/getsavepost" , getsavepost);
router.post("/gredditgetdata" , gredditgetdata);
router.post("/getUsersfromgreddit" , getAllusergreddit);
router.post("/getJoinUser" , getJoinuser);
router.post("/decline" , decline);
router.post("/accept" , accept);
router.post("/follow" , followUser);
router.post("/report" , report);
router.post("/getreport" , getreport);
router.post("/fetchgredFollowing" , fetchgredFollowing);
router.post("/fetchgredNotFollowing" , fetchgredNotFollowing);


export default router;