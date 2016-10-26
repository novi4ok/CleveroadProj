// User Manager module
exports.UserMgr = function () {
  var _ = require('underscore');
  var passwordHash = require('password-hash');

  var SESSION_TIME = 200 * 60 * 1000;

  var currentRequest;
  
  var usersHash = {};

  var userList = [
    {
      id: 1,
      email: 'admin@gmail.com',
      name: 'admin',
      surname: 'surname1',
      password: passwordHash.generate('111111'),
      phone: ''
    },
    {
      id: 2,
      email: 'user@gmail.com',
      name: 'user',
      surname: 'surname2',
      password: passwordHash.generate('222222'),
      phone: ''
    },
  ];

  return {

    setRequest: function (request) {
      currentRequest = request;
    },
    
    isSessionExist: function (sessionID) {
      if (sessionID && usersHash[sessionID]) {
        var user = usersHash[sessionID];
        user.pingLast = Date.now();
        return true;
      }
      else
        return false;
    },

    updateMgr: function () {
      var keys = _.keys(usersHash);
      var delUsers = [];
      var dtNow = Date.now();
      _.each(keys, function (key) {
        var user = usersHash[key];
        if (user.pingLast) {
          if ((dtNow - user.pingLast) > SESSION_TIME) {
            delUsers.push(user);
          }
        } else {
          delUsers.push(user);
        }        
      });

      _.each(delUsers, function (user) {
        delete usersHash[user.sessionID];
      });
    },

    pingSession: function (data, objResponse, callback) {
      if (data && data.sessionID && usersHash[data.sessionID]) {
        objResponse.data = {
          user: usersHash[data.sessionID],
        };
      } else {
        objResponse.error = "User doesn't have the session!";
      }
      if (callback)
        callback();
    },

    logout: function (data, objResponse, callback) {
      if (data && data.sessionID && usersHash[data.sessionID]) {
        objResponse.data = {
          user: usersHash[data.sessionID],
        };
        delete usersHash[data.sessionID];
      }
      if (callback)
        callback();
    },

    login: function (data, objResponse, callback) {
      if (!data || !data.user || !data.user.email || !data.user.password) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      var userFound;
      //var users = getUsersResponse.data;
      userFound = _.findWhere(userList, { email: data.user.email });
      if (userFound) {
        var isPasswordVerified = passwordHash.verify(data.user.password, userFound.password);
        if (!isPasswordVerified)
          objResponse.error = "Password isn't correct!";
        else {
          data.user = userFound;
        }
      } else {
        objResponse.error = "User isn't found!";
      }

      // setting of the "session" for the user
      if (!objResponse.error && objResponse.error !== "" && currentRequest && currentRequest.sessionID) {
        data.user.sessionID = currentRequest.sessionID;
        data.user.pingLast = Date.now();          
        objResponse.data = data;          

        // save the user on the server
        if (!usersHash[data.user.sessionID]) {
          usersHash[data.user.sessionID] = data.user;
        }
      }
        
      if (callback)
        callback();
    },
    
    saveProfile: function (data, objResponse, callback) {
      if (!data || !data.user || !data.user.sessionID || !data.user.id || !data.user.email) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var userFound = _.findWhere(userList, { id: data.user.id });      
      if (userFound) {
        var userExistEmail = _.findWhere(userList, { email: data.user.email });
        if (userExistEmail && userExistEmail.id !== data.user.id) {
          objResponse.error = "Email is already used!";          
        } else {
          var user = data.user;
          userFound.name = user.name;
          userFound.surname = user.surname;
          userFound.email = user.email;
          userFound.phone = user.phone;
          data.user = userFound;
        }
      } else {
        objResponse.error = "User isn't found!";
      }
      if (callback)
        callback();
    },

    changePassword: function (data, objResponse, callback) {
      if (!data || !data.user || !data.user.sessionID || !data.user.id) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      
      var userFound = _.findWhere(userList, { id: data.user.id });
      if (userFound) {
        var user = data.user;
        userFound.password = passwordHash.generate(data.user.newPassword),
        data.user = userFound;
      } else {
        objResponse.error = "User isn't found!";
      }
      if (callback)
        callback();
    },

  };
  
};
