// Controller for the editing of user profile
function editProfileController($scope, userProfile) {

  var editProfileCtrl = {
    constructor: function() {
      userProfile.pingSession();
      var sessionUser = userProfile.getSession();
      if (!sessionUser || !sessionUser.user)
        return;

      $scope.title = "Edit profile";
      $scope.isNoValid = false;
      $scope.isNoValidPassword = false;
      $scope.isRequestProcessing = false;
      $scope.isChangePasswordShow = false;
      $scope.actionMessage = "";
      $scope.isOkResult = false;
      $scope.prefix = "+380";

      var user = sessionUser.user;
      $scope.name = user.name;
      $scope.surname = user.surname;
      $scope.email = user.email;
      if (!user.phone)
        user.phone = "";
      $scope.phone = user.phone.replace($scope.prefix, "");

      var editProfileCtnrElem = angular.element(document.querySelector("#editProfileCtnr"));
      editProfileCtnrElem.find("input").bind("keydown", function () {
        $scope.isNoValid = false;
        $scope.isNoValidPassword = false;
      });

      $scope.saveProfile = self.saveProfile;
      $scope.changePassword = self.changePassword;
    },

    saveProfile: function (form) {
      $scope.isNoValid = !form.$valid;
      if (!form.$valid)
        return;

      var userParams = {};
      userParams.sessionID = user.sessionID;
      userParams.id = user.id;
      userParams.name = $scope.name;
      userParams.surname = $scope.surname;
      userParams.email = $scope.email;
      if ($scope.phone)
        userParams.phone = $scope.prefix + $scope.phone;

      $scope.isRequestProcessing = true;
      userProfile.saveProfile(userParams, function (errorMessage) {
        if (errorMessage) {
          $scope.actionMessage = errorMessage;
          $scope.isOkResult = false;
        } else {
          $scope.actionMessage = "Data is saved successfully!";
          $scope.isOkResult = true;
        }
        $scope.isRequestProcessing = false;
      });
    },

    changePassword: function (form) {
      $scope.isNoValidPassword = !form.$valid;
      if (!form.$valid)
        return;

      var userParams = {};
      userParams.sessionID = user.sessionID;
      userParams.id = user.id;
      userParams.newPassword = $scope.newPassword;

      userProfile.changePassword(userParams, function (errorMessage) {
        if (errorMessage) {
          $scope.actionMessage = errorMessage;
          $scope.isOkResult = false;
        } else {
          $scope.actionMessage = "Data is saved successfully!";
          $scope.isOkResult = true;
        }
      });
    }

  };

  editProfileCtrl.constructor();
  return editProfileCtrl;
}

// "Only numbers entering" directive
function numericOnlyDirective() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {

      modelCtrl.$parsers.push(function (inputValue) {
        var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : null;

        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
}