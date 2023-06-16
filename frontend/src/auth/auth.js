import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as JWTstrategy} from "passport-jwt";
import {ExtractJwt as ExtractJWT} from 'passport-jwt';
import passport from 'passport';
import UserModel from "../../backend/model";

// const ExtractJWT = require('passport-jwt').ExtractJwt;


passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.create({email,password});
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try {
                const user = await UserModel.findOne({email});
                if (!user)
                    return done(null, false, {message: 'No user found'});

                const validate = await user.isValidPassword(password);

                if (!validate)
                    return done(null, false, {message: 'Wrong Password :O'});

                return done(null, user, {message: 'Logged in'});
            }
            catch (error){
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);