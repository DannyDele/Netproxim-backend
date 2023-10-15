



const isLoggedIn = (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith('Bearer ')) {
    token = testToken.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'You need to be logged in first' });
  }

  // If a token is found, call the next middleware or route handler
  next();
  j

};

module.exports = { isLoggedIn };