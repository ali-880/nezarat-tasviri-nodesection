const Teacher=(req,res,next)=>{
    if(req.user.role=='teacher'){
        next()
    }else{
        res.status(403).send('forbidden')
    }
}
module.exports=Teacher