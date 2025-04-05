import mongoose,{Schema,model,Types} from 'mongoose'


const attachmentSchema = new Schema({
    public_id : {
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true
    }
});


const schema = new Schema({

    content  : String,

    attachment : [{
        type : attachmentSchema,
    }],

    sender : {
        type : Types.ObjectId,
        ref : "User",
        required : true
    },

    chat : {    
        type : Types.ObjectId,
        ref : "Chat",
        required : true
    }

},{timestamps : true })

export const Message = mongoose.models.Message||model("Message",schema)