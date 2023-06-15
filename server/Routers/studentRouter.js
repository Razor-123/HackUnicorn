const express = require('express');
const studentRouter = express.Router();
require('../controller/studentController');
const {signup,logout,protectRoute} = require('../controller/authContoller');
const {getMyProfile,updateStudent, deleteStudent} = require('../controller/studentController');
const {getAlllectures} = require('../controller/lectureController');

studentRouter.route('/signup')
    .post(signup)
    .get((req,res)=>res.json({
        message:"get signup called"
    }))

studentRouter.route('/logout')
    .get(logout)

studentRouter.use(protectRoute);

studentRouter.route('/myprofile')
    .get(getMyProfile)
    .patch(updateStudent)
    .delete(deleteStudent)


module.exports = studentRouter;