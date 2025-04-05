import multer from "multer";

const multerUpload = multer({limits : {
    fileSize : 1024*1024*5,
}},(req,res,next)=>{
    console.log(1)
    if (!req.file){
        return next(error)
    }
    else
    {
        next();
        console.log("Successfully uploaded")
    }
});

const bigData = multer({limits : {
    fileSize : 1024*1024*50,
}},(req,res,next)=>{
    console.log(1)
    if (!req.file){     
        return next(error)
    }
    else
    {
        next();
        console.log("Successfully uploaded")
    }
})



const singleAvatar = (multerUpload.single("avatar"))

//const attachmentsMulter = multerUpload.array("files",5);

const attachmentsMulter = bigData.array("files",5)

export {singleAvatar,attachmentsMulter};