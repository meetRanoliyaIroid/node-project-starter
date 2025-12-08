import passport, { use } from "passport";
import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt";
import { JWT } from "./constant";
import User from "../../model/user";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET,
};

passport.use(
  new JWTstratagy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ where: { id: jwtPayload.id } });

      if (!user) {
        return done(null, false);
      }
      
      // Ensure we have a proper user object with id
      const userData = user.get ? user.get({ plain: true }) : user;
      
      delete userData.password;
      const userWithJti = { ...userData, jti: jwtPayload.jti };
      
      return done(null, userWithJti);
    } catch (error) {
      console.error("JWT Strategy error:", error);
      return done(error, false);
    }
  })
);