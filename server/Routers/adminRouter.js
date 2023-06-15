const express = require('express');
const adminRouter = express.Router();
const {admin_signup,protectRoute} = require('../controller/authContoller');
const {createLecture,deleteLecture} = require('../controller/lectureController')

adminRouter.route('/signup')
    .post(admin_signup)
    .get((req,res)=>res.json({
        message:"get signup called"
    }))


adminRouter.use(protectRoute);

adminRouter.route('/createlecture')
    .post(createLecture)

adminRouter.route('/deletelecture/:id')
    .delete(deleteLecture)

// adminRouter.route('/escalateComplaint/:id')
//     .patch(escalateComplaint)

module.exports = adminRouter;