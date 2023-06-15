const mongoose  = require('mongoose');
const db_link = 'mongodb+srv://shaleenhero123:sallu123@cluster0.o4ejlkz.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then((db)=>{
        console.log('admin database connected');
    })
    .catch((err)=>{
        console.log("admin connection error: ",err);
    })

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please provide your adminname"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password length must be eight"]
    },
    subject:{
        type:String,
        required:[true,"Please enter your subject"]
    },
})

adminSchema.post('save',function(error,doc,next){
    if (error && error.name==="MongoServerError" && error.code === 11000) next(new Error('adminname already taken'));
    else next(error);
});

const adminModel = mongoose.model('adminModel',adminSchema);
module.exports = adminModel;
