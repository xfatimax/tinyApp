const getUserByEmail = (email, users) => {
  for (const user in users)
    if (users[user].email === email) {
      return user;
    }
  return null;
};

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
};

let isEmailTaken = (email, userDatabase) => {

  // Iterate through the users database
  for (let userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return true;
    }
  }

  return false;
};

const urlsOfUser = function(userID, urlDatabase) {
  let newObj = {};
  for (const entry in urlDatabase) {
    if (urlDatabase[entry].userID === userID) {
      newObj[entry] = urlDatabase[entry];
    }
  }
  return newObj;
};

module.exports = { generateRandomString, getUserByEmail, urlsOfUser}