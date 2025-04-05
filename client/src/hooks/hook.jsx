import { Typography } from "@mui/material";
import { useEffect, useState } from "react";


const useErrors = (errors = [])=>{

    let errArr;

    useEffect(()=>{
        errArr = errors.forEach(({isError,error,fallback})=>{
            if(isError){
                if(fallback){return <fallback/>}
                else{return(<Typography> Something went wrong </Typography>)}
            }
        })
    },[errors])
    
    return errArr;
}



const useSocketEvents=(socket,handlers)=>{
    
    return (useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            socket.on(event,handler)
        })

        return ()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
                socket.off(event,handler)
            })
        }
      },[socket,handlers]))
    }

      
const useAsyncMutation = (mutationHook)=>{
    
    const[isLoading,setIsLoading] = useState(false);
    const[data,setData] = useState(null);
    const[mutate] = mutationHook();

    const executeMutation = async(message,...args)=>{
    setIsLoading(true);
    try{ 
        const res = await mutate(...args);
        if(res.data){
            console.log(res.data.message||"updated data successfully")
            setData(res.data)
        }
        }catch(error){
          console.log(error)
        }   
    finally{
        setIsLoading(false)
    }  
    }

    return [executeMutation,isLoading,data]

}

 



//const useErrors = (errors = [])=>{
//
//    useEffect(()=>{
//        errArr = errors.forEach(({isError,error,fallback})=>{
//            if(isError){
//                if(fallback) fallback();
//                else toast.error(error?.data?.message||"Something went wrong")
//            }
//        })
//    },[errors])
//}
export {useErrors,useSocketEvents,useAsyncMutation};