const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('./pages/login'));

// Dashboard

// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('./pages/dashboard', {
//     user: req.user,
    
    
//   })
// );
router.use('/', require('./total'));
router.use('/ajax', require('./ajax'));

module.exports = router;
