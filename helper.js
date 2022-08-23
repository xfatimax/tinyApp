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

let isEmailTaken = function(email, userDatabase) {

  // Iterate through the users database
  for (let userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return true;
    }
  }

  return false;
};

module.exports = { generateRandomString, getUserByEmail}