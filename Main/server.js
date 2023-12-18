const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');

// Home route
router.get('/', async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.render('home', { posts });
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  // Authenticate user (you may use Passport.js or a similar library for a more robust solution)
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username, password } });

  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Create a post route (authentication required)
router.get('/create', (req, res) => {
  if (req.session.user) {
    res.render('create');
  } else {
    res.redirect('/login');
  }
});

router.post('/create', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  await Post.create({ title, content, userId });
  res.redirect('/');
});

module.exports = router;
