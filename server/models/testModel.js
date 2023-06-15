const mongoose = require('mongoose');
const db_link='mongodb+srv://shaleenhero123:sallu123@cluster0.o4ejlkz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then((db)=>{
        console.log("test database connected");
    })
    .catch((err)=>{
        console.log("database connection error: ",err);
    })

testSchema = mongoose.Schema({
    mcq_list:[{
        type:mongoose.Schema.ObjectId,
        ref:'mcqModel'
    }],
    by:{
        type:String // Teacher name
    },
    created:{ // time
        type:Date,
        default:Date.now()
    }
})


const testModel = mongoose.model('testModel',testSchema);
module.exports = testModel