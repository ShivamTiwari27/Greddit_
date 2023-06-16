import User from "../model/User.js";
import Mygred from "../model/creategreddit.js"
import Post from "../model/post.js";
import Report from "../model/report.js";
// import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import uuid4 from "uuid4";

const JWT_SECRET_KEY = "Mykey"

const signup = (req, res, next) => {

    const { fname, lname, Uname, age, Contact, email, password } = req.body;
    console.log(req.body);

    let existingUser;
    try {
        existingUser = User.findOne({ Username: Uname }, (err, doc) => {
            if (err) throw err;
            if (doc) {
                console.log("User exists");
                return res.status(400).send({ error: "User already exists" });
            }
            if (!doc) {
                //   const hashedPassword = bcrypt.hash(password ,1);

                const user = new User({
                    firstname: fname,
                    lastname: lname,
                    Username: Uname,
                    age: age,
                    Contact: Contact,
                    email: email,
                    Password: password,
                });

                user.save();
                res.send("Done");
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const login = async (req, res, next) => {
    const { Uname, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ Username: Uname });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    if (!existingUser) {
        return res.status(400).json({ message: "User not found. Sign Up please." });
    }

    let isPasswordCorrect;
    if (password === existingUser.Password)
        isPasswordCorrect = true;

    if (!isPasswordCorrect) {
        console.log("2");
        return res.status(400).json({ message: "Invalid details by backend  " });
    }


    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
        expiresIn: "100d"
    });



    res.cookie(String(existingUser._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 50),
        httpOnly: true,
        sameSite: "lax"
    });
    console.log("logged in");

    return res.status(200).json({
        message: "Successfully logged in",
        user: existingUser,
        token
    });
};

const getUser = async (req, res, next) => {
    const token = req.body.token;                       // headers.authorization;
    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }


    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }

    var userId = decoded.id;

    User.findOne({ _id: userId }, (err, doc) => {
        if (err) {
            return res.status(404).send({ error: "User not found" });
        }
        if (doc) {
            console.log("Auth success")
            return res.send(doc);
        }
    });
};

const removefollower = async (req, res, next) => {

    const name_ = req.body.name;
    const Usern = req.body.loginUsername;
    let myname_fname;
    console.log(name_, Usern);


    User.findOne({ Username: Usern }, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log("found", doc.firstname);
            myname_fname = doc.firstname;
            doc.follower.pull(name_); // assuming the followers field is an array of follower names
            doc.save((err) => {
                if (err) throw err;
                console.log(`Removed ${name_} from ${Usern}'s followers`);
            });
        } else {
            console.log(`User ${myname_fname} not found`);
        }
    });


    User.findOne({ firstname: name_ }, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log("found", myname_fname);
            doc.following.pull(myname_fname); // assuming the followers field is an array of follower names
            doc.save((err) => {
                if (err) throw err;
                console.log(`Removed ${name_} from ${Usern}'s followers`);
            });
        } else {
            console.log(`User ${myname_fname} not found`);
        }
        res.send("done sucessfully");
    });

};


const removefollowing = async (req, res, next) => {

    const name_ = req.body.name;
    const Usern = req.body.loginUsername;
    console.log(name_, Usern);
    let myname_fname;
    User.findOne({ Username: Usern }, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log("found", doc);
            myname_fname = doc.firstname;
            doc.following.pull(name_); // assuming the followers field is an array of follower names
            doc.save((err) => {
                if (err) throw err;
                console.log(`Removed ${name_} from ${Usern}'s followers`);
            });
        } else {
            console.log(`User ${myname_fname} not found`);
        }
    });


    User.findOne({ firstname: name_ }, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log("found", doc.name_);
            doc.follower.pull(myname_fname); // assuming the followers field is an array of follower names
            doc.save((err) => {
                if (err) throw err;
                console.log(`Removed ${name_} from ${Usern}'s followers`);
            });
        } else {
            console.log(`User ${myname_fname} not found`);
        }
        res.send("done sucessfully");
    });
};

const updateinfo = async (req, res, next) => {

    let token = req.body.tokentoset;
    let fname = req.body.fnametoset;
    let lname = req.body.lnametoset;
    let age = req.body.agetoset;
    let Contact = req.body.Contacttoset;
    let City = req.body.Citytoset;

    console.log(City);
    // console.log(token , fname , lname , age , Contact);

    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(405).send({ error: "Unauthorized" })
    }

    var userId = decoded.id;
    console.log(userId);
    console.log("getuser")


    User.updateOne({ _id: userId }, {
        $set: {
            firstname: fname,
            lastname: lname,
            age: age,
            Contact: Contact,
            City: City
        }
    }, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(City);
    });

}

const mygreddit = async (req, res, next) => {
    let token = req.body.tokentoset;
    let un = req.body.unametoset;
    let name = req.body.nametoset;
    let description = req.body.descriptiontoset;
    let bk = req.body.bannedkeywordstoset;
    let image = req.body.imagetoset;
    console.log("mygreddit");
    try 
    {
    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }

    var userId = decoded.id;

    const f =  uuid4()
    console.log("here")
    console.log(f)
    let mysub = new Mygred({
        uniquename: un,
        name: name,
        description: description,
        bannedKeywords: bk,
        image: image,
        members:[],
        Id: String(f)
    });

    await mysub.save();
    const t = await Mygred.updateOne({Id:f},{$addToSet:{members:userId}})
    console.log(t)
    res.send("done");


}
catch(e)
{

}
}

const mygredditgetdata = async (req, res, next) => {
    let token = req.body.tokentoset;
    let un = req.body.unametoset;
    console.log("mygreddit");


    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }

    
    Mygred.find({ uniquename: un }, (err, doc) => {
        if (err) {
            return res.status(404).send({ error: "User not found" });
        }
        if (doc) {
            console.log("Auth success")
            return res.send({"message":doc});
        }
    });
}

const deletepost = async (req, res, next) => {

    const id = req.body.id;
    console.log(id);


    User.findOne({ _id: id }, (err, doc) => {
        if (err) {
            throw err;
        } else if (id) {
            Mygred.deleteOne({ _id: id }, (err) => {
                if (err) {
                    throw err;
                } else {
                    res.send("deleted successfully");
                }
            });
        } else {
            console.log(`No user found with id ${id}`);
            res.send("User not found");
        }
    });

}

const sendpost = async (req, res, next) => {


    console.log("sendpost")
    let token = req.body.token;
    let text = req.body.texttoset;
    let description = req.body.descriptiontoset;
    let posted_by = req.body.Posted_by;
    let Posted_in = req.body.Posted_in;

    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }

    let mysub = new Post({
        Text: text,
        Description: description,
        Posted_By: posted_by,
        Posted_In: Posted_in,
    });

    await mysub.save();
    res.send("done");

}

const getpost = async (req, res, next) => {

    let token = req.body.tokentoset;
    let postedin = req.body.Posted_in;
    console.log("getpost");


    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }


    Post.find({ Posted_In: postedin }, (err, doc) => {
        if (err) {
            return res.status(404).send({ error: "User not found" });
        }
        if (doc) {
            console.log("Auth success")
            return res.send(doc);
        }
    });
}


const upvote = async (req, res, next) => {
    const postId = req.body.id;
    const token = req.body.tokentoset;

    // console.log(postId);
    // console.log(userId);


    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(405).send({ error: "Unauthorized" })
    }

    const userId = decoded.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already upvoted this post
        if (post.upvotesUser.includes(userId)) {
            post.upvotesUser.pull(userId);
            post.Upvotes--;
        } else if (post.downvotesUser.includes(userId)) {
            // User has already downvoted, so remove the downvote and add the upvote
            post.downvotesUser.pull(userId);
            post.Downvotes--;
            post.upvotesUser.push(userId);
            post.Upvotes++;
        } else {
            post.upvotesUser.push(userId);
            post.Upvotes++;
        }

        await post.save();
        res.json(post);
    } catch (e) {
        console.error(`Error upvoting post: ${e}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const downvote = async (req, res, next) => {
    const postId = req.body.id;
    const token = req.body.tokentoset;

    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(405).send({ error: "Unauthorized" })
    }

    const userId = decoded.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already downvoted this post
        if (post.downvotesUser.includes(userId)) {
            post.downvotesUser.pull(userId);
            post.Downvotes--;
        } else if (post.upvotesUser.includes(userId)) {
            post.upvotesUser.pull(userId)
            post.Upvotes--;
            post.downvotesUser.push(userId)
            post.Downvotes++;
        }
        else {
            post.downvotesUser.push(userId);
            post.Downvotes++;
        }
        await post.save();
        res.json(post);
    } catch (e) {
        console.error(`Error downvoting post: ${e}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const comment = async (req, res, next) => {

    const postId = req.body.id;
    const token = req.body.token;
    const commentadd = req.body.commentopass;
    const postby = req.body.Posted_by
    console.log("welcome");
    console.log(commentadd);

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decoded.id;

        if (!postId || !userId || !commentadd || !postby) {
            return res.status(400).send({ error: "Missing required fields" });
        }
        // Check if the user has already commented on this post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        console.log(user.firstname)

        const newComment = {
            text: commentadd,
            commentedBy: user.firstname,
            commentedOn: new Date(),
        };

        post.comments.push(newComment);
        await post.save();


        res.status(201).send({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send({ error: "Server error" });
    }
};


const Savepost = async (req, res, next) => {
    const token = req.body.token;
    const Postid = req.body.id;

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decoded.id;
        const user = await User.findById(userId);
        user.saveposts.push(Postid);
        await user.save();

        res.status(200).send({ message: 'Post saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
}

const getsavepost = async (req, res, next) => {
    console.log("getyoursavepsot")

    const token = req.body.token;


    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decoded.id;
        const user = await User.findById(userId);

        const savedPostIds = user.saveposts;
        const savedPosts = await Post.find({
            _id: { $in: savedPostIds }
        });

        res.send({ savedPosts });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
}

const gredditgetdata = async (req, res, next) => {
    let token = req.body.tokentoset;
    console.log("mygreddit");


    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }


    Mygred.find({}, (err, doc) => {
        if (err) {
            return res.status(404).send({ error: "User not found" });
        }
        if (doc) {
            console.log("Auth success")
            return res.send(doc);
        }
    });
}

const getAllusergreddit = async (req, res, next) => {
    console.log("get all user")
    const Postin = req.body.posted_in;
    try {
        const mygred = await Mygred.findOne({ name: Postin });
        if (!mygred) {
            return res.status(404).json({ error: 'Mygred not found' });
        }
        const members = mygred.members;
        const blockmembers = mygred.bannedMembers;
        const MembersDetails = await Promise.all(
            members.map(async (userId) => {
                const user = await User.findById(userId);
                return user;
            })
        );
        const BlockMembersDetails = await Promise.all(
            blockmembers.map(async (userId) => {
                const banneduser = await User.findById(userId);
                return banneduser;
            })
        );
        const membersResponseObj = {
            members: MembersDetails,
        };
        const blockMembersResponseObj = {
            blockmembers: BlockMembersDetails,
        };
        return res.json({ ...blockMembersResponseObj, ...membersResponseObj });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getJoinuser = async (req, res, next) => {

    const Postin = req.body.posted_in;
    console.log(Postin)
    try {
        const mygred = await Mygred.findOne({ name: Postin });
        if (!mygred) {
            console.log('get all user');
            return res.status(404).json({ error: 'Mygred not found' });
        }
        const pendingMembers = mygred.pendingMembers;
        const pendingMembersDetails = await Promise.all(
            pendingMembers.map(async (userId) => {
                const user = await User.findById(userId);
                return user;
            })
        );
        return res.send(pendingMembersDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const decline = async (req, res, next) => {

    console.log("decline")
    const user = req.body.userid;
    const postin = req.body.posted_in;
    try {
        const mygred = await Mygred.findOne({ name: postin });
        if (!mygred) {
            return res.status(404).json({ error: 'Mygred not found' });
        }

        const pendingMembers = mygred.pendingMembers;
        const index = pendingMembers.indexOf(user);

        if (index > -1) {
            pendingMembers.splice(index, 1);
        }

        await mygred.save();

        return res.status(200).json({ message: 'User declined successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });

    }
}

const accept = async (req, res, next) => {
    console.log("accept");
    const user = req.body.userid;
    const postin = req.body.posted_in;
    try {

        const mygred = await Mygred.findOne({ name: postin });
        if (!mygred) {
            return res.status(404).json({ error: 'Mygred not found' });
        }

        const pendingMembers = mygred.pendingMembers;
        const index = pendingMembers.indexOf(user);

        if (index > -1) {
            pendingMembers.splice(index, 1);
        }

        mygred.members.push(user); // add accepted user to members list

        await mygred.save();

        return res.status(200).json({ message: 'User declined successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const followUser = async (req, res, next) => {
    console.log("follow")

    const token = req.body.token;
    const followto = req.body.name;

    let decoded;
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }


    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (e) {
        res.status(404).send({ error: "Unauthorized" })
    }

    var userId = decoded.id;


    try {
        const user = await User.findById(userId);
        const followtoUser = await User.findOne({ firstname: followto });

        if (!user || !followtoUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add user to following list of the user being followed
        if (!followtoUser.follower.includes(user.firstname)) {
            followtoUser.follower.push(user.firstname);
            await followtoUser.save();
        }

        // Add followtoUser to followList of the user following
        if (!user.following.includes(followtoUser.firstname)) {
            user.following.push(followtoUser.firstname);
            await user.save();
        }

        return res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

const report = async (req, res, next) => {
    console.log("report");

    const postid = req.body.id;
    const reportedby = req.body.reportedby;
    const reportedto = req.body.reportedto;
    const concern = req.body.Concern;
    const posttext = req.body.Posttext;

    if (!postid || !reportedby || !reportedto || !concern || !posttext)
        return res.status(404).json({ error: "User not found" });

    let mysub = new Report({
        PostId: postid,
        Reported_By: reportedby,
        Reported_whom: reportedto,
        Concern: concern,
        Textofpost: posttext,
    });

    await mysub.save();
    res.send("done");

}


const getreport = async (req, res, next) => {
    try {
        const reports = await Report.find({});
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const fetchgredFollowing = async (req ,res , next) => {
    const token = req.body.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decoded.id;
        const ret = await MygredUser.find({members:userId})
        res.send({"message":ret})
    }
    catch(e)
    {
        console.log(e)
        res.send({"message":e})
    }


}

const fetchgredNotFollowing= async (req ,res , next) => {
    console.log("fetchdata")
    const token = req.body.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const userId = decoded.id;
        const ret = await MygredUser.find({members:{$nin:userId}})
        res.send({"message":ret})
    }
    catch(e)
    {
        console.log(e)
        res.send({"message":"error"})
    }
}


export { signup, login, getUser, removefollower, removefollowing, updateinfo, mygreddit, mygredditgetdata, deletepost, sendpost, getpost, upvote, downvote, comment, Savepost, getsavepost, gredditgetdata, getAllusergreddit, getJoinuser, decline, accept, followUser, report , getreport  , fetchgredFollowing,fetchgredNotFollowing};
