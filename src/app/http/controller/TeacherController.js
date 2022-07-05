const Course = require("../../model/Course")
const Exam = require("../../model/Exam")
const User = require("../../model/User")

const handleGetCourses = async (req, res) => {
    try {
        const result = await Course.find({
            teacher: req.user._id
        }).populate({
            path: 'group',
            select: 'name'
        }).select('name group code')
        res.send(result)
    } catch (e) {
        res.status(500).send('error')
    }
}
const TeacherGetUserResponse = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.body.exam_id
        });
        if (exam) {
            const user = await User.findOne({
                studentNumber: req.body.user_id
            }).select('image name lastName')
            if (user) {
                const index = exam.results.findIndex((item) => item.user.toString() == user._id)
                if (index != -1) {
                    let javab={
                        results:exam.results[index],
                        user:user
                    }
                    return res.send(javab)
                } else {
                    return res.status(404).send('not found')
                }
            }else{
                return res.status(404).send('e')
            }
        } else {
            return res.status(500).send('er')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('er')

    }
}
module.exports.TeacherGetUserResponse = TeacherGetUserResponse
module.exports.handleGetCourses = handleGetCourses