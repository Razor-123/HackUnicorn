const mongoose  = require('mongoose');
const db_link = 'mongodb+srv://shaleenhero123:sallu123@cluster0.o4ejlkz.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then((db)=>{
        console.log('student database connected');
    })
    .catch((err)=>{
        console.log("student connection error: ",err);
    })

const studentSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please provide your studentname"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password length must be eight"]
    }
})

studentSchema.post('save',function(error,doc,next){
    if (error && error.name==="MongoServerError" && error.code === 11000) next(new Error('studentname already taken'));
    else next(error);
});

const studentModel = mongoose.model('studentModel',studentSchema);
module.exports = studentModel;