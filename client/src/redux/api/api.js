import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import server from "../../constants/config";

const api = createApi(
    {
    reducerPath : "api",
    baseQuery : fetchBaseQuery({baseUrl : `${server}/`}),
    tagTypes : ["Chat","User","Message"],

    endpoints : (builder)=>({
        //-------------------------
        myChats : builder.query({
            query : ()=>({
                    url:"chat/getMyChat",
                    credentials : "include"
            }),
            providesTags : ["Chat"],
        }),
        //------------------------
      searchUser : builder.query({
            query : (name)=>({
                url : `user/search?name=${name}`,
                credentials : "include",
            }),
            provideTags : ["User"]
            }),
        //------------------------
        sendFriendRequest : builder.mutation({
            query : (userId)=>({
                url : `user/sendRequest`,
                method : "PUT",
                credentials : "include",
                body : userId
            }),
            provideTags : ["User"]
            }),
            //---------------------------
            getNotification : builder.query({
                query : ()=>({
                    url : `user/notifications`,
                    credentials : "include",
                }),
                keepUnusedDataFor : 0
                }),
                //-------------------------
            acceptFriendRequest : builder.mutation({
                    query : (data)=>({
                        url : `user/acceptRequest`,
                        method : "PUT",
                        credentials : "include",
                        body : data
                    }),
                    invalidatesTags : ["Chat"],
                    }),

                //-----------------------
                chatDetails : builder.query({
                    query : ({chatId,populate=false})=>{
                        let x=`chat/${chatId}`;
                        if(populate){
                            x+="?populate=true";
                        }   
                        
                        return {
                            url : `${x}`,
                            credentials : "include"
                        }

                    },
                    providesTags : ["Chat"]
                    }),
                    //---------------------------

                    getMessages : builder.query({

                        query : ({chatId,page})=>({
                            url : `chat/message/${chatId}?page=${page}`,
                            credentials : "include",
                        }),
                        keepUnusedDataFor : 0
                        }), 
                    //--------------------------

                    sendAttachments : builder.mutation({
                        query : (data)=>({
                            url : `chat/message`,
                            method : "POST",
                            credentials : "include",
                            body : data
                        }),
                        }),
                //-------------------------

                getMyGroups : builder.query({
                    query : ()=>({
                            url:"chat/getMyGroups",
                            credentials : "include"
                    }),
                    providesTags : ["Chat"]
                }),

                availableFriends : builder.query({
                    query : (chatId)=>{
                        let x=`user/friends`;
                        if(chatId){
                            x +=`?chatId=${chatId}`
                        }
                        return {
                            url : `${x}`,
                            credentials : "include"
                        }

                    },
                    providesTags : ["Chat"]
                    }),

                    newGroup : builder.mutation({
                        query : ({name,member})=>({
                            url : `chat/new`,
                            method : "POST",
                            credentials : "include",
                            body : {name,member}
                        }),
                        invalidatesTags:["Chat"]
                        }),

                        renameGroup : builder.mutation({
                            query : ({chatId,name})=>({
                                url : `chat/${chatId}`,
                                method : "PUT",
                                credentials : "include",
                                body : {name}
                            }),
                            invalidatesTags:["Chat"]
                            }),

                        removeGroupMember : builder.mutation({
                                query : ({chatId,userId})=>({
                                    url : `chat/removeMembers`,
                                    method : "DELETE",
                                    credentials : "include",
                                    body : {chatId,userId}
                                }),
                                invalidatesTags:["Chat"]
                                }),

                        addGroupMember : builder.mutation({
                                    query : ({members,chatId})=>({
                                        url : `chat/addMembers`,
                                        method : "PUT",
                                        credentials : "include",
                                        body : {members,chatId}
                                    }),
                                    invalidatesTags:["Chat"]
                                    }),
                        deleteChat : builder.mutation({
                                    query : (chatId)=>({
                                        url : `chat/${chatId}`,
                                        method : "DELETE",
                                        credentials : "include"
                                    }),
                                    invalidatesTags:["Chat"]
                                    }),
                        leaveGroup : builder.mutation({
                            query : (chatId)=>({
                                url : `chat/leaveGroup/${chatId}`,
                                method : "DELETE",
                                credentials : "include"
                            }),
                            invalidatesTags:["Chat"]
                            }),

                        fetchData : builder.query({
                            query : ()=>({
                                    url:"admin/stats",
                                    credentials : "include"
                            }),
                        }),
                        fetchUserData : builder.query({
                            query : ()=>({
                                    url:"admin/users",
                                    credentials : "include"
                            }),
                        }),
                        fetchChatsData : builder.query({
                            query : ()=>({
                                    url:"admin/chats",
                                    credentials : "include"
                            }),
                        }),
                        fetchMessagesData : builder.query({
                            query : ()=>({
                                    url:"admin/messages",
                                    credentials : "include"
                            }),
                        })
                    
        })
    })

export default api;
export const {useMyChatsQuery,useFetchDataQuery,useFetchChatsDataQuery,useFetchMessagesDataQuery,useFetchUserDataQuery,useLeaveGroupMutation,useDeleteChatMutation,useRemoveGroupMemberMutation,useAddGroupMemberMutation,useRenameGroupMutation,useNewGroupMutation,useAvailableFriendsQuery,useGetMyGroupsQuery,useSendAttachmentsMutation,useChatDetailsQuery,useGetMessagesQuery,useAcceptFriendRequestMutation,useGetNotificationQuery,useSendFriendRequestMutation,useLazySearchUserQuery} = api;