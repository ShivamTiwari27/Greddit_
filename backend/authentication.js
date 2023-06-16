import express from 'express'
import mongoose from "mongoose"
import cors from 'cors'
import passport from "passport";
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from 'express-session'
import User from './model.js'
import mySub from './subgmodel.js'
import posts from './postmodel.js'
import myReport from './reportmodel.js'
import myChat from './chatmodel.js'
import myStats from './statsmodal.js'
import f from './passportConfig.js'

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:admin@greddit.pqmx1yl.mongodb.net/?retryWrites=true",
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    () => {
       console.log("Mongo connected");
    });

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: "supersecretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("supersecretcode"))
app.use(passport.initialize());
app.use(passport.session());
f(passport);

// Routes
app.post('/login',(req,res,next) => {
    passport.authenticate("local",(err,user,info) => {
        if(err) throw err;
        if(!user) res.send("no user exists");
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send(req.user);
                console.log(req.user);
            });
        }
    })(req,res,next)
});

app.post('/register',(req,res) => {
    User.findOne({
        username: req.body.username}, async (err, doc) => {
        if (err) throw err;
        if (doc) throw res.send("User already exists");
        if (!doc) {
            const hashedPass = await bcrypt.hash(req.body.password,10);
            const newUser = new User({
                username: req.body.username,
                password: hashedPass,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                age: req.body.age,
                contact: req.body.contact,
            });
            await newUser.save();
            res.send("User Created")
        }
    })
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    });
});

app.get("/user", (req, res) => {
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/id",(req,res) => {
    if(req.user === undefined)
        res.send(null)
    else
        res.send(req.user.id);
})

app.post('/getid', (req, res) => {
   User.findOne({username: req.body.id}, (err, doc) => {
        if (err) throw err;
        res.send(doc.id);
    }
)});


app.post("/userInfo",(req,res) => {
    // let id = req.body.data;
    let id = req.body['id'];
    console.log("The id is" + id);
    if(id !== undefined) {
        User.findOne({_id: id},(err,doc) => {
            if(err) throw err;
            console.log("The Doc is" + doc);
            res.send(doc);
        })
    }
})

app.post('/setInfo',async (req, res) => {
    let id = req.body.id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let contact = req.body.contact;
    let passAuth = true;

    if(req.body.password) {
        console.log("IM HERE")
        const hashedPass = await bcrypt.hash(req.body.newPassword, 10);

            if(passAuth) {
                console.log(id + " " + fname + " " + lname + " " + contact + " " + req.body.password + " " + req.body.newPassword)

                User.updateOne({_id: id}, {
                    $set: {
                        fname: fname,
                        lname: lname,
                        contact: contact,
                        password: hashedPass
                    }
                }, (err, doc) => {
                    if (err) throw err;
                    console.log(doc);
                    res.send("200");
                });
            }
            else{
                res.send("Password Incorrect");
            }

        }


    else {
        console.log("IM HERE 2")
            console.log(id + " " + fname + " " + lname + " " + contact)
            User.updateOne({_id: id}, {
                $set: {
                    fname: fname,
                    lname: lname,
                    contact: contact
                }
            }, (err, doc) => {
                if (err) throw err;
                console.log(doc);
                res.send("200");
            });
    }

})

app.post('/follow',async (req,res) => {
    let id = req.body.id;
    let followId = req.body.followId;
    User.updateOne({_id: id}, {
        $push: {
            following: followId
        }
    })
    User.updateOne({_id: followId}, {
        $push: {
            followers: id
        }
    })
})

app.post('/getuser', (req,res) => {
    let id = req.body.id;

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        // console.log("for the id " + id + "the doc is " + doc);
        if(doc) res.send(doc.username);
    });
});

app.post('/getFollowers', (req,res) => {
    let id = req.body.id;

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        // console.log("for the id " + id + "the doc is " + doc);
        if(doc) res.send(doc.followers);
    })
})

app.post('/getFollowing', (req,res) => {
    let id = req.body.id;

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        // console.log("for the id " + id + "the doc is " + doc);
        if(doc) res.send(doc.following);
    })
})

app.post('/removeFollower', (req,res) => {
    let id = req.body.id;
    let follower = req.body.followerName;
    let userUsername;
    // Remove from follower array in mongodb

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        if(doc) {
            console.log("doc found")
            userUsername = doc.username;
            let index = doc.followers.indexOf(follower);
            if(index > -1) {
                console.log("index found")
                doc.followers.splice(index,1);
            }
            doc.save();
        }
    });

    User.findOne({username: follower},(err,doc) => {
        if(err) throw err;
        if(doc) {
            console.log("doc found")
            let index = doc.following.indexOf(userUsername);
            if(index > -1) {
                console.log("index found")
                doc.following.splice(index,1);
            }
            doc.save();
        }
    });
});

app.post('/removeFollowing', (req,res) => {
    let id = req.body.id;
    let following = req.body.followingName;
    let userUsername;
    // Remove from follower array in mongodb

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        if(doc) {
            console.log("doc found" + doc.username)
            userUsername = doc.username;
            let index = doc.following.indexOf(following);
            if(index > -1) {
                console.log("index found" + following)
                doc.following.splice(index,1);
                doc.save();

                User.findOne({username: following},(err,doc) => {
                    if(err) throw err;
                    if(doc) {
                        console.log("doc found" + doc.username)
                        let index = doc.followers.indexOf(userUsername);
                        console.log(index);
                        if(index > -1) {
                            console.log("index found" + userUsername)
                            doc.followers.splice(index,1);
                        }
                        doc.save();
                    }
                });
            }
            // doc.save();
        }
    });


});

app.post('/name', (req, res) => {
    User.findOne({_id: req.body.id}, (err, doc) => {
        if (err) throw err;
        if (doc) {
            res.send(doc);
        }
    });

});

app.post('/getsub', (req,res) => {
    let owner = req.body.owner;
    let id = req.body.id;
    console.log("id is" + id);

    User.findOne({_id: id},(err,doc) => {
        if(err) throw err;
        if(doc){
            owner = doc.username;
            console.log("owner is" + owner);
            mySub.find({owner: owner},(err,doc) => {
                if(err) throw err;
                if(doc) {
                    res.send(doc);
                    // console.log(doc);
                }
            });
        }
    });
});

app.post('/createsub',async (req,res) => {
    let id = req.body.id;
    let owner;

    User.findOne({_id: id}, (err, doc) => {
        if (err) throw err;
        if (doc) {
            owner = doc.username;
            // console.log("owner is" + owner);
            mySub.findOne({name: req.body.name}, async (err, doc) => {
                if (err) throw err;
                if (doc) throw res.send("Sub already exists");
                if (!doc) {
                    const newSub = new mySub({
                        name: req.body.name,
                        description: req.body.description,
                        owner: owner,
                        numMembers: 1,
                        numPosts: 0,
                        members: [owner],
                        pending: req.body.pending,
                        banned: req.body.banned,
                        tags: req.body.tags,
                        image: req.body.image || "https://www.redditstatic.com/avatars/avatar_default_02_FFB000.png"
                    });

                    await newSub.save();
                    res.send("Sub Created")
                }
            });
        }
    });
});

app.post('/deletesub',async (req,res) => {
    let subName = req.body.name;

    mySub.deleteOne({name: subName}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            console.log("Sub Deleted");

            posts.find({subname: subName}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    console.log("posts found");
                    doc.forEach((post) => {
                        console.log("deleting post");
                        posts.deleteOne({_id: post._id}, (err,doc) => {
                            if(err) throw err;
                            if(doc) {
                                console.log("post deleted");
                            }
                        })
                    })
                }
            });
            res.send("Sub Deleted");
        }
    });
});

app.get('/getallsub', (req,res) => {
    mySub.find({},(err,doc) => {
        if(err) throw err;
        res.send(doc);
    })
})

app.post('/post',async (req,res) => {
    let id = req.body.id;
    let owner = req.body.owner;
    let title = req.body.title;
    let subn = req.body.subn;
    let content = req.body.content;
    let image = req.body.image;

    console.log(id);
    User.findOne({_id: id}, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log("doc found");
            owner = doc.username;
            const newPost = new posts({
                title: title,
                subname: subn,
                content: content,
                owner: owner,
                image: image,
                upvotes: [],
                downvotes: [],
                comments: [],
            });
            newPost.save();
            mySub.findOne({name: subn}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    doc.numPosts = doc.numPosts + 1;
                    doc.save();
                }
            });
            res.send("Posted")
        }
    });
});

// app.post('/getposts', (req,res) => {
//     let subn = req.body.subn;
//     console.log(subn);
//     posts.find({subname: subn},(err,doc) => {
//         if(err) throw err;
//         if(doc) {
//             res.send(doc);
//         }
//     })
// })
//

function censorText(text,bannedKeywords) {
    let censoredText = text; // Create a copy of the original text

    bannedKeywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi'); // Create a case-insensitive regular expression
        censoredText = censoredText.replace(regex, '***'); // Replace any occurrence of the banned keyword with "***"
    });

    return censoredText;
}


app.post('/getposts', (req,res) => {
    let subn = req.body.subn;
    let page = req.body.page;
    let banned;
    console.log(subn);

    posts.find({subname: subn}).limit(page === 0 ? 10 : page*10).exec((err,doc) => {
        if(err) throw err;
        if(doc) {
            mySub.findOne({name: subn}, (err,hehe) => {
                if(err) throw err;
                if(hehe) {
                    console.log(doc);
                    banned = hehe.banned;
                    const censoredData = doc.map(post => ({
                        ...post._doc,
                        content: censorText(post.content, banned)
                    }));
                    console.log("im here now")
                    console.log(censoredData)
                    res.send(censoredData);
                }
            });

        }
    });
});

app.post('/getnextpost', (req,res) => {
    let subn = req.body.subn;
    let page = req.body.page;
    let banned;
    console.log(subn);

    posts.find({subname: subn}).skip( (page-1)*10).limit(10).exec((err,doc) => {
        if(err) throw err;
        if(doc) {
            mySub.findOne({name: subn}, (err,hehe) => {
                if(err) throw err;
                if(hehe) {
                    console.log(doc);
                    banned = hehe.banned;
                    const censoredData = doc.map(post => ({
                        ...post._doc,
                        content: censorText(post.content, banned)
                    }));
                    console.log("im here now")
                    console.log(censoredData)
                    res.send(censoredData);
                }
            });
            // res.send(doc);
        }
    });
});

app.post('/upvote', (req,res) => {
    let user = req.body.uid;
    let postId = req.body.id;

    posts.findOne({_id: postId}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            // check if the upvote is already there
            if(doc.upvotes.includes(user)) {
                doc.upvotes.splice(doc.upvotes.indexOf(user),1);
                doc.save();
                res.send("upvote removed");
            }
            else {
                doc.upvotes.push(user);
                doc.save();
                res.send("upvoted");
            }
        }
    });
});

app.post('/downvote', (req,res) => {
    let user = req.body.uid;
    let postId = req.body.id;

    posts.findOne({_id: postId}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            // check if the upvote is already there
            if(doc.downvotes.includes(user)) {
                doc.downvotes.splice(doc.downvotes.indexOf(user),1);
                doc.save();
                res.send("downvote removed");
            }
            else {
                doc.downvotes.push(user);
                doc.save();
                res.send("downvoted");
            }
        }
    });
});

app.post('/comment',(req,res) => {
    let user = req.body.uid;
    let postId = req.body.id;
    let comment = req.body.comment;

    posts.findOne({_id: postId}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.comments.push(comment);
            doc.save();
            res.send("commented");
        }
    });
});

app.post('/searchsub', (req, res) => {
    let subn = req.body.subn;
    let sorts = req.body.sorts;
    let tags = req.body.tags;
    console.log(tags);

    if (sorts.length > 0) {
        console.log(sorts);
        let sorting = Array(sorts.length)
        console.log("sorted search");

        for (let i = 0; i < sorts.length; i++) {
            if (sorts[i] === "name") {
                sorting[i] = ['name', -1];
            } else if (sorts[i] === "date") {
                sorting[i] = ['date', -1];
            } else if (sorts[i] === "followers") {
                sorting[i] = ['numMembers', 1];
            }
        }

        console.log(sorting)
        mySub.find({
            $or: [
                { name: { $regex: subn, $options: 'i' } },
                { tags: { $in: tags } }
            ]
        }, (err, doc) => {
            if (err) throw err;
            if (doc) {
                res.send(doc);
            }
        }).sort(sorting);
    } else {
        console.log("unsorted search");
        mySub.find({
            $or: [
                { name: { $regex: subn, $options: 'i' } },
                { tags: { $in: tags } }
            ]
        }, (err, doc) => {
            if (err) throw err;
            if (doc) {
                res.send(doc);
            }
        })
    }
});

app.post('/savepost', (req,res) => {
    let user = req.body.uid;
    let postId = req.body.id;

    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.savedPosts.push(postId);
            doc.save();
            res.send("saved");
        }
    });
})

app.post('/unsave', (req,res) => {
    let user = req.body.user;
    let postId = req.body.postid;

    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.savedPosts.splice(doc.savedPosts.indexOf(postId),1);
            doc.save();
            res.send("unsaved");
        }
    });
});

app.post('/saved', (req,res) => {
    let user = req.body.id;

    console.log('hehe')
    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            // res.send(doc.savedPosts);
            posts.find({_id: {$in: doc.savedPosts}}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    res.send(doc);
                }
            });
        }
    });
});

app.post('/followuser', (req,res) => {
    let user = req.body.uid;
    let postId = req.body.id;
    let owner;
    let usern;

    posts.findOne({_id: postId}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            owner = doc.owner;

            User.findOne({_id: user}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    usern = doc.username;
                }
            });

            User.findOne({username: owner}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    doc.followers.addToSet(usern);
                    // doc.followers.push(usern);
                    doc.save();

                    User.findOne({_id: user}, (err,doc) => {
                        if(err) throw err;
                        if(doc) {
                            // doc.following.push(owner);
                            doc.following.addToSet(owner);
                            doc.save();
                            res.send("followed");
                        }
                    });

                }
            });
        }
    });
});

app.post('/joinRequest', (req,res) => {
    let user = req.body.uid;
    let sub = req.body.sub;
    let usern;

    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            usern = doc.username;
            console.log(usern);
            console.log(sub);
            mySub.updateOne({name: sub}, {$addToSet: {pending: usern}}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    console.log(doc);
                    res.send("requested");
                }
            });
        }
    });
});



app.post('/leaveSub', (req,res) => {
    let user = req.body.uid;
    let sub = req.body.subn;
    let usern;

    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            usern = doc.username;
            console.log(usern);
            mySub.findOne({name: sub}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    doc.members.pull(usern);
                    doc.returnings.addToSet(usern);
                    doc.save();
                    res.send("left");
                }
            });
        }
    })
});


app.post('/returnRequest', (req,res) => {
   let sub = req.body.sub;

   mySub.findOne({name: sub}, (err,doc) => {
         if(err) throw err;
         if(doc) {
              res.send(doc.pending);
         }
   });
});

app.post('/returning', (req,res) => {
    let sub = req.body.sub;

    mySub.findOne({name: sub}, (err,doc) => {
            if(err) throw err;
            if(doc) {
                 res.send(doc.returnings);
            }
    });
});


app.post('/acceptRequest', (req,res) => {
    let sub = req.body.sub;


    mySub.findOne({name: sub}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.pending.splice(doc.pending.indexOf(req.body.user),1);
            doc.members.addToSet(req.body.user);
            doc.numMembers = doc.numMembers + 1;
            doc.save();
            res.send("accepted");
        }
    });
});


app.post('/declineRequest', (req,res) => {
    let sub = req.body.sub;

    mySub.findOne({name: sub}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.pending.splice(doc.pending.indexOf(req.body.user),1);
            doc.save();
            res.send("declined");
        }
    });

});

app.post('/checkifjoined', (req,res) => {
    let user = req.body.uid;
    let sub = req.body.subname;
    let usern;

    User.findOne({_id: user}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            usern = doc.username;
            mySub.findOne({name: sub}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    if(doc.members.includes(usern)) {
                        res.send("true");
                    }
                    else {
                        res.send("false");
                    }
                }
            });
        }
    });
});

app.post('/checkifMod', (req,res) => {
    let user = req.body.uid;
    let sub = req.body.subname;
    let usern;

    User.findOne({_id: user}, (err,doc) => {
        if (err) throw err;
        if (doc) {
            usern = doc.username;
            mySub.findOne({name: sub}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    if(doc.owner === usern) {
                        res.send("true");
                    }
                    else {
                        res.send("false");
                    }
                }
            });
        }
    });
});

app.post('/getMembers', (req,res) => {
    let sub = req.body.subname;

    mySub.findOne({name: sub}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            res.send(doc.members);
        }
    });
});

app.post('/getBanned', (req,res) => {
    let sub = req.body.subname;

    mySub.findOne({name: sub}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            res.send(doc.bannedUsers);
        }
    });
});

app.post('/getsubpic', (req,res) => {
    let sub = req.body.subname;

    mySub.findOne({name: sub}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            res.send(doc.image);
        }
    });
});

function getNameOfPoster(postid){
    posts.findOne({_id: postid}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            return doc.owner;
        }
    })
    return "error";
}


app.post('/createreport', (req,res) => {
    let user = req.body.uid;
    let sub = req.body.subname;
    let post = req.body.id;
    let reason = req.body.report;
    let owner;
    let text;
    let usern;

    posts.findOne({_id: post}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            owner = doc.owner;
            text = doc.content;
            User.findOne({_id: user}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    usern = doc.username;

                    // Check if a report with the same subname, postid, and reporter already exists
                    myReport.findOne({ subname: sub, postid: post, reporter: usern , status: "pending"}, (err, existingReport) => {
                        if (err) throw err;

                        if (existingReport) {
                            // A report with the same subname, postid, and reporter already exists, do not save the new report
                            res.send("Report already exists");
                        } else {
                            // Save the new report
                            let report = new myReport({
                                subname: sub,
                                postid: post,
                                reporter: usern,
                                reported: owner,
                                reason: reason,
                                status: "pending",
                                text: text,
                            });
                            report.save();
                            res.send("reported");
                        }
                    });
                }
            });
        }
    });
});


// function checkAgeOfReports() {
//     const oneWeekAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago in milli-seconds
//     const oneMinuteAgo = new Date(Date.now() - 60 * 1000); // 1 minute ago in milliseconds
//
//     myReport.deleteMany({ date: { $lt: oneMinuteAgo } }, (err, result) => {
//         if (err) throw err;
//         console.log(`${result.deletedCount} reports have been deleted.`);
//     });
// }
//
// app.post('/getReports', (req, res) => {
//     let sub = req.body.subname;
//     checkAgeOfReports(); // Call the checkAgeOfReports function before retrieving the reports
//     myReport.find({ subname: sub }, (err, docs) => {
//         if (err) throw err;
//         res.send(docs);
//     });
// });
async function checkAgeOfReports() {
    const oneWeekAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago in milli-seconds
    // const oneMinuteAgo = new Date(Date.now() - 60 * 1000); // 1 minute ago in milliseconds

    const result = await myReport.deleteMany({ date: { $lt: oneWeekAgo } });
    console.log(`${result.deletedCount} reports have been deleted.`);
}

app.post('/getReports', async (req, res) => {
    let sub = req.body.subname;
    await checkAgeOfReports(); // Call the checkAgeOfReports function before retrieving the reports
    myReport.find({ subname: sub }, (err, docs) => {
        if (err) throw err;
        res.send(docs);
    });
});




app.post('/blockUser', (req,res) => {
    let sub = req.body.subname;
    let user = req.body.user;
    let reportid = req.body.reportid;

    myReport.findOne({_id: reportid}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            doc.status = "resolved";
            doc.save();
            mySub.findOne({name: doc.subname}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    doc.bannedUsers.addToSet(user);
                    doc.save();
                    res.send("blocked");
                }
            });
        }

    });
});

app.post('/deletePost', (req,res) => {
    let sub = req.body.subname;
    let post = req.body.postid;
    let reportid = req.body.reportid;

    myReport.findOne({_id: reportid}, (err, doc) => {
        if (err) throw err;
        if (doc) {
            doc = "resolved";
            doc.save();
            posts.findOne({_id: doc.postid}, (err, doc) => {
                if (err) throw err;
                if (doc) {
                    doc.remove();
                    res.send("deleted");
                }
            })
        }
    });
});

app.post('/initiate_chat', (req, res) => {
    const { u1, u2 } = req.body;

    myChat.findOne({ $or: [{ u1, u2 }, { u1: u2, u2: u1 }] })
        .then(chat => {
            if (chat) {
                return res.status(400).json({ message: 'Chat already exists' });
            }

            const newChat = new myChat({
                u1,
                u2,
                messages: []
            });

            newChat.save()
                .then(chat => res.json(chat))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'Server error' });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
});

function initiate_chat(u1, u2) {
    myChat.findOne({ $or: [{ u1, u2 }, { u1: u2, u2: u1 }] })
        .then(chat => {
            if (chat) {
                // console.log("chat already exists")
                return;
            }
            // console.log("chat ee")
            const newChat = new myChat({
                u1,
                u2,
                messages: []
            });
            // console.log("chat aeee")

            newChat.save()
                .then(chat => console.log(chat))
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
        });
}


app.post('/getChats', async (req, res) => {
    const { u1, u2 } = req.body; // Fix the typo here

    try {
        const doc = await User.findOne({ username: u2 });

        if (!doc) {
            return res.status(404).json({ message: 'User not found' });
        }

        await initiate_chat(u1, doc._id); // Wait for the Promise to resolve

        const chats = await myChat.find({
            $or: [{ u1, u2: doc._id }, { u1: doc._id, u2: u1 }]
        });

        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/sendMessage', async (req, res) => {
    const { u1, u2, message } = req.body;

    try {
        const doc = await User.findOne({ username: u2 });

        if (!doc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chat = await myChat.findOneAndUpdate(
            { $or: [{ u1: u1, u2: doc._id }, { u1: doc._id, u2: u1 }] },
            { $push: { messages: { sender: u1, receiver: doc._id, message: message } } },
            { new: true, upsert: true }
        );


        res.json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "talibmaster99@gmail.com",
                pass: "yjrgwneeymudkfbn",
            },
        });

        const mailOptions = {
            from: "greddit@gmail.com",
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (err) {
        console.error(err);
    }
};

app.post('/banUser', async (req,res) => {
    let sub = req.body.subname;
    let post = req.body.postid;
    let reportid = req.body.uid;
    let reporter = req.body.reporter;
    let reported = req.body.reported;
    try {
        mySub.findOne({name: sub}, async (err,doc) => {
            if(err) throw err;
            if(doc) {
                doc.bannedUsers.addToSet(reported);
                doc.members.pull(reported);
                doc.numMembers = doc.numMembers - 1;
                let reportDoc = await myReport.findOne({_id: reportid}).exec();

                if(reportDoc) {
                    reportDoc.status = "resolved";
                    await reportDoc.save();
                }

                await doc.save();
                res.send("banned");
            }
        });
        let reportedDoc = await User.findOne({username: reported}).exec();

        if(reportedDoc) {
            await sendMail(reportedDoc.email, "You have been banned",
                "You have been banned from " + sub + " for violating the rules. " +
                "Please contact the moderators for more information.");
        }

        let reporterDoc = await User.findOne({username: reporter}).exec();

        if(reporterDoc) {
            await sendMail(reporterDoc.email, "Ban notification",
                "The user " + reported + " has been banned from " + sub + " for violating the rules.");
        }
    } catch (err) {
        console.error(err);
    }
});



app.post('/removePost', async (req,res) => {
    let post = req.body.postid;
    let reportid = req.body.uid;
    let reporter = req.body.reporter;
    let reported = req.body.reported;


    try {
        posts.findOne({_id: post}, (err, doc) => {
            if (err) throw err;
            if (doc) {
                doc.remove();

                mySub.findOne({name: doc.sub}, (err, doc) => {
                    if (err) throw err;
                    if (doc) {
                        doc.numPosts = doc.numPosts - 1;
                        doc.save();
                    }
                });

                myReport.findOne({_id: reportid}, (err, doc) => {
                    if (err) throw err;
                    if (doc) {
                        doc.status = "resolved";
                        doc.save();
                        console.log("removed and deleted");
                    }
                });
               myReport
            }
        });
        let reportedDoc = await User.findOne({username: reported}).exec();

        if(reportedDoc) {
            await sendMail(reportedDoc.email, "Post Removed",
                "Your post  been removed for violating the rules. " +
                "Please contact the moderators for more information.");
        }

        let reporterDoc = await User.findOne({username: reporter}).exec();

        if(reporterDoc) {
            await sendMail(reporterDoc.email, "Remove Post notification",
                "The user " + reported + " has had the post removed  for violating the rules.");
        }
        res.send("ignored and deleted");
    }
    catch (err) {
        console.error(err);
    }
});


app.post('/ignoreReport', async (req,res) => {
    let reportid = req.body.uid;
    let reporter = req.body.reporter;

    try{
        let reporterDoc = await User.findOne({username: reporter}).exec();

        if(reporterDoc) {
            await sendMail(reporterDoc.email, "Report Post notification",
                "Your Report has been ignored");
        }


            myReport.findOne({_id: reportid}, (err,doc) => {
                if(err) throw err;
                if(doc) {
                    doc.status = "resolved";
                    doc.save();
                    res.send("ignored");
                }
            });
        }
    catch (err) {
        console.error(err);
    }
});

app.post('/newStat', async (req,res) => {
    let sub = req.body.subname;
    let action = req.body.action;

    const newStat = new myStats({
        subname: sub,
        action: action,
    });
    await newStat.save();
    res.send("stat added");
});

app.post('/getStats', async (req,res) => {
    myStats.find({}, (err,doc) => {
        if(err) throw err;
        if(doc) {
            res.send(doc);
        }
    });
});


// Open Server
app.listen(4000,() => {
    console.log('Server Started')
})




