import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import ReactModal from 'react-modal';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { isLoggedIn } from "../components/LoginChecker";


export default function AllSubs() {
    isLoggedIn();

    let d = localStorage.getItem('user');
    const navigator = useNavigate();

    const popUpStyle = {
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
        }
    };
    const imageStyle = {
        image: {
            width: '180px',
        }
    }


    const { subname } = useParams();
    const [allSubs, setAllSubs] = useState([]);

    const [illegalPage, setIllegalPage] = useState(true);

    const [isOpened, setIsOpened] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [uname, setUname] = useState("");

    const [allPosts, setAllPosts] = useState([]);

    const [color, setColor] = useState('red');

    const [upvoted, setUpvoted] = useState([]);
    const [downvoted, setDownvoted] = useState([]);

    const [comment, setComment] = useState();

    const [report, setReport] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const [stateChange, setStateChange] = useState(false);

    const [page, setPage] = useState(1);

    useEffect(() => {
        if (title === '' || content === '') {
            setColor('red');
        }
        else setColor('green');
    }, [title, content]);


    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        setImage(await convertToBase64(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    const isClicked = () => {
        setIsOpened(true);
    }

    const postStatus = (sub) => {
        axios({
            method: "post",
            data: {
                subname: sub,
                action: "posted"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }
    const reportStatus = (sub) => {
        axios({
            method: "post",
            data: {
                subname: sub,
                action: "reported"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }


    const getAllsubs = () => {
        axios({
            method: "get",
            withCredentials: true,
            url: "http://localhost:4000/getallsub"
        })
            .then(
                res => {
                    setAllSubs(res);
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].name === subname) {
                            setIllegalPage(false);
                            break;
                        }
                    }
                }
            )
    }

    const createPost = () => {
        console.log(subname);
        axios({
            method: "post",
            data: {
                id: d,
                title: title,
                subn: subname,
                content: content,
                owner: uname,
                image: image
            },
            withCredentials: true,
            url: "http://localhost:4000/post",
        })
            .then(
                res => {
                    console.log(res)
                    postStatus(subname);
                    getAllPosts();
                    setIsOpened(false);
                })
        // window.location.reload();
    }


    const getAllPosts = () => {
        console.log(subname);
        axios({
            method: "post",
            data: {
                subn: subname,
                page: 1
            },
            withCredentials: true,
            url: "http://localhost:4000/getposts"
        })
            .then(
                res => {
                    console.log(res.data);
                    setAllPosts(res.data);
                    // if(allPosts){
                    //     setAllPosts(allPosts.concat(res));
                    // }
                });
    }
    // const [nextPosts,setNextPosts] = useState([]);
    const getnPosts = () => {
        console.log(subname);
        axios({
            method: "post",
            data: {
                subn: subname,
                page: page
            },
            withCredentials: true,
            url: "http://localhost:4000/getnextpost"
        })
            .then(
                res => {
                    console.log(res);
                    setAllPosts(allPosts.concat(res.data));
                    // setAllPosts([...allPosts, ...res]);
                    console.log(allPosts);
                    // getAllPosts();
                });
    }



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
                getAllPosts();
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
                getAllPosts();
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
                getAllPosts();
            })
    }

    const savePost = (id, d) => {
        axios({
            method: "post",
            data: {
                id: id,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/savepost",
        })
            .then(res => {
                console.log(res);
                getAllPosts();
            })
    }

    const reportPost = (id, d) => {
        axios({
            method: "post",
            data: {
                id: id,
                subname: subname,
                report: reportReason,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/createreport",
        })
            .then(res => {
                console.log(res);
                reportStatus(subname);
                getAllPosts();
            })
    }

    const followUser = (id, d) => {
        axios({
            method: "post",
            data: {
                id: id,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/followuser",
        })
            .then(res => {
                console.log(res);
                getAllPosts();
            })
    }

    const checkifJoined = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/checkifjoined",
        })
            .then(res => {
                console.log(res);
                if (res.data === false) {
                    navigator("..");
                }
            })
    }
    const [sub, setSub] = useState();
    const getPic = () => {
        axios({
            method: "post",
            data: {
                subname: subname,
            },
            withCredentials: true,
            url: "http://localhost:4000/getsubpic",
        })
            .then(res => {
                console.log(res);
                setSub(res.data);
            })
    }


    useEffect(() => {
        // console.clear();
        checkifJoined();
        getAllsubs();
    }, []);

    useEffect(() => {
        // console.clear();
        getAllPosts();
    }, [stateChange]);

    useEffect(() => {
        if (page > 1) {
            console.log("here")
            getnPosts();
        }
    }, [page]);

    useEffect(() => {
        getPic();
    }, []);


    useBottomScrollListener(() => {
        setPage(page + 1);
    });



    let posts = allPosts
    return (
        <div>
            {illegalPage ?
                <div>
                    <h1 >Illegal page</h1>
                </div>
                :
                <div>
                    <h1>Sub page for: {subname}</h1>
                    <img style={imageStyle.image} src={sub} alt="Image" /><img />
                    {/*<h1>page: {page}</h1>*/}
                    <div className="flex flex-col">
                        <button className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-blue-500 text-black mr-auto" onClick={isClicked}>New Post</button>

                        <ReactModal
                            isOpen={isOpened}
                            onRequestClose={() => setIsOpened(false)}
                            style={popUpStyle}
                        >
                            <div className="p-6  bg-gray-800 rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white">New Post</h1>
                                <input
                                    className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                                    placeholder="Title"
                                    onChange={event => setTitle(event.target.value)}
                                />

                                <input
                                    className="block my-2 p-2 border border-gray-600 rounded-lg w-full
                                 h-64 bg-gray-700 text-white"
                                    placeholder="Description"
                                    onChange={event => setContent(event.target.value)}
                                />
                                <button className={`block my-2 p-2 w-full rounded-lg bg-${title === '' || content === '' ? 'red-500' : 'green-500'} text-white font-medium`}
                                    style={{ backgroundColor: color }}
                                    disabled={title === '' || content === ''}
                                    onClick={createPost}
                                >
                                    Create
                                </button>
                            </div>

                        </ReactModal>


                        {posts && posts.map((post) => (
                            <div className="p-4 box-content mx-auto h-1/8 w-2/4 p-4 border-4 border-amber-700 bg-gray-800 rounded-lg shadow-lg ">
                                <div className="flex">
                                    <div className="flex flex-col">
                                        <form className="w-full max-w-sm">
                                            <div className="w-full ml-3 p-3 bg-blue-400 rounded-lg shadow-lg">
                                                <h1 className="text-lg font-medium text-white ">{post.title}</h1>
                                            </div>
                                            <div className="ml-3 p-6 bg-transparent rounded-lg shadow-lg">
                                                <h1 className="text-lg font-medium text-white ">{post.content}</h1>
                                            </div>
                                            <div className="w-full ml-3 p-3 bg-green-900 rounded-lg shadow-lg">
                                                <h1 className="text-lg font-medium text-white ">By {post.owner}</h1>
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
                                            <button className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-full"
                                                onClick={() => followUser(post._id, d)}>
                                                Follow 👤
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-center ml-10">
                                            <button className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-full"
                                                onClick={() => savePost(post._id, d)}
                                            >
                                                Save 📌
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-center ml-10">
                                            <button className="bg-pink-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-full"
                                                onClick={() => setReport(!report)}
                                            >
                                                Report 🚨
                                            </button>
                                        </div>
                                    </div>


                                    <h1 className="text-lg font-medium text-white">Comments</h1>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        commentt(post._id, d, comment);
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
                                    {
                                        report && (
                                            <div>
                                                <input
                                                    className="block my-2 p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                                                    onChange={event => setReportReason(event.target.value)}
                                                    placeholder="Reason"
                                                />
                                                <button className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded-full"
                                                    onClick={() => reportPost(post._id, d)}
                                                >
                                                    Report Post
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}


                    </div>
                </div>
            }
        </div>
    )
}


