const { number } = require("joi")

const endTime=(hour,min,time)=>{
    let resultHour=0
    let resultMin=0
    if(min!=0){
        const dif=60-min
        if(time>=dif){//
            resultHour=hour+1
            time=time-dif;
            if(time>0){
                const r=Math.floor(time/60)
                if(r>0){
                    resultHour=resultHour+r
                    const rd=Math.floor(time%60)
                    resultMin=resultMin+rd
                    if(resultHour<10){
                        resultHour=`0${resultHour}`
                    }
                    if(resultMin<10){
                        resultMin=`0${resultMin}`
                    }
                    return {
                        hour:resultHour,
                        min:resultMin
                    }
                }else{//
                    resultMin=Number(resultMin)+Number(time)
                    if(resultHour<10){
                        resultHour=`0${resultHour}`
                    }
                    if(resultMin<10){
                        resultMin=`0${resultMin}`
                    }
                    return {
                        hour:resultHour,
                        min:resultMin
                    }
                }
            }else{
                if(resultHour<10){
                    resultHour=`0${resultHour}`
                }
                if(resultMin<10){
                    resultMin=`0${resultMin}`
                }
                return {
                    hour:resultHour,
                    min:resultMin
                }
            }
        }else{
            resultHour=hour
            resultMin=min+Number(time)
            if(resultHour<10){
                resultHour=`0${resultHour}`
            }
            if(resultMin<10){
                resultMin=`0${resultMin}`
            }
            return {
                hour:resultHour,
                min:resultMin
            }
        }
    }else{
        const r=Math.floor(time/60)
        if(r>0){
            resultHour=hour+r
            const rd=Math.floor(time%60)
            resultMin=resultMin+rd
            if(resultHour<10){
                resultHour=`0${resultHour}`
            }
            if(resultMin<10){
                resultMin=`0${resultMin}`
            }
            return {
                hour:resultHour,
                min:resultMin
            }
        }else{
            resultMin=resultMin+time
            resultHour=hour
            if(resultHour<10){
                resultHour=`0${resultHour}`
            }
            if(resultMin<10){
                resultMin=`0${resultMin}`
            }
            return {
                hour:resultHour,
                min:resultMin
            }
        }
    }
}
module.exports=endTime