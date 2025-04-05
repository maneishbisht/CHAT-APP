export const sampleChats = [
    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Chandler",
        _id : "1",
        groupChat : false,
        members : ["1","2"]
    },
    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Rachael",
        _id : "2",
    },
    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Ross",
        _id : "3",
        groupChat : false,
        members : ["1","2"]
    },
    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Joey",
        _id : "4",
    }
];

export const sampleUsers = [
    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Tom Doe",
        _id : "1",
    },

    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Dick Doe",
        _id : "2",
    },

    {
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "Harry Doe",
        _id : "3",
    }
];

export const sampleFriends = [];

export const sampleNotifications = [
    {
       sender : { avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "A Doe"},
        _id : "1",
    },

    {
        sender : { avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "B Doe"},
        _id : "2",
    },

    {
        sender : { avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        name : "C Doe"},
        _id : "3",
    }
];
export const SampleMessage = [{
     
    attachments : [
        {
            public_id : "ASDF",
            url : "https://www.w3schools.com/howto/img_avatar.png",
        }
     ],


     content : "Score kitna hua ",
     _id : "123",

     sender : {
        _id : "123423",
        name : "Rahul",
     },

     chat : "chatId",
     createdAt : "2024-02-12T10:41:30.630Z"

    },

    {


        attachments : [
           {
               public_id : "MNOP",
               url : "https://www.w3schools.com/howto/img_avatar.png",
           },
           {
            public_id : "MNOP",
            url : "https://www.w3schools.com/howto/img_avatar.png",
            }
        ],


        content : " 2 PUDIYA",
        _id : "456",


        sender : {
           _id : "ABCDEFGH",
           name : "Manoj",
        },

        
        chat : "Second",
        createdAt : "2023-03-12T10:41:30.630Z"
       },
       {
     
        attachments : [
            {
                public_id : "ASDF",
                url : "https://www.w3schools.com/howto/img_avatar.png",
            }
         ],
    
    
         content : "I m talking about football bro",
         _id : "123",
    
         sender : {
            _id : "123423",
            name : "Rahul",
         },
    
    
    
         chat : "chatId",
         createdAt : "2024-02-12T10:41:30.630Z"
    
        },
      
]


export const dashboardDataUsers = [
       
       { name : "Rachael",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "1",
        username : "@imRachael",
        friends : 20,
        groups: 5}
        ,
       { name : "Ross",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "2",
        username : "@imRoss",
        friends : 20,
        groups : 5
        },
       { name : "Chandler",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "3",
        username : "@imChandler",
        friends : 20,
        groups : 5},

       { name : "Joey",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "4",
        username : "@imJoey",
        friends : 20,
        groups : 5},

       { name : "Phoebe",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "5",
        username : "@imPhoebe",
        friends : 20,
        groups : 5},

       { name : "Monica",
        avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
        _id : "6",
        username : "@imMonica",
        friends : 20,
        groups : 5},
]

export const dashboardDataChats = [
        {
            name : "Rachael",
            avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            _id : "1",
            groupChat : false,
            members : [{_id : "1", avatar : ["https://www.w3schools.com/howto/img_avatar.png"] },{_id : "2", avatar : ["https://www.w3schools.com/howto/img_avatar.png"]}],
            totalMembers:"2",
            totalMessages : "10",
            creator : {
                name : "Brad",
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            }
        },
        {
            name : "Chandler",
            avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            _id : "2",
            groupChat : false,
            members : [{_id : "1", avatar : ["https://www.w3schools.com/howto/img_avatar.png"] },{_id : "2", avatar : ["https://www.w3schools.com/howto/img_avatar.png"]}],
            totalMembers:"2",
            totalMessages : "20",
            creator : {
                name : "Johnny",
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            }
        },
        {
            name : "Joey",
            avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            _id : "3",
            groupChat : false,
            members : [{_id : "1", avatar : ["https://www.w3schools.com/howto/img_avatar.png"] },{_id : "2", avatar : ["https://www.w3schools.com/howto/img_avatar.png"]}],
            totalMembers:"5",
            totalMessages : "20",
            creator : {
                name : "Angela",
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
            }
        }
]



export const dashboardMessages = [

        {
            attachment : [],
            content : "ABC",
            _id : "Sasdfasdfasfs",
            sender : {
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
                name : "Chaman"
            },
            chat:"chatId",
            groupChat : false,
            createdAt : "2024-02-12T10:41:30.630Z"
        },        
        {
            attachment : [
                {
                public_id : "adadsfas2",
                url : "https://www.w3schools.com/howto/img_avatar.png"
                }
            ],
            content : "DEF",
            _id : "asdxxxcxccx",
            sender : {
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
                name : "Naman"
            },
            chat:"nextId",
            groupChat : false,
            createdAt : "2024-02-12T10:41:30.630Z"
        },        
        {
            attachment : [{
                public_id : "adadsfas2",
                url : "https://www.w3schools.com/howto/img_avatar.png"
                }
            ],
            content : "fgf",
            _id : "7878787",
            sender : {
                avatar : ["https://www.w3schools.com/howto/img_avatar.png"],
                name : "Dhawan"
            },
            chat:"NewID",
            groupChat : false,
            createdAt : "2024-02-12T10:41:30.630Z"
        }
]

