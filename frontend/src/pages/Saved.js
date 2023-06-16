import { useEffect, useState } from "react";
import axios from 'axios';
import ReactModal from 'react-modal';
import { isLoggedIn } from "../components/LoginChecker";

export default function Saved() {
    isLoggedIn();


    const [allposts, setAllPosts] = useState(null);
    const [color, setColor] = useState('red');

    const [upvoted, setUpvoted] = useState([]);
    const [downvoted, setDownvoted] = useState([]);

    const [stateChange, setStateChange] = useState(false);

    const [comment, setComment] = useState("");

    const [isOpened, setIsOpened] = useState(false);

    let d = localStorage.getItem('user');

    const popUpStyle = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            backgroundColor: 'transparent',
            border: 'none',
        },
    };


    const upvote = (id, d) => {
        axios({
            method: "post",
            data: {
                id: id,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/upvote",
        })
            .then(res => {
                console.log(res);
                getsavedposts();
                // setStateChange(!stateChange)
            });
    };

    const downvote = (id, d) => {
        axios({
            method: "post",
            data: {
                id: id,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/downvote",
        })
            .then(res => {
                console.log(res);
                getsavedposts();
                // setStateChange(!stateChange)
            });
    };

    const commentt = (id, d, comment) => {
        console.log(id);

        axios({
            method: "post",
            data: {
                id: id,
                uid: d,
                comment: comment
            },
            withCredentials: true,
            url: "http://localhost:4000/comment",
        })
            .then(res => {
                console.log(res);
                getsavedposts();
            })
    }


    const getsavedposts = () => {
        axios({
            method: "post",
            data: {
                id: d,
            },
            withCredentials: true,
            url: "http://localhost:4000/saved",
        })
            .then(res => {
                console.log(res);
                setAllPosts(res.data);
            });
    }

    const removeSaved = (id) => {
        axios({
            method: "post",
            data: {
                postid: id,
                user: d,
            },
            withCredentials: true,
            url: "http://localhost:4000/unsave",
        })
            .then(res => {
                console.log(res);
                getsavedposts();
            })
    }



    useEffect(() => {
        getsavedposts();
    }, []);

    let posts = allposts;

    return (
        <div>
            <h1>Saved</h1>
            {posts && posts.map((post) => (
                <div className="p-4 box-content mx-auto h-1/8 w-2/4 p-4 border-4 border-amber-700 bg-gray-800 rounded-lg shadow-lg ">
                    <div className="flex">
                        <div className="flex flex-col">
                            <form className="w-full max-w-sm">
                                <div className="w-full ml-3 p-3 bg-blue-400 rounded-lg shadow-lg">
                                    <h1 className="text-lg font-medium text-white ">{post.title}</h1>
                                </div>
                                <div className="w-full ml-3 p-3 bg-green-900 rounded-lg shadow-lg">
                                    <h1 className="text-lg font-medium text-white ">By {post.owner} in {post.subname}</h1>
                                </div>
                                <div className="ml-3 p-6 bg-transparent rounded-lg shadow-lg">
                                    <h1 className="text-lg font-medium text-white ">{post.content}</h1>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className=" w-full max-w-sm">
                        <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex">
                            <div className="flex flex-col items-center">
                                <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => upvote(post._id, d)}>
                                    Upvote
                                    <span className="ml-2">👍</span>
                                    <span>
                                        {post.upvotes.length}
                                    </span>
                                </button>
                            </div>
                            <div className="flex flex-col items-center ml-10">
                                <button className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => downvote(post._id, d)}>
                                    Downvote
                                    <span className="ml-2">👎</span>
                                    <span>
                                        {post.downvotes.length}
                                    </span>
                                </button>
                            </div>
                            <div className="flex flex-col items-center ml-10">
                                <button className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => setIsOpened(true)}>
                                    Comment 💬
                                </button>
                            </div>

                            <div className="flex flex-col items-center ml-10">
                                <button className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => removeSaved(post._id)}
                                >
                                    Remove −
                                </button>
                            </div>


                        </div>

                        <h1 className="text-lg font-medium text-white">Comments</h1>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            commentt(post._id, d, comment);
                            // setIsOpened(false);
                        }}>
                            <input
                                className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                                placeholder="Comment"
                                onChange={event => setComment(event.target.value)}
                            />
                            <button
                                className="block my-2 p-2 border border-green-600 rounded-lg w-full bg-blue-700 text-white"
                                type="submit"
                            >
                                Comment
                            </button>
                        </form>
                        {post.comments.map((comment) => (
                            <h1>{comment}</h1>
                        ))}
                    </div>
                </div>
            )
            )}
        </div>
    );
}