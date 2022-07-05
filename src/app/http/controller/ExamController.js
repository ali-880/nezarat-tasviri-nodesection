const Course = require("../../model/Course")
const Exam = require("../../model/Exam")
const User = require("../../model/User")
const lodash = require('lodash');
const fs = require('fs');
const endTime = require("../../../utils/index");

const create = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.body.course
        })
        if (course) {
            const finishTime = endTime(Number(req.body.hour), Number(req.body.min), req.body.end)
            const exam = new Exam({
                name: req.body.name,
                course: req.body.course,
                end: `${finishTime.hour}${finishTime.min}`,
                duration: req.body.end
            })
            exam.StartTime = {
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,
                hour: req.body.hour,
                min: req.body.min
            }
            await exam.save()
            await course.updateOne({
                $push: {
                    Exams: exam._id
                }
            })
            return res.send(exam)
        } else {
            res.status(500).send('e')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('e')
    }
}
const AddTextQuestion = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.body.exam
        });
        exam.Questions.push({
            text: req.body.text,
            type: 'text',
            score: req.body.score
        })
        await exam.save()
        res.send('ok')
    } catch (e) {
        res.status(500).send('e')
    }
}
const AddFileQuestion = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.body.exam
        });
        exam.Questions.push({
            text: req.body.file,
            type: 'file',
            score: req.body.score
        })
        await exam.save()
        res.send('ok')
    } catch (e) {
        res.status(500).send('e')
    }
}
const addTestQuestion = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.body.exam
        });
        const result = exam.Questions.push({
            text: req.body.text,
            type: 'test',
            score: req.body.score
        })//مشاهده امتحان اگر امتحان نبود ارور 2- ایجاد سوال باید فیلد ها دارای ولیدیشن باشند
        exam.Questions[result - 1].testResults.push({
            is_Result: true,
            text: req.body.true_ans
        })
        exam.Questions[result - 1].testResults.push({
            is_Result: false,
            text: req.body.answ1
        })
        exam.Questions[result - 1].testResults.push({
            is_Result: false,
            text: req.body.answ2
        })
        exam.Questions[result - 1].testResults.push({
            is_Result: false,
            text: req.body.answ3
        })
        exam.Questions[result - 1].testResults = lodash.shuffle(exam.Questions[result - 1].testResults)
        await exam.save()
        res.send('ok')
    } catch (e) {
        console.log(e)
        res.status(500).send('e')
    }
}
const index = async (req, res) => {
    try {
        const courses = await Course.find({
            teacher: req.user._id
        }).select('Exams').populate({
            path: 'Exams',
            select: 'name course',
            populate: {
                path: 'course',
                select: 'name'
            }
        })
        const result = []
        for (let i = 0; i < courses.length; i++) {
            result.push(...courses[i].Exams)
        }
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send('er')
    }
}
const single = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.exam_id
        }).populate({
            path: 'course',
            select: 'name'
        }).select('name Questions course end StartTime duration')
        console.log(req.params.exam_id);
        if (exam) {
            return res.send(exam)
        } else {
            return res.status(500).send('error')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('er')
    }
}
const getResults = async (req, res) => {
    try {
        const exam_find = await Exam.findOne({
            _id: req.body.exam_id
        })
        const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
        if (flag != -1) {
            const res1 = {
                q_id: req.body.index + 1,
                result: req.body.data,
                type: req.body.type
            }
            const ra = exam_find.results[flag].results.findIndex((item) => item.q_id == req.body.index + 1)
            if (ra === -1) {
                exam_find.results[flag].results.push(res1)
                await exam_find.save()
                return res.send('create')
            } else {
                exam_find.results[flag].results[ra].result = req.body.data
                await exam_find.save()
                return res.send('change')
            }
        } else {
            const ans = {
                user: req.user._id,
                results: []
            }
            console.log(ans)
            const res1 = {
                q_id: req.body.index + 1,
                result: req.body.data,
                type: req.body.type
            }
            ans.results.push(res1)
            exam_find.results.push(ans)
            await exam_find.save()
            return res.send('create')
        }

    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const getResultsFile = async (req, res) => {
    try {
        const exam_find = await Exam.findOne({
            _id: req.body.exam_id
        })
        const flag = exam_find.results.findIndex((item) => item.user == req.user._id)
        if (flag != -1) {
            const res1 = {
                q_id: Number(req.body.index) + 1,
                result: req.file.filename,
                type: req.body.type
            }
            const ra = exam_find.results[flag].results.findIndex((item) => item.q_id == Number(req.body.index) + 1)
            if (ra == -1) {
                exam_find.results[flag].results.push(res1)
                await exam_find.save()
                return res.send('create')
            } else {
                fs.unlink(`src/public/exam/${req.body.exam_id}/${exam_find.results[flag].results[ra].result}`, (err) => {
                    if (err) {
                        console.error(err)
                    }
                })
                exam_find.results[flag].results[ra].result = req.file.filename
                await exam_find.save()
                return res.send('change')
            }
        } else {
            const ans = {
                user: req.user._id,
                results: []
            }
            const res1 = {
                q_id: req.body.index + 1,
                result: req.file.filename,
                type: req.body.type
            }
            ans.results.push(res1)
            exam_find.results.push(ans)
            await exam_find.save()
            return res.send('create')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const userGetExams = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.user._id
        }).populate({
            path: 'courses',
            select: 'name Exams',
            populate: {
                path: 'Exams',
                select: 'name StartTime course end duration',
                populate: {
                    path: 'course',
                    select: 'name group',
                    populate: {
                        path: 'group',
                        select: 'name'
                    }
                }
            }
        })
        if (user) {
            const courses = user.courses;
            const exams = []
            courses.map((item) => {
                exams.push(...item.Exams)
            })
            return res.send(exams)
        } else {
            res.status(500).send(e)
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const Response = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.exam_id
        })
        if (exam) {
            const results = exam.results.findIndex((item) => item.user == req.user._id)
            if (results !== -1) {
                console.log(exam.results[results].results)
                return res.send(exam.results[results].results)
            }
        } else {
            return res.status(404).send('e')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const removeQuestion = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.exam_id
        })
        if(exam){
            exam.Questions.id(req.params.q_id).remove();
            await exam.save();
            return res.send('ok')
        }else{
            res.status(500).send(e)
        }
        
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const update = async (req, res) => {
    try {
       
            const finishTime = endTime(Number(req.body.hour), Number(req.body.min), req.body.end)
            const new_exam=await Exam.findOneAndUpdate({
                _id: req.params.exam_id
            }
            ,{
                name: req.body.name,
                duration: req.body.end,
                course: req.body.course,
                end: `${finishTime.hour}${finishTime.min}`,
                StartTime: {
                    year: req.body.year,
                    month: req.body.month,
                    day: req.body.day,
                    hour: req.body.hour,
                    min: req.body.min
                }
            },{new:true},(err,doc)=>{
                if(err){
                    return res.status(404).send('np found')
                }
            }).select('name course end duration StartTime').populate({path:'course',select:'name group',populate:{path:'group',select:'name'}})
            await new_exam.save()
            res.send(new_exam)
        
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
const getQuestionWithExamId=async(req,res)=>{
    try {
        const exam=await Exam.findOne({_id:req.params.exam_id});
        if(exam){
            return res.send(exam.Questions);
        }else{
            res.status(500).send(e)
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}
module.exports.getQuestionWithExamId=getQuestionWithExamId
module.exports.update=update
module.exports.removeQuestion = removeQuestion
module.exports.Response = Response
module.exports.userGetExams = userGetExams
module.exports.getResultsFile = getResultsFile
module.exports.getResults = getResults
module.exports.single = single
module.exports.index = index
module.exports.create = create
module.exports.AddTextQuestion = AddTextQuestion
module.exports.AddFileQuestion = AddFileQuestion
module.exports.addTestQuestion = addTestQuestion