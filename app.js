var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose");

var Todo = require("./models/todo");
var User = require("./models/user");

var app = express();

var port = 3000;
var dbURL = process.env.DATABASEURL || "mongodb://localhost/todoApp";
console.log("Database in use: " + dbURL);

//Express setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.engine('html', require('ejs').renderFile);

//Mongoose setup
mongoose.Promise = global.Promise;
mongoose.connect(dbURL);

//Passport setup
app.use(require("express-session")({
    secret: "kumails key",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Routes
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
   res.render("login");
});

app.post("/login", function(req, res){
    console.log(req.body.login);
    console.log(req.body.signup);
    req.body.username = req.body.username.toLowerCase();
    //console.log(req.body.password);
    if(req.body.login){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
        }
    else{
        User.register(new User({username : req.body.username.toLowerCase()}), req.body.password, function(err, newuser){
            if(err){
                console.log(err);
                res.send(err);
            }
            else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/");
                });
            }
        });
    }
});

app.post("/", function(req, res){
    if(res.locals.currentUser){
        console.log(res.locals.currentUser._id);
        var todos = res.locals.currentUser.todos.concat([req.body.todoText]);
        console.log("NEW: " + todos);
        User.findById(res.locals.currentUser._id, function (err, doc) {
            if(err){
                console.log(err);
            }
            else{
                doc.todos = doc.todos.concat([req.body.todoText]);
                doc.checkedtodos = doc.checkedtodos.concat([false]);
                doc.save();
                console.log("updated");
                res.redirect("/");
            }
        });
    }
    else{
        console.log("not logged in");
    }
});

app.delete("/", function(req, res){
    if(res.locals.currentUser){
        console.log(res.locals.currentUser._id);
        var todos = res.locals.currentUser.todos.concat([req.body.todoText]);
        console.log("NEW: " + todos);
        User.findById(res.locals.currentUser._id, function (err, doc) {
            if(err){
                console.log(err);
            }
            else{
                var index = doc.todos.indexOf(req.body.todoText);
                doc.todos.splice(index, 1);
                doc.checkedtodos.splice(index, 1);
                doc.save();
                console.log("updated");
                res.redirect("/");
            }
        });
    }
    else{
        console.log("not logged in");
    }
});

app.put("/", function(req, res){
    console.log(req.body.todoText);
    console.log(req.body.todoChecked);
    if(res.locals.currentUser){
        console.log(res.locals.currentUser._id);
        var todos = res.locals.currentUser.todos.concat([req.body.todoText]);
        console.log("NEW: " + todos);
        User.findById(res.locals.currentUser._id, function (err, doc) {
            if(err){
                console.log(err);
            }
            else{
                var index = doc.todos.indexOf(req.body.todoText);
                //doc.todos.splice(index, 1);
                doc.checkedtodos[index] = req.body.todoChecked;
                doc.checkedtodos = doc.checkedtodos;
                console.log("New checked val: " +  doc.checkedtodos);
                doc.save();
                console.log("updated");
                res.redirect("/");
            }
        });
    }
    else{
        console.log("not logged in");
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");});

app.get("/g", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/s", function(req, res){
    res.render("index");
});

app.get("/d", function(req, res){
    res.render("particlesTest");
});

function savetodb(name, pass){
    User.register(new User({username : name}), pass, function(err, user){
        if(err){
            console.log(err);
        }
        else{
            console.log("Added user");
        }
    });
}

//savetodb("john", "pass");

app.listen(port, function(){
  console.log("Server started on port " + port);
});
