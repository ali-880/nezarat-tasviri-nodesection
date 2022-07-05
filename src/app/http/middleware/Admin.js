const Admin=(req,res,next)=>{
    if(req.user.role==='admin'){
        next()
    }
    else{
        res.status(403).send('not admin')
    }
}
module.exports=Admin