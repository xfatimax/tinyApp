const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(user, expectedUser);
  });
});

describe('isEmailTaken', function() {
  it('should return true if the email exists in the database', function() {
    const email = isEmailTaken("user@example.com", testUsers);
    assert.deepEqual(email, true);
  });

  it('should return false if the email does not exist in the database', function() {
    const email = isEmailTaken("null@example.com", testUsers);
    assert.deepEqual(email, false);
  });

});