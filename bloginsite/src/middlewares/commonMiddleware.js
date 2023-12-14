//__________________________ Import  ___________________________________________

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authorModel = require("../Models/AuthorModel");
const blogModel = require("../Models/BlogsModel");

//__________________________ Validations : Name ___________________________________________

const isValidName = function (name) {
    const fnameRegex = /[a-zA-Z]{3,}/;
    return fnameRegex.test(name);
};

//__________________________ Validations : Email  ___________________________________________

const isValidEmail = function (email) {
    const emailRegex =
    /[a-zA-Z_1-90]{3,}@[A-za-z]{3,}[.]{1}[a-zA-Z]{2,}/;
    return emailRegex.test(email);
};

//__________________________ Validations : Password  ___________________________________________

const isValidPassword = function (password) {
    const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return passwordRegex.test(password);
}; 



//__________________________ Validations :  ObjectId ___________________________________________

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

//__________________________ Export : Modules  ___________________________________________

module.exports.isValidName = isValidName;
module.exports.isValidEmail = isValidEmail;
module.exports.isValidPassword = isValidPassword;

module.exports.isValidObjectId = isValidObjectId;
