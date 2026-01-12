const expressAsyncHandler = require("express-async-handler");
const Expense = require("../../models/expenseSchema");

//create
const createExpCtrl = expressAsyncHandler(async(req, res) =>{
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


//fetch all
const fetchAllExpCtrl = expressAsyncHandler(async(req, res) =>{
    const {page} = req.query;
    try{
        const expense = await Expense.paginate({},{limit:10 , page:Number(page)});
        res.json(expense);
    }catch(error){
        res.json(error)
    }
});

//fetch details
const fetchExpDetailsCtrl = expressAsyncHandler(async(req, res) => {
    const { id} = req?.params;
    try{
        const expense = await Expense.findById(id);
        res.json(expense); 
    }catch(error){
        res.json(error)
    }
  
});

//update

const updateExpCtrl = expressAsyncHandler(async (req, res) =>{
    const { id } = req?.params;
    const {category, amount, account, description,date, tags = []} = req.body;

    try{
        const normalizedTags = Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean);
        const expense = await Expense.findByIdAndUpdate(
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

//find all expenses of particular user (with optional month/year filtering)
const userExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid } = req?.params;
    const { month, year } = req.query;
    
    try{
        let query = { user: userid };
        
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        const expense = await Expense.find(query).sort({ date: -1 });
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular category for a user (with optional month/year filtering)
const usercatExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid , category} = req?.params;
    const { month, year } = req.query;
    
    try{
        let query = { user: userid, category: category };
        
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        const expense = await Expense.find(query).sort({ date: -1 });
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

//find all expenses of particular user account (with optional month/year filtering)
const useraccExpCtrl = expressAsyncHandler(async(req, res) => {
    const { userid , acc} = req?.params;
    const { month, year } = req.query;
    
    try{
        let query = { user: userid, account: acc };
        
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        const expense = await Expense.find(query).sort({ date: -1 });
        res.json(expense);
    }catch(error){
        res.json(error)
    }
  
});

module.exports = {createExpCtrl, fetchAllExpCtrl,fetchExpDetailsCtrl , updateExpCtrl, deleteExpCtrl, userExpCtrl, usercatExpCtrl, useraccExpCtrl};
