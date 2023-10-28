const User = require("../model/User");
const { redirectionURL } = require("../index.js")


exports.fetchUserById = async (req, res) => {
  console.log(redirectionURL);
  const {id} = req.user;
  try {
    const user = await User.findById( id, "name email role addresses id" )
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.updateUserById = async (req, res) => {
  const {id} = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.dataSender = (data) => {
  return data;
}