const getUserByEmail = (email, users) => {
  for (const user in users)
    if (users[user].email === email) {
      return user;
    }
  return null;
};

const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};

module.exports = { generateRandomString, getUserByEmail}