var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Si utilisateur non trouvé
      if (!user) {
        return done(null, false, {
          message: 'Utilisateur non trouvé'
        });
      }
      // Si le mot de passe est incorrect
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Mot de passe incorrect'
        });
      }
      // Si les données sont correctes retourner l'utilisateur
      return done(null, user);
    });
  }
));