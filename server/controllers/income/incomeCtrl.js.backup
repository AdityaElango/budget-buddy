const expressAsyncHandler = require("express-async-handler");
const Income = require("../../models/incomeSchema");

//create income
const createIncCtrl = expressAsyncHandler(async(req, res) =>{
    const {category, amount,account, description,date,  user, tags = []} = req.body;
    // Basic validation
    if (!category || !description || !account || !date || !user) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    try{
        const normalizedTags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
        const income = await Income.create({
            category,
            amount,
            description,
            account,
            date,
            tags: normalizedTags,
            user,
        });
        res.json(income);
    }catch(error){
        res.status(500).json({ error: error.message || 'Error creating income' });
    }
});


//fetch all income
const fetchAllIncCtrl = expressAsyncHandler(async(req, res) =>{
    const {page} = req.query;
    try{
        const income = await Income.paginate({},{limit:10 , page:Number(page)});
        res.json(income);
    }catch(error){
        res.json(error)
    }
});

//fetch single income
const fetchIncDetailsCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const income = await Income.findById(id);
        res.json(income); 
    }catch(error){
        res.json(error)
    }
  
});

//update

const updateIncCtrl = expressAsyncHandler(async (req, res) =>{
    const { id } = req?.params;
    const {category, amount, account, description,date, tags = []} = req.body;

    try{
        const normalizedTags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
        const income = await Income.findByIdAndUpdate(
            id, 
            {
            category,
            amount,
            account,
            description,
            date,
            tags: normalizedTags,
        },
        {new: true}
    );
    res.json(income);
    }catch(error){
        res.json(error);
    }
});

//delete
const deleteIncCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const income = await Income.findByIdAndDelete(id);
        res.json(income);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular user account
const useraccIncCtrl = expressAsyncHandler(async(req, res) => {
    const { userid , acc} = req?.params;
    try{
        const income = await Income.find({user:userid , account:acc});
        res.json(income);
    }catch(error){
        res.json(error)
    }
  
});

const userIncCtrl = expressAsyncHandler(async(req, res) => {
    const { userid } = req?.params;
    try{
        const income = await Income.find({user:userid});
        res.json(income);
    }catch(error){
        res.json(error)
    }
  
});

module.exports = {createIncCtrl, fetchAllIncCtrl,fetchIncDetailsCtrl , updateIncCtrl, deleteIncCtrl, useraccIncCtrl, userIncCtrl};