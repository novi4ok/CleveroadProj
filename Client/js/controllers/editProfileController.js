"use strict";

// Controller for the editing of user profile
function editProfileController($scope, userProfile) {
  var self;

  var editProfileCtrl = {
    constructor: function () {
      self = this;

      userProfile.pingSession();
      var session = userProfile.getSession();
      if (!session || !session.user)
        return;

      $scope.title = "Edit profile";
      $scope.isNoValid = false;
      $scope.isNoValidPassword = false;
      $scope.isRequestProcessing = false;
      $scope.isChangePasswordShow = false;
      $scope.actionMessage = "";
      $scope.isOkResult = false;
      $scope.phoneCode = "380";
      $scope.phonePrefix = "+" + $scope.phoneCode;

      var user = session.user;
      $scope.name = user.name;
      $scope.surname = user.surname;
      $scope.email = user.email;
      if (!user.phone)
        user.phone = "";
      $scope.phone = user.phone.replace($scope.phoneCode, "").replace(/[+ ]/, "");

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
      var session = userProfile.getSession();
      var user = session.user;
      userParams.sessionID = user.sessionID;
      userParams.id = user.id;
      userParams.name = $scope.name;
      userParams.surname = $scope.surname;
      userParams.email = $scope.email;
      if ($scope.phone)
        userParams.phone = $scope.phonePrefix + $scope.phone;

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
      var session = userProfile.getSession();
      userParams.sessionID = session.user.sessionID;
      userParams.id = session.user.id;
      userParams.newPassword = $scope.newPassword;

      userProfile.changePassword(userParams, function (errorMessage) {
        if (errorMessage) {
          $scope.actionMessage = errorMessage;
          $scope.isOkResult = false;
        } else {
          $scope.actionMessage = "Password is changed successfully!";
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
        var transformedInput = inputValue ? inputValue.replace(/[^\d,-]/g, '') : null;

        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
}
