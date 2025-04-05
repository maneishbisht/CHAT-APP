import moment from "moment";

const  fileFormat = (url)=>{

if (typeof(url)!="string"){ return undefined}

const ext = url.split(".").pop();
const fileExt = ext.toString();

if (fileExt ==="mp4" || fileExt ==="webm"||fileExt==="ogg"){
    return "video"
}
if (fileExt ==="mp3" || fileExt ==="wav"){
    return "audio"
}
if (fileExt ==="jpg" || fileExt ==="png"|| fileExt === "jpeg"|| fileExt === "gif"){
    return "image"
}

return "file"

}

const transformImage = (url="", width = 100) =>{
    const newUrl = url?.replace("upload/",`upload/dpr_auto/w_${width}/`)
    return newUrl    //return url;
}

const getLast7Days = ()=>{
    const currentDate = moment();
    const last7Days = [];
    for (let i = 0;i<=6;i++)
        {

            const daydate = currentDate.clone().subtract(i,"days").format("MMM DD")
            last7Days.unshift(daydate);
        }
    return last7Days;
}

const getOrSaveFromStorage = ({key,value,get})=>{
    if(get){
        return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):null
    }
    else
    {
        localStorage.setItem(key,JSON.stringify(value));
    }
}

export {fileFormat,getOrSaveFromStorage,transformImage,getLast7Days};