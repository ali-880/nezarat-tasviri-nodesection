// const User = require("../../model/User")
// const userValidation = require('../validator/UserValidation')
// const bcrypt = require('bcrypt')
// //register user
// var FormData = require('form-data');
// const axios = require('axios')
// const fs = require('fs')
// const imageToBase64 = require('image-to-base64');
// const jwt = require('jsonwebtoken')
// const nodemailer = require("nodemailer");
// const Exam = require("../../model/Exam")
// async function main(data) {

//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "mail.testfornodealireza.ir",
//         port: 465,
//         secure: true, // true for 465, false for other ports
//         auth: {
//             user: 'alirezahoseynigh@testfornodealireza.ir', // generated ethereal user
//             pass: '11401140ali', // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: 'alirezahoseynigh@testfornodealireza.ir', // sender address
//         to: data.email, // list of receivers
//         subject: data.subject, // Subject line
//         text: data.text, // plain text body
//         html: `<b>${data.text}</b>`, // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// const register = async (req, res) => {
//     try {
//         if (userValidation.userRegisterValidation(req.body)) {
//             fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//             return res.status(400).send(userValidation.userRegisterValidation(req.body))
//         }
//         const is_user = await User.findOne({
//             studentNumber: req.body.studentNumber
//         })
//         if (is_user) {
//             fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//             return res.status(409).send('دانشجویی با این شماره دانشجویی قبلا در سامانه ثبت شده است')
//         }
//         const salt = 10;
//         const password = await bcrypt.hash(req.body.password, salt);
//         const user = new User({
//             name: req.body.name,
//             lastName: req.body.lastName,
//             password: password,
//             studentNumber: req.body.studentNumber,
//             group: req.body.group,
//             enteringYear: req.body.enteringYear,
//             role: req.body.role,
//             image: req.file.filename
//         })
//         await user.save();
//         res.send(user)
//     } catch (e) {
//         return res.status(500).send('اشتباه از سمت سرور')
//     }
// }
// const login = async (req, res) => {
//     try {
//         const user = await User.findOne({
//             studentNumber: req.body.studentNumber
//         })
//         if (user) {
//             // if (await bcrypt.compare(req.body.password, user.password)) {
//                 const data = {
//                     _id: user._id,
//                     name: user.name,
//                     studentNumber: user.studentNumber,
//                     lastName: user.lastName,
//                     group: user.group,
//                     enteringYear: user.enteringYear,
//                     role: user.role,
//                     image: user.image,
//                     exp: new Date().getTime() + 172800000,
//                     online: false
//                 }
//                 const token = jwt.sign(data, 'projey payani karshenasi mohandesi narm afzar')
//                 res.send({
//                     status: true,
//                     token: token,
//                     user: data
//                 });
//             // } else {
//                 // return res.status(403).send('not correct password')
//             // }
//         } else {
//             console.log(e)
//             return res.status(404).send('not found')
//         }
//     } catch (e) {
//         console.log(e)
//         res.status(500).send('bad')
//     }
// }
// const getUserForGroup = async (req, res) => {
//     try {
//         const users = await User.find({
//             $and: [{
//                 role: req.body.role
//             }, {
//                 group: req.body.group
//             }, {
//                 enteringYear: req.body.enteringYear
//             }]
//         }).select('name lastName image studentNumber');
//         res.send(users);
//     } catch (e) {
//         res.status(500).send('bad error');
//     }
// }
// const destroy = async (req, res) => {
//     try {
//         await User.findByIdAndRemove({
//             _id: req.params.id
//         });
//         res.send('ok')
//     } catch (e) {
//         res.status(500).send('bad error');
//     }
// }
// const verify = (req, res) => {
//     res.send({
//         success: true
//     })
// }

// const forgetPassword = async (req, res) => {
//     try {
//         const user = await User.findOne({
//             studentNumber: req.body.studentNumber
//         });
//         if (!user) {
//             return res.status(500).send('not found user');
//         }
//         const number = Math.floor(Math.random() * 100000000);
//         console.log(number);
//         data = {
//             email: req.body.email,
//             subject: 'بازیابی رمز عبور',
//             text: `رمز عبور جدید شما برابر است با : ${number}`
//         }
//         await main(data)
//         const salt = 10;
//         const password = await bcrypt.hash(number.toString(), salt);
//         await user.updateOne({
//             password: password
//         });
//         await user.save();
//         res.send('ok')
//     } catch (e) {
//         console.log(e)
//         res.status(500).send('error')
//     }
// }
// const CheckImage = async (req, res) => {
//     try {
//         let path = '';
//         const imagePath = `${req.user._id}_${Date.now()}.png`
//         if (fs.existsSync(`src/public/examUserImage/${req.body.exam_id}`)) {
//             // cb(null, `src/public/exam/${req.body.exam_id}/`)
//             path = `src/public/examUserImage/${req.body.exam_id}/${imagePath}`
//         } else {
//             fs.mkdirSync(`src/public/examUserImage/${req.body.exam_id}`, function (err) {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     console.log('File is created successfully.');
//                 }
//             });
//             path = `src/public/examUserImage/${req.body.exam_id}/${imagePath}`
//             // cb(null, `src/public/exam/${req.body.exam_id}/`)
//         }
//         const path2 = `src/public/user/${req.body.imageUser}`
//         // to declare some path to store your converted image
//         // const path = `./ali.png`    
//         // image takes from body which you uploaded
//         const imgdata = req.body.image;
//         const imageTwo = await imageToBase64(path2)
//         const data = new FormData()
        
//         const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//         fs.writeFile(path, base64Data, 'base64', (err) => {
//             console.log(err);
//         });
//         data.append('photo1', path)
//         data.append('photo2', path2)
//         console.log('eeeeeeeee')
//         console.log('ffffff')
//         axios.post('https://face-verification2.p.rapidapi.com/FaceVerification', data, {
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded',
//                 'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com',
//                 'X-RapidAPI-Key': 'b011d180e0mshe83fc78634dc94cp199e6ejsn85ea13e7004f'
//             }
//         }).then(async(r) => {
//             console.log('first')
//             fs.appendFile('./pop.txt',JSON.stringify(r.data), (e) => {
//                 if (e) {
//                     console.log(e)
//                 }
//             })
//             // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//             // fs.writeFile(path, base64Data, 'base64', (err) => {
//             //     console.log(err);
//             // });
    
    
    
//             const exam_find = await Exam.findOne({
//                 _id: req.body.exam_id
//             })
//             const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
//             if (flag != -1) {
    
//                 exam_find.results[flag].Photo.push(imagePath)
//                 await exam_find.save()
//             } else {
//                 const Data_user = {
//                     user: req.user._id,
//                     results: [],
//                     Photo: []
//                 }
//                 Data_user.Photo.push(imagePath)
//                 exam_find.results.push(Data_user)
//                 await exam_find.save()
//             }
//             res.send(r.data.resultIndex)
//             console.log(r.data)
//         }).catch((e) => {
//             console.log(e)
//             console.log('two')
//             fs.appendFile('./pop.txt',JSON.stringify(e), (e) => {
//                 if (e) {
//                     console.log(e)
//                 }
//             })
            
//         })
//         // to convert base64 format into random filename
//         // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//         // fs.writeFile(path, base64Data, 'base64', (err) => {
//         //     console.log(err);
//         // });



//         // const exam_find = await Exam.findOne({
//         //     _id: req.body.exam_id
//         // })
//         // const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
//         // if (flag != -1) {

//         //     exam_find.results[flag].Photo.push(imagePath)
//         //     await exam_find.save()
//         // } else {
//         //     const Data_user = {
//         //         user: req.user._id,
//         //         results: [],
//         //         Photo: []
//         //     }
//         //     Data_user.Photo.push(imagePath)
//         //     exam_find.results.push(Data_user)
//         //     await exam_find.save()
//         // }
//         // res.send('ok')
//     } catch (e) {
//         console.log(e)
//         res.status(500).send('error')
//     }
// }
// module.exports.CheckImage = CheckImage
// module.exports.forgetPassword = forgetPassword;
// module.exports.verify = verify
// module.exports.destroy = destroy
// module.exports.login = login
// module.exports.getUserForGroup = getUserForGroup;
// module.exports.register = register



const User = require("../../model/User")
const userValidation = require('../validator/UserValidation')
const bcrypt = require('bcrypt')
//register user
var FormData = require('form-data');
const axios = require('axios')
const fs = require('fs')
const imageToBase64 = require('image-to-base64');
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const Exam = require("../../model/Exam")
async function main(data) {

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.testfornodealireza.ir",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'alirezahoseynigh@testfornodealireza.ir', // generated ethereal user
            pass: '11401140ali', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'alirezahoseynigh@testfornodealireza.ir', // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: `<b>${data.text}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const register = async (req, res) => {
    try {
        if (userValidation.userRegisterValidation(req.body)) {
            fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            return res.status(400).send(userValidation.userRegisterValidation(req.body))
        }
        const is_user = await User.findOne({
            studentNumber: req.body.studentNumber
        })
        if (is_user) {
            fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            return res.status(409).send('دانشجویی با این شماره دانشجویی قبلا در سامانه ثبت شده است')
        }
        const salt = 10;
        const password = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            lastName: req.body.lastName,
            password: password,
            studentNumber: req.body.studentNumber,
            group: req.body.group,
            enteringYear: req.body.enteringYear,
            role: req.body.role,
            image: req.file.filename
        })
        await user.save();
        res.send(user)
    } catch (e) {
        return res.status(500).send('اشتباه از سمت سرور')
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            studentNumber: req.body.studentNumber
        })
        if (user) {
            // if (await bcrypt.compare(req.body.password, user.password)) {
                const data = {
                    _id: user._id,
                    name: user.name,
                    studentNumber: user.studentNumber,
                    lastName: user.lastName,
                    group: user.group,
                    enteringYear: user.enteringYear,
                    role: user.role,
                    image: user.image,
                    exp: new Date().getTime() + 172800000,
                    online: false
                }
                const token = jwt.sign(data, 'projey payani karshenasi mohandesi narm afzar')
                res.send({
                    status: true,
                    token: token,
                    user: data
                });
            // } else {
                // return res.status(403).send('not correct password')
            // }
        } else {
            console.log(e)
            return res.status(404).send('not found')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('bad')
    }
}
const getUserForGroup = async (req, res) => {
    try {
        const users = await User.find({
            $and: [{
                role: req.body.role
            }, {
                group: req.body.group
            }, {
                enteringYear: req.body.enteringYear
            }]
        }).select('name lastName image studentNumber');
        res.send(users);
    } catch (e) {
        res.status(500).send('bad error');
    }
}
const destroy = async (req, res) => {
    try {
        await User.findByIdAndRemove({
            _id: req.params.id
        });
        res.send('ok')
    } catch (e) {
        res.status(500).send('bad error');
    }
}
const verify = (req, res) => {
    res.send({
        success: true
    })
}

const forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            studentNumber: req.body.studentNumber
        });
        if (!user) {
            return res.status(500).send('not found user');
        }
        const number = Math.floor(Math.random() * 100000000);
        console.log(number);
        data = {
            email: req.body.email,
            subject: 'بازیابی رمز عبور',
            text: `رمز عبور جدید شما برابر است با : ${number}`
        }
        await main(data)
        const salt = 10;
        const password = await bcrypt.hash(number.toString(), salt);
        await user.updateOne({
            password: password
        });
        await user.save();
        res.send('ok')
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
}
const CheckImage = async (req, res) => {
    try {
        let path = '';
        const imagePath = `${req.user._id}_${Date.now()}.png`
        if (fs.existsSync(`src/public/examUserImage/${req.body.exam_id}`)) {
            // cb(null, `src/public/exam/${req.body.exam_id}/`)
            path = `src/public/examUserImage/${req.body.exam_id}/${imagePath}`
        } else {
            fs.mkdirSync(`src/public/examUserImage/${req.body.exam_id}`, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('File is created successfully.');
                }
            });
            path = `src/public/examUserImage/${req.body.exam_id}/${imagePath}`
            // cb(null, `src/public/exam/${req.body.exam_id}/`)
        }
        const path2 = `src/public/user/${req.body.imageUser}`
        // to declare some path to store your converted image
        // const path = `./ali.png`    
        // image takes from body which you uploaded
        const imgdata = req.body.image;
        const imageTwo = await imageToBase64(path2)
        
        
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFile(path, base64Data, 'base64', (err) => {
            if(err){
                console.log(err)
            }else{
                const path3=`https://alirezadaneshgahsku.ir/examUserImage/${req.body.exam_id}/${imagePath}`
                const path4=`https://alirezadaneshgahsku.ir/user/${req.body.imageUser}`
                const data = new FormData()
                data.append('photo1', path3)
                data.append('photo2', path4)
                axios.post('https://face-verification2.p.rapidapi.com/FaceVerification', data, {
                headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com',
                'X-RapidAPI-Key': 'b011d180e0mshe83fc78634dc94cp199e6ejsn85ea13e7004f'
                }
                }).then(async(r) => {
                    console.log('first')
                    fs.appendFile('./pop.txt',JSON.stringify(r.data), (e) => {
                    if (e) {
                        console.log(e)
                    }
                })
                const exam_find = await Exam.findOne({
                    _id: req.body.exam_id
                })
                const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
                if (flag != -1) { 
                    exam_find.results[flag].Photo.push(imagePath)
                    await exam_find.save()
                } else {
                    const Data_user = {
                        user: req.user._id,
                        results: [],
                        Photo: []
                    }
                    Data_user.Photo.push(imagePath)
                    exam_find.results.push(Data_user)
                    await exam_find.save()
                }
                res.send(r.data.resultIndex)
                console.log(r.data)
                
            }).catch((e) => {
                console.log(e)
                res.status(500).send(e)
                console.log('two')
                fs.appendFile('./pop.txt',JSON.stringify(e), (e) => {
                    if (e) {
                        console.log(e)
                }
            })
            
        })
    }
})

            // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            // fs.writeFile(path, base64Data, 'base64', (err) => {
            //     console.log(err);
            // });
    
    
            // to convert base64 format into random filename
        // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        // fs.writeFile(path, base64Data, 'base64', (err) => {
        //     console.log(err);
        // });



        // const exam_find = await Exam.findOne({
        //     _id: req.body.exam_id
        // })
        // const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
        // if (flag != -1) {

        //     exam_find.results[flag].Photo.push(imagePath)
        //     await exam_find.save()
        // } else {
        //     const Data_user = {
        //         user: req.user._id,
        //         results: [],
        //         Photo: []
        //     }
        //     Data_user.Photo.push(imagePath)
        //     exam_find.results.push(Data_user)
        //     await exam_find.save()
        // }
        // res.send('ok')
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
}
module.exports.CheckImage = CheckImage
module.exports.forgetPassword = forgetPassword;
module.exports.verify = verify
module.exports.destroy = destroy
module.exports.login = login
module.exports.getUserForGroup = getUserForGroup;
module.exports.register = register