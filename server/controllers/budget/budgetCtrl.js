const expressAsyncHandler = require("express-async-handler");
const Budget = require("../../models/budgetSchema");

//create budget
const createBudCtrl = expressAsyncHandler(async(req, res) =>{
    const {category, budget, user} = req.body;
    try{
        const bud = await Budget.create({
            category,
            budget,
            user,
        });
        res.json(bud);
    }catch(error){
        res.json(error)
    }
});


//fetch all budget
const fetchAllBudCtrl = expressAsyncHandler(async(req, res) =>{
    const {page} = req.query;
    try{
        const budget = await Budget.paginate({},{limit:10 , page:Number(page)});
        res.json(budget);
    }catch(error){
        res.json(error)
    }
});

//fetch single budget
const fetchBudDetailsCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const budget = await Budget.findById(id);
        res.json(budget);
    }catch(error){
        res.json(error)
    }
  
});

//update

const updateBudCtrl = expressAsyncHandler(async (req, res) =>{
    const { id } = req?.params;
    const {category, budget} = req.body;

    try{
        const budget = await Budget.findByIdAndUpdate(
            id, 
            {
            category,
            budget
        },
        {new: true}
    );
    res.json(budget);
    }catch(error){
        res.json(error);
    }
});

//delete
const deleteBudCtrl = expressAsyncHandler(async(req, res) => {
    const { id } = req?.params;
    try{
        const budget = await Budget.findByIdAndDelete(id);
        res.json(budget);
    }catch(error){
        res.json(error)
    }
  
});

//fetch user budget
const userBudCtrl = expressAsyncHandler(async(req, res) => {
    const { userid } = req?.params;
    try{
        const budget = await Budget.find({user:userid});
        res.json(budget);
    }catch(error){
        res.json(error)
    }
  
});

module.exports = {createBudCtrl, fetchAllBudCtrl,fetchBudDetailsCtrl , updateBudCtrl, deleteBudCtrl, userBudCtrl};