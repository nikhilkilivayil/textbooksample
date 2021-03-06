/**
 * Created by navina on 27/9/16.
 */
var mongoose=require('mongoose');
var User=mongoose.model('User');




exports.create = function(req, res){
    res.render('user-form', {
        title: 'Create user',
        buttonText: "Join!"
    });
};

exports.doCreate = function(req, res){
    User.create({
        name: req.body.FullName,
        email: req.body.Email,
        modifiedOn : Date.now(),
        lastLogin : Date.now()
    }, function( err, user ){
        if(err){
            console.log(err);
            if(err.code===11000){
                res.redirect( '/views/new?exists=true' );
            }else{
                res.redirect('/?error=true');
            }
        }else{
            // Success
            console.log("User created and saved: " + user);
            req.session.user = { "name" : String, "email": String, "_id":
            String };
            req.session.user = { "name" : user.name, "email": user.email, "_id":
            user._id };
            /*req.session.loggedIn= Boolean;*/
            req.session.loggedIn = true;
            res.redirect( '/user' );
        }


    });
};

exports.index = function (req, res,next) {
    if(req.session.loggedIn === "true"){
        res.render('user-page', {
            title: req.session.user.name,
            name: req.session.user.name,
            email: req.session.user.email,
            userID: req.session.user._id
        })
    }else{
        res.redirect('/login');
    }
};

// GET login page
exports.login = function (req, res) {
    res.render('login-form', {title: 'Log in'})
};


// POST login page
exports.doLogin = function (req, res) {
    if (req.body.Email) {
        User.findOne(
            {'email' : req.body.Email},
            function(err, user) {
                if (!err) {
                    if (!user){
                        res.redirect('/login?404=user');
                    }else{
                        req.session.user = {
                            "name" : user.name,
                            "email": user.email,
                            "_id": user._id
                        };
                        req.session.loggedIn = "true";
                        console.log('Logged in user: ' + user);
                        res.redirect( '/user' );
                    }

            } else {
            res.redirect('/login?404=error');
        }
    });
}
else {
    res.redirect('/login?404=error');
}
};