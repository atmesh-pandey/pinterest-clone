var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res) {
  res.render('index', {nav: false});
});

router.get('/register', function(req, res) {
  res.render('register', {nav: false});
});
router.post('/register', function(req, res) {
  const data = new userModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    // contact: req.body.contact
  })
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile')
    })
  })
});
router.get('/login', function(req, res) {
  res.render('login', {nav: false});
});
router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate('posts');
  console.log(user); 
  res.render('profile', {user, nav: true});
});

router.get('/feed', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find().populate('user');
  res.render('feed', {user, posts, nav: true})
});

router.get('/add', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add', {user, nav: true});
});

router.post('/createpost', isLoggedIn, upload.single('postimage'), async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

router.get('/editprofile', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('editprofile', {user, nav: true});
});

router.post('/editprofile', isLoggedIn, upload.single('profileImage'), async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });

  if (req.file) {
    user.profileImage = req.file.filename;
  }
  user.name = req.body.name;
  user.username = req.body.username;
  user.email = req.body.email;

  await user.save();

  res.redirect('/profile');
});


router.post('/fileupload', isLoggedIn, upload.single('image'), async function(req, res) {
  // res.send('uploaded');
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile')
});

router.post('/login', passport.authenticate('local',{
  failureRedirect: '/login',
  successRedirect: '/profile'
}), function(req, res) {

});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}

module.exports = router;
