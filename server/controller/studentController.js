const studentModel = require('../models/studentModel');
const lectureModel = require('../models/lectureModel');

// my profile (all data)
module.exports.getMyProfile = async function getMyProfile(req,res){
    try{
        let id = req.id;
        console.log(id);
        const user = await studentModel.findById(id);
        if (user){
            res.json({
                status:"ok",
                message:"student found",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"Student not found"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

// update profile
module.exports.updateStudent = async function updateStudent(req,res){
    try{
        let id = req.id;
        let data = req.body;
        const student = await studentModel.findById(id);
        if (student){
            for (let key in data){
                student[key] = data[key];
            }
            await student.save();
            res.json({
                status:"ok",
                message:"Student updated success",
                data:student
            })
        }else{
            res.json({
                status:"error",
                message:"Student not found"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            "message":"error updating student"
        })
    }
}

// delete account
module.exports.deleteStudent = async function deleteStudent(req,res){
    try{
        let id = req.id;
        const student = await studentModel.findByIdAndDelete(id);
        if (student){
            res.json({
                status:"ok",
                message:"Student deleted success",
                data:student
            })
        }else{
            res.json({
                status:"error",
                message:"error deleting student"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}