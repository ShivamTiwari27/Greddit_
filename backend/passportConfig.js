import User from './model.js'
import bcrypt from "bcrypt";
import {Strategy as localStrategy} from "passport-local";

export default function (passport) {
    passport.use(
        new localStrategy((username,password,done) => {
            User.findOne({username: username},(err,user) => {
                if(err) throw err;
                if(!user) return done(null, false);
                bcrypt.compare(password,user.password,(err,result) => {
                    if(err) throw err;
                    if(result === true){
                        return done(null,user)
                    }
                    else{
                        return done(null,false);
                    }
                });
            });
        })
    );
    passport.serializeUser((user,cb) => {
        // console.log("The user id is: " + user.id)
        cb(null,user.id);
    });
    passport.deserializeUser((id,cb) => {
        User.findOne({_id: id},(err,user) => {
            // console.log("The user id is: " + user.id)
            cb(err,user);
        });
    });
};