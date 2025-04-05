const getOtherMember = (members,userId)=>{
    return (members.find((member)=>member._id.toString()!==userId.toString()))
}

const getSockets = (users,userSocketIds)=>{
    const sockets = users.map((user)=>userSocketIds.get(user.toString()))
    return sockets;
}

const getBase64 = (file)=> `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export {getBase64,getOtherMember,getSockets}