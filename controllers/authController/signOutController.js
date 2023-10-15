

const signOut = (req, res) => {
  try {
    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error during sign-out:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      return res.status(200).json({ message: 'Sign-out successful' });
    });
  } catch (error) {
    console.error('Error during sign-out:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {signOut}