const User = require('../model/userModel');

/**
 * Get user profile details
 */
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile details
 */
async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Verify if updating email to one that exists for someone else
    const userByEmail = await User.findByEmail(email);
    if (userByEmail && userByEmail.id !== req.user.id) {
      return res.status(400).json({ error: 'This email is already in use by another user.' });
    }

    const updated = await User.updateById(req.user.id, { name, email });
    if (!updated) {
      return res.status(404).json({ error: 'User not found or no changes made.' });
    }

    const updatedUser = await User.findById(req.user.id);
    res.json({
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
