const expressAsyncHandler = require("express-async-handler");
const Expense = require("../../models/expenseSchema");

//create expense
const createExpCtrl = expressAsyncHandler(async(req, res) =>{
    const {category, amount, description,account,date,  user, tags = []} = req.body;
    // Basic validation
    if (!category || !description || !account || !date || !user) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    try{
        const normalizedTags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
        const expense = await Expense.create({
            category,
            amount,
            description,
            account,
            date,
            tags: normalizedTags,
            user,
        });
        res.json(expense);
    }catch(error){
        res.status(500).json({ error: error.message || 'Error creating expense' });
    }
});


//fetch all expense
const fetchAllExpCtrl = expressAsyncHandler(async(req, res) =>{
    const {page} = req.query;
    try{
        const expense = await Expense.paginate({},{limit:10 , page:Number(page)});
        res.json(expense);
    }catch(error){
        res.json(error)
    }
});

//fetch single expense
const fetchExpDetailsCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const expense = await Expense.findById(id);
        res.status(201).json({status:201,expense});
    }catch(error){
        res.status(401).json({status:401,error});
    }
  
});

//update

const updateExpCtrl = expressAsyncHandler(async (req, res) =>{
    const { id } = req?.params;
    const {category, amount, description,account ,date, tags = []} = req.body;

    try{
        const normalizedTags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
        const expense = await Expense.findByIdAndUpdate(
            id, 
            {
            category,
            amount,
            description,
            account,
            date,
            tags: normalizedTags,
        },
        {new: true}
    );
    res.json(expense);
    }catch(error){
        res.json(error);
    }
});

//delete
const deleteExpCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const expense = await Expense.findByIdAndDelete(id);
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular user
const userExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid } = req?.params;
    try{
        const expense = await Expense.find({user:userid});
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular user category
const usercatExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid , cat} = req?.params;
    try{
        const expense = await Expense.find({user:userid , category:cat});
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular user account
const useraccExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid , acc} = req?.params;
    try{
        const expense = await Expense.find({user:userid , account:acc});
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});



module.exports = {createExpCtrl, fetchAllExpCtrl,fetchExpDetailsCtrl , updateExpCtrl, deleteExpCtrl, userExpCtrl, usercatExpCtrl, useraccExpCtrl};