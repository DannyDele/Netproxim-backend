const session = require('express-session')
const express = require('express')
const router = express.Router()

const isLoggedIn = router.use((req, res, next) => {
    if (req.session.userId) {
      return next()
    // The user is signed in, you can fetch their profile or perform other actions
    // using req.session.userId to identify the user
    } else {
        return res.status(300).json({msg: 'you must me signedIn'})
    // The user is not signed in
  }
});

module.export = {router, isLoggedIn}
