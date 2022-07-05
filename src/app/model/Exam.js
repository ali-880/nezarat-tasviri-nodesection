const mongoose = require('mongoose');   
const testResultSchema=new mongoose.Schema({
    is_Result:{
        type:Boolean,
        required:true
    },
    text:{
        type:String,
        required:true
    }
})

const QuestionSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    testResults:[{
        type:testResultSchema,
    }],
    score:{
        type:Number,
        required:true
    }
})




const userAnswersSchema=new mongoose.Schema({
    q_id:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    result:{
        type:String,
        required:true
    }
})


const resultSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Photo:[{
        type:String,
    }],

    results:[{
        type:userAnswersSchema
    }]
})

const StartTimeSchema=new mongoose.Schema({
    year:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true,
    },
    day:{
        type:String,
        required:true,
    },
    hour:{
        type:String,
        required:true,
    },
    min:{
        type:String,
        required:true
    },
})
const ExamSchema=new mongoose.Schema({
    StartTime:{
        type:StartTimeSchema,
    },
    end:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    Questions:[{
        type:QuestionSchema,
    }],
    results:[{
        type:resultSchema
    }],
})
const Exam=mongoose.model('Exam',ExamSchema)
module.exports=Exam