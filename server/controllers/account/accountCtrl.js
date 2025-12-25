const expressAsyncHandler = require("express-async-handler");
const Account = require("../../models/accountSchema");

//create account
const createAccCtrl = expressAsyncHandler(async (req, res) => {
  const { account, amount, user } = req.body;
  try {
    const acc = await Account.create({
      account,
      amount,
      user,
    });
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});

//fetch all account
const fetchAllAccCtrl = expressAsyncHandler(async (req, res) => {
  const { page } = req.query;
  try {
    const acc = await Account.paginate({}, { limit: 10, page: Number(page) });
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});

//fetch single account
const fetchAccDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const acc = await Account.findById(id);
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});

//update

const updateAccCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { account, amount, user } = req.body;

  try {
    const acc = await Account.findByIdAndUpdate(
      id,
      {
        account,
        amount,
        user,
      },
      { new: true }
    );
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});

//delete
const deleteAccCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const acc = await Account.findByIdAndDelete(id);
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});

const changeAccCtrl = expressAsyncHandler(async (req, res) => {
  const {acc} = req?.params;
  const { id, amount, user } = req.body;

  try {
    const account = await Account.findOne(
      acc,
      {
        id,
        amount,
        user,
      },
      { new: true }
    );
    res.json(acc);
  } catch (error) {
    res.json(error);
  }
});


module.exports = {
  createAccCtrl,
  fetchAllAccCtrl,
  fetchAccDetailsCtrl,
  updateAccCtrl,
  deleteAccCtrl,

};
