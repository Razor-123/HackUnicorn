const mongoose = require('mongoose');
const db_link='mongodb+srv://shaleenhero123:sallu123@cluster0.o4ejlkz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then((db)=>{
        console.log("lecture database connected");
    })
    .catch((err)=>{
        console.log("database connection error: ",err);
    })

lectureSchema = mongoose.Schema({
    heading:{
        type:String
    },
    transcript:{ // 
        type:String,
    },
    overview:{ // 
        type:String,
    },
    notes:[{
        type:String,
    }],
    url:{ // video url
        type:String,
    },
    category:{ // subject (Maths/ Bio/ Economics)
        type:String,
    },
    taught_by:{
        //type:mongoose.Schema.ObjectId,
        //ref:'adminModel'
        type:String
    },
    snap_shots:[{ // array of images
        type:String
    }]
    ,
    created:{ // time
        type:Date,
        default:Date.now()
    }
})

lectureSchema.pre(/^find/,function(next){
    this.populate("taught_by")
    next();
})

const lectureModel = mongoose.model('lectureModel',lectureSchema);
module.exports = lectureModel
