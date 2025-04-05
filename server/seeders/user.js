import { faker } from "@faker-js/faker";
import {simpleFaker} from "@faker-js/faker";


const createUser  = async(User,numUsers) => {
    try {
        
        const userPromise = [];


        for (let i = 0; i < numUsers; i++) 
        {
            const tempUser  = User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(), 
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            });

            userPromise.push(tempUser);
        }

        await Promise.all(userPromise);
        console.log(numUsers, "Users created");
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


//---------------------------------------------------------------



const createSingleChats = async(User,Chat)=>{
    
    try{

        console.log("BEFORE SINGLE CHAT")

        const users = await User.find().select("_id");

        console.log("CREATESINGLECHAT")

        const chatsPromise = [];
        for (let i=0;i<users.length;i++)
            {
            for(let j =i+1;j<users.length;j++)
                { 
                chatsPromise.push(Chat.create({
                    name:faker.lorem.words(2),  
                    member:[users[i],users[j]]
                }))
                }
            }

        await Promise.all(chatsPromise);
        console.log("HOOP")
        process.exit();  
        }
        catch(error){
            console.error(error);
            process.exit(1)
        }

    
}

//---------------------------------------------------------------
const createGroupChats = async(User,Chat,numChats)=>{
    try{

        console.log("BEFORE GROUP CHAT")

        const users = await User.find().select("_id");

        console.log("GROUPCHAT")

        const chatsPromise=[];
        for(let i=0;i<numChats;i++)
            {
                const numMembers = simpleFaker.number.int({min : 3,max:users.length});
                const members = [];
                
                for (let j=0;j<numMembers;j++)
                    {
                        const randomIndex = Math.floor(Math.random()*users.length);
                        const randomUser = users[randomIndex];

                        if(!members.includes(randomUser)){
                            members.push(randomUser);
                        }

                    }
                    const chat = Chat.create({
                        groupChat : true,
                        name:faker.lorem.words(1),
                        member:members,
                        creator : members[0]
                    })

                    chatsPromise.push(chat);

            }

            await Promise.all(chatsPromise);
            console.log("HOOLA")
            process.exit()

    }
    catch(error){
        console.error(error);
        process.exit(1)
    }
    
}


const createMessages = async(User,Chat,Message,numMessages)=>
{
    try
    {
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");

        const messagesPromise = [];

        for (let i=0;i<numMessages;i++)
            {
                const randomUser = users[Math.floor(Math.random()*users.length)];
                const randomChat = chats[Math.floor(Math.random()*chats.length)];
                
                messagesPromise.push(
                    Message.create({
                        chat:randomChat,
                        sender:randomUser,
                        content: faker.lorem.sentence()
                    })
                );
            }
            await Promise.all(messagesPromise);
            console.log("Messages created successfully")
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}


const createMessagesInAChat = async(User,Message,chatId,numMessages)=>
    {
        try
        {
            const users = await User.find().select("_id");
            const messagesPromise = [];
    
            for (let i=0;i<numMessages;i++)
                {
                    const randomUser = users[Math.floor(Math.random()*users.length)];
                    
                    messagesPromise.push(
                        Message.create({
                            chat:chatId,
                            sender:randomUser,
                            content: faker.lorem.sentence()
                        })
                    );
                }
                await Promise.all(messagesPromise);
                console.log("Messages created successfully")
        }catch(error){
            console.error(error);
            process.exit(1);
        }
    }

//----------------------------------------------------------------

export{createUser,createSingleChats,createGroupChats,createMessagesInAChat,createMessages};