import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";
import ReactModal from 'react-modal';
import { isLoggedIn } from "../components/LoginChecker";

export default function Chat() {
    isLoggedIn();

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');

    async function renderChatMessages(chatData, u1, u2) {
        console.log(chatData);
        let res = await axios({
            method: "post",
            data: {
                id: u2
            },
            withCredentials: true,
            url: "http://localhost:4000/getid"
        });
        u2 = res.data;
        console.log(u1 + " " + u2);
        const conversation = chatData.find(chat => {
            return (
                (chat.u1 === u1 && chat.u2 === u2) ||
                (chat.u1 === u2 && chat.u2 === u1)
            );
        });

        // If the conversation doesn't exist, return an empty array of messages
        if (!conversation) {
            console.log("Nothing");
            return [];
        }

        // Otherwise, return the messages for the conversation
        setChats(conversation.messages)
        console.log(conversation.messages);
        // return conversation.messages;
    }


    let d = localStorage.getItem('user');

    const getFollowers = () => {
        axios({
            method: "post",
            data: {
                id: d
            },
            withCredentials: true,
            url: "http://localhost:4000/getFollowers",
        })
            .then(res => {
                if (res != null) {
                    setFollowers(res.data);
                }
            })
    }

    const getFollowing = () => {
        axios({
            method: "post",
            data: {
                id: d
            },
            withCredentials: true,
            url: "http://localhost:4000/getFollowing",
        })
            .then(res => {
                if (res != null) {
                    setFollowing(res.data);
                }
            })
    }

    const getChats = () => {
        axios({
            method: "post",
            data: {
                u1: d,
                u2: selectedUser
            },
            withCredentials: true,
            url: "http://localhost:4000/getChats",
        })
            .then(res => {
                if (res != null) {
                    // setChats(renderChatMessages(res.data, d, selectedUser))
                    // setChats(res.data);
                    renderChatMessages(res.data, d, selectedUser)
                }
            })
    }

    const sendMessage = () => {
        axios({
            method: "post",
            data: {
                u1: d,
                u2: selectedUser,
                message: message
            },
            withCredentials: true,
            url: "http://localhost:4000/sendMessage",
        })
            .then(res => {
                if (res != null) {
                    getChats();
                    console.log(res)
                }
                console.log("here")
            })
    }

    const handleOpenModal = (user) => {
        setSelectedUser(user)
        getChats();
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const commonUsers = followers.filter((follower) =>
        following.includes(follower)
    );

    let userList = commonUsers.map((user) => {
        return (
            <>
                <div className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-amber-100 text-black">
                    {user}
                </div>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleOpenModal(user)}>
                    Message
                </button>

            </>
        );
    });

    //
    setTimeout(() => {
        getChats();
    }, 2000);




    useEffect(() => {
        getFollowers();
    }, []);
    useEffect(() => {
        getFollowing();
    }, []);



    return (
        <div class="flex justify-center items-center">
            <div class="w-2/3 md:w-1/2 lg:w-1/3 bg-gray-800 rounded-lg shadow-lg">
                <h1 class="text-2xl font-medium text-white p-6 border-b border-gray-700">Mutual Users</h1>
                <ul class="divide-y divide-gray-700">
                    {userList}
                </ul>
            </div>

            <ReactModal isOpen={showModal} onRequestClose={handleCloseModal}>
                <div class="w-2/3 md:w-1/2 lg:w-1/3 bg-gray-800 rounded-lg shadow-lg p-6">
                    <h1 class="text-2xl font-medium text-white mb-4">Chats</h1>
                    <div class="overflow-y-auto max-h-64">
                        {chats.map((chat) => (
                            <div key={chat.id} class="mb-2">
                                <p class="text-sm font-medium">
                                    {chat.sender === d ? "You: " : "Them: "}
                                    <span class="text-gray-400">{chat.message}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <div class="flex mt-4">
                        <input class="flex-grow bg-gray-700 text-white rounded-lg py-2 px-3 mr-2"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            placeholder="Type a message"
                        />
                        <button class="bg-pink-400 rounded-lg py-2 px-3 text-white"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                    <button class="mt-4 bg-gray-700 rounded-lg py-2 px-3 text-white"
                        onClick={handleCloseModal}
                    >
                        Close
                    </button>
                </div>
            </ReactModal>
        </div>

    );
}