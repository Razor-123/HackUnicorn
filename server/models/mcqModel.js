const mongoose = require('mongoose');
const db_link='mongodb+srv://shaleenhero123:sallu123@cluster0.o4ejlkz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then((db)=>{
        console.log("mcq database connected");
    })
    .catch((err)=>{
        console.log("database connection error: ",err);
    })

mcqSchema = mongoose.Schema({
    question:{ // 
        type:String,
    },
    option1:{ // 
        type:String
    },
    option2:{ // 
        type:String
    },
    option3:{ // 
        type:String
    },
    option4:{ // 
        type:String
    },
    answer:{
        type:String
    }
})


const mcqModel = mongoose.model('mcqModel',mcqSchema);
module.exports = mcqModel