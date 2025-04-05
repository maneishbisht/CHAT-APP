
const errorMiddleware = (err,req,res)=>{
    return res.status(err.statusCode||500).json({success:false,message : err.message || "Internal Server Error"})
}

//const TryCatch = (passedFunc) => (req, res, next) => {
//    // Wrap the call to passedFunc in a promise
//    Promise.resolve()
//        .then(() => passedFunc(req, res, next))
//        .catch((error) => {
//            console.log("inside catch", next);
//            if (typeof next === 'function') {
//                return next(new ErrorHandler(error.statusCode || 500, error.message || "Internal server error"));
//            } else {
//                console.log("Hey, next is not a function");
//            }
//        });
//};


//const TryCatch = (passedFunc)=>async(req,res,next) => {
//    console.log(4);
//    console.log(next);
//    await(passedFunc(req,res,next)).catch((error) => {
//                console.log("inside catch",next)
//                return next(new ErrorHandler(error.statusCode || 500, error.message || "Internal server error"));
//    });
//};

//const TryCatch = (passedFunc)=>async(req,res,next)=>{
//    
//    try{
//        await passedFunc(req,res,next);
//    }catch(error){
//        return next(error);
//    }
//    
//}


class ErrorHandler extends Error{
    constructor (statusCode,message){
        super(message);
        this.statusCode = statusCode;
    }
}

export{errorMiddleware,ErrorHandler}//TryCatch

//----------------------------------------

//const TryCatch = (passedFunc)=>(req,res,next)=>{
    //                try   
    //                {
        //                    passedFunc(req,res,next)
        //                }
        //                catch(error)
        //                {   
            //                    next(new ErrorHandler(error.statusCode, error.message)) 
            //                }
            //            }
            //
            
            //
            //-----------------------------------------------------
            //const TryCatch = (passedFunc)=>(req,res,next)=>{
            //    //return passedFunc(req,res,next).catch((error)=>{
            //    Promise.resolve(passedFunc(req, res, next)).catch((error) => {
            //        return next(new ErrorHandler(error.statusCode || 500, error.message || "Internal server error"));
            //    });
            //};