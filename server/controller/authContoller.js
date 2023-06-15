const studentModel = require('../models/studentModel');
const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const lectureModel = require('../models/lectureModel');
const JWT_KEY = require('../secrets/secret').JWT_KEY;

module.exports.signup = async function signup(req,res){
    try{
        const tempdata = req.body;
        const user = await studentModel.create(tempdata);
        if (user){
            res.json({
                status:"ok",
                message:"user signup success",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"error while signup"
            })
        }
    }catch(err){
        //console.log("err ",err);
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.admin_signup = async function admin_signup(req,res){
    try{
        const tempdata = req.body;
        const user = await adminModel.create(tempdata);
        if (user){
            res.json({
                status:"ok",
                message:"admin signup success",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"error while signup"
            })
        }
    }catch(err){
        //console.log("err ",err);
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.login = async function login(req,res){          ///////////////////////////////
    try{
        let data = req.body;
        if (data.email){
            let user = await studentModel.findOne({email:data.email});
            let admin = await adminModel.findOne({email:data.email});
            if (user){
                if (user.password == data.password){
                    let uid = user['_id'];
                    let jwt_ = jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',jwt_,{httpOnly:true});
                    res.json({
                        status:"ok",
                        "token":jwt_,
                        message:"User logged in",
                        data: user
                    })
                }else{
                    res.json({
                        status:"error",
                        message:"Credential do not match"
                    })
                }
            }
            else if(admin){
                if (admin.password == data.password){
                    let uid = admin['_id'];
                    let jwt_ = jwt.sign({payload:uid},JWT_KEY);
                    res.cookie('login',jwt_,{httpOnly:true});
                    res.json({
                        status:"ok",
                        "token":jwt_,
                        message:"Admin logged in",
                        data: admin
                    })
                }else{
                    res.json({
                        status:"error",
                        message:"Credential do not match"
                    })
                }
            }
            else{
                res.json({
                    status:"error",
                    message:"Wrong Credentials"
                })
            }
        }else{
            res.json({
                status:"error",
                message:"Please enter valid user name"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

// protect Route to check user is logged in or not
module.exports.protectRoute = async function protectRoute(req,res,next){
    try{
        console.log("in protect route")
        let token;
        //console.log(req.cookies);
        if (req.cookies && req.cookies.login){
            token = req.cookies.login;
            let payload = jwt.verify(token,JWT_KEY);
            if (payload){
                const user = await studentModel.findById(payload.payload);
                const admin = await adminModel.findById(payload.payload);
                if (user)req.id = user.id;
                if (admin){req.id = admin.id;}
                next();
            }else{
                // browser - redirect to login
                const client = req.get('User-Agent');
                if (client.includes('Mozilla')==true){
                    return res.redirect('/login'); // please login
                }else{
                    res.json({
                        status:"error",
                        message:"Please retry"
                    })
                }
            }
        }else{
            res.json({
                status:"error",
                message:"please log in"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.logout = function logout(req,res){
    res.cookie('login','',{maxAge:1});
    res.json({
        status:"ok",
        message:"User log out success"
    })
}
