import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";
import ReactModal from 'react-modal';
import { isLoggedIn } from "../components/LoginChecker";


export default function Mysub() {
    isLoggedIn();

    const [isOpened, setIsOpened] = useState(false);
    let base64 = '';

    const [uname, setUname] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [banned, setBanned] = useState([]);

    const [bannedInput, setBannedInput] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [members, setMembers] = useState([]);

    const [image, setImage] = useState("");
    const [postImage, setPostImage] = useState({ myFile: "" });

    let d = localStorage.getItem('user');

    const [color, setColor] = useState('red');
    const [subs, setSubs] = useState([]);

    const popUpStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '40%',
            backgroundColor: 'transparent',
            border: 'none',
        }
    };
    const imageStyle = {
        image: {
            width: '180px',
        }
    }

    const isClicked = () => {
        setIsOpened(true);
    }

    useEffect(() => {
        if (name === '' || description === '') {
            setColor('red');
        }
        else setColor('green');
    }, [name, description]);

    // useEffect(() => {
    //     // setImage(base64);
    //     // console.log(image);
    // });

    const createSubreddit = async () => {
        await getNamebyid();
        // addBanned();
        console.log(name);
        console.log("image  " + image);
        axios({
            method: "post",
            data: {
                id: d,
                name: name,
                owner: uname,
                image: image,
                description: description,
                banned: bannedInput.split(','),
                tags: tagsInput.split(','),
            },
            withCredentials: true,
            url: "http://localhost:4000/createsub",
        })
            .then(res => console.log(res))
        window.location.reload();

    };

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
    const getNamebyid = async () => {
        await axios({
            method: "post",
            data: {
                id: d,
            },
            withCredentials: true,
            url: "http://localhost:4000/name",
        })
            .then(res => {
                if (res !== null) {
                    setSubs(res.data);
                }
                console.log(res.data.username);
                setUname(res.data.username);
            })
    };

    const getSubreddit = async () => {
        console.log(d);
        await axios({
            method: "post",
            data: {
                id: d,
                owner: uname,
            },
            withCredentials: true,
            url: "http://localhost:4000/getsub",
        }).then(res => {
            setSubs(res.data);
            console.log("res data" + res.data)
            console.log("subs data" + subs)
        })
    };

    const deleteSubreddit = async (sub) => {
        await axios({
            method: "post",
            data: {
                name: sub.name,
            },
            withCredentials: true,
            url: "http://localhost:4000/deletesub",
        }).then(res => {
            console.log(res);
        })
        window.location.reload();

    }

    let subreddits = subs.map((sub) => {
        return (
            <div className="p-4 box-content h-1/8 w-1/4 p-4 border-4 border-amber-700 bg-gray-800 rounded-lg shadow-lg ">
                <div className="flex">
                    <img style={imageStyle.image} src={sub.image} alt="Image" /><img />
                    <div className="flex flex-col">
                        <form className="w-full max-w-sm">
                            <div className="ml-3 p-6 bg-blue-400 rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white ">{sub.description}</h1>
                            </div>
                            <div className="ml-3 p-6 bg-transparent rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white ">{sub.numMembers === 1 ? '1 Member' : `${sub.numMembers} Members`} </h1>
                                <h1 className="text-lg font-medium text-white ">{sub.numPosts} Posts</h1>
                                <h1 className="text-lg font-medium text-white ">Banned: [{sub.banned.join(", ")}]</h1>
                            </div>
                        </form>
                    </div>
                </div>
                <div className=" w-full max-w-sm">
                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex">
                        <h1 className="text-lg font-medium text-white ">{sub.name}</h1>
                        <button className="ml-10 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => window.location.href = `/sub/${sub.name}`}
                        >

                            Visit
                        </button>

                        <button className="ml-4 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => deleteSubreddit(sub)}
                        >
                            Delete
                        </button>


                        <button className="ml-4 bg-black hover:bg-black text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => window.location.href = `/sub/mod/${sub.name}`}
                        >
                            Mod
                        </button>
                    </div>
                </div>
            </div>
        )
    });

    useEffect(() => {
        getSubreddit();
    }, []);

    return (
        <>
            <button className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-blue-500 text-black mr-auto" onClick={isClicked}>Create New Greddit</button>
            <ReactModal
                isOpen={isOpened}
                onRequestClose={() => setIsOpened(false)}
                style={popUpStyle}
            >

                <div className="p-6  bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-lg font-medium text-white">Create New Greddit</h1>
                    <input
                        className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                        placeholder="Name"
                        onChange={event => setName(event.target.value)}
                    />

                    <input
                        className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                        placeholder="Description"
                        onChange={event => setDescription(event.target.value)}
                    />

                    <input
                        className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                        placeholder="Banned Words"
                        onChange={event => setBannedInput(event.target.value)}
                    />

                    <input
                        className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                        placeholder="Banned Words"
                        onChange={event => setTagsInput(event.target.value)}
                    />

                    <form onSubmit={handleSubmit}>
                        <p className="ml-2">Upload Image</p>
                        <input
                            className="block my-2 p-2 border border-gray-600 rounded-lg w-50 bg-gray-700 text-white"
                            type="file"
                            placeholder="Image"
                            accept='./jpeg, ./png, ./jpg'
                            onChange={event => handleFileUpload(event)}
                        />
                    </form>
                    <button className={`block my-2 p-2 w-full rounded-lg bg-${name === '' || image === ''
                        || description === '' ? 'red-500' : 'green-500'} text-white font-medium`}
                        style={{ backgroundColor: color }}
                        disabled={name === '' || description === ''}
                        onClick={createSubreddit}
                    >
                        Create
                    </button>
                </div>

            </ReactModal>
            {subreddits}

        </>

    )

}
