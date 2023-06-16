import { useEffect, useState } from "react";
import axios from "axios";
import { isLoggedIn } from "../components/LoginChecker";

export default function SearchSubs() {
    isLoggedIn();


    const [subs, setSub] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [sorts, setSorts] = useState([]);
    const [tags, setTags] = useState([]);

    let d = localStorage.getItem('user');
    const [name, setName] = useState("");

    const joinStatus = (sub) => {
        axios({
            method: "post",
            data: {
                subname: sub,
                action: "joined"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }

    const leaveStatus = (sub) => {
        axios({
            method: "post",
            data: {
                subname: sub,
                action: "left"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }

    const visitStatus = (sub) => {
        axios({
            method: "post",
            data: {
                subname: sub,
                action: "visited"
            },
            url: "http://localhost:4000/newStat",
        })
            .then(res => {
                console.log(res);
            });
    }

    const getUser = () => {
        axios({
            method: "post",
            data: {
                id: d,
            },
            withCredentials: true,
            url: "http://localhost:4000/getuser",
        })
            .then(res => {
                setName(res.data);
            });
    }

    const imageStyle = {
        image: {
            width: '180px',
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        console.log(search);
    }
    const handleTags = (e) => {
        const tagValues = e.target.value.split(",");
        setTags(tagValues.map(tagValue => tagValue.trim()));
        console.log(tags);
        // You can now use the tags array in your search logic
    }


    const handleSorts = (event) => {
        const checkbox = event.target.value;
        if (event.target.checked) {
            // Add checked checkbox to the array
            setSorts((prevCheckedCheckboxes) => [
                ...prevCheckedCheckboxes,
                checkbox,
            ]);
        } else {
            // Remove unchecked checkbox from the array
            setSorts((prevCheckedCheckboxes) =>
                prevCheckedCheckboxes.filter((c) => c !== checkbox)
            );
        }
    };

    // const handleTags = (event) => {
    //     const checkbox = event.target.value;
    //     if (event.target.checked) {
    //         // Add checked checkbox to the array
    //         setTags((prevCheckedCheckboxes) => [
    //             ...prevCheckedCheckboxes,
    //             checkbox,
    //         ]);
    //     } else {
    //         // Remove unchecked checkbox from the array
    //         setTags((prevCheckedCheckboxes) =>
    //             prevCheckedCheckboxes.filter((c) => c !== checkbox)
    //         );
    //     }
    // }

    const searchSubs = () => {
        axios({
            method: "post",
            data: {
                subn: search,
                sorts: sorts,
                tags: tags,
            },
            withCredentials: true,
            url: "http://localhost:4000/searchsub",
        }
        ).then(res => {
            console.log(res.data);
            setSub(res.data);
            setLoading(false);
        });
    }

    const visitSub = (sub) => {
        visitStatus(sub.name);
        window.location.href = `/sub/${sub.name}`;
    }

    const joinSub = (sub) => {
        axios({
            method: "post",
            data: {
                sub: sub,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/joinRequest",
        }
        ).then(res => {
            console.log(res);
            joinStatus(sub);
        });
    }

    const leaveSub = (sub) => {
        axios({
            method: "post",
            data: {
                subn: sub,
                uid: d
            },
            withCredentials: true,
            url: "http://localhost:4000/leaveSub",
        }
        ).then(res => {
            console.log(res);
            leaveStatus(sub);
            getUser();
            searchSubs(sorts);
        });
    }



    let subreddits = subs.map((sub) => {
        return (
            <div className="p-4 box-content h-1/8 w-1/4 p-4 border-4 border-amber-700 bg-gray-800 rounded-lg shadow-lg ">
                <div className="flex">
                    <img style={imageStyle.image} src={sub.image} alt="Image" />
                    <div className="flex flex-col">
                        <form className="w-full max-w-sm">
                            <div className="ml-3 p-6 bg-blue-400 rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white ">{sub.description}</h1>
                            </div>
                            <div className="ml-3 p-6 bg-transparent rounded-lg shadow-lg">
                                <h1 className="text-lg font-medium text-white ">{sub.numMembers === 1 ? '1 Member' : `${sub.numMembers} Members`} </h1>
                                <h1 className="text-lg font-medium text-white ">{sub.numPosts} Posts</h1>
                                <h1 className="text-lg font-medium text-white ">Banned: [{sub.banned.join(", ")}]</h1>
                                <h1 className="text-lg font-medium text-white ">Tags: [{sub.tags.join(", ")}]</h1>
                                <h1 className="text-lg font-medium text-white ">Owner: {sub.owner}</h1>


                            </div>
                        </form>
                    </div>
                </div>
                <div className=" w-full max-w-sm">
                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex">
                        <h1 className="text-lg font-medium text-white ">{sub.name}</h1>
                        {console.log(sub.members)}
                        {console.log(name)}
                        {sub.members.includes(name) ?
                            <>
                                <button className="ml-10 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => visitSub(sub)}>

                                    Visit
                                </button>
                                {sub.owner === name ?
                                    <>
                                    </>
                                    :
                                    <>
                                        <button className="ml-10 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
                                            onClick={() => leaveSub(sub.name)}>
                                            Leave
                                        </button>
                                    </>
                                }
                            </>
                            :
                            <>
                                <button className="ml-10 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => joinSub(sub.name)}>
                                    Join
                                </button>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    });

    useEffect(() => {
        // console.log("az");
        getUser();
        searchSubs(sorts);
    }, [search, sorts, tags]);

    return (
        <>
            <input
                className="w-full px-4 py-2 bg-reddit-dark text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                onChange={handleSearch}
                placeholder={"Search Subreddits"}
            />
            <br />
            {/*<input*/}
            {/*    className="w-full px-4 py-2 bg-reddit-dark text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"*/}
            {/*    onChange={handleTags}*/}
            {/*    placeholder={"Search Tags"}*/}
            {/*/>*/}
            <br />


            <input id="bordered-checkbox-1" type="checkbox" value="followers" name="bordered-checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleSorts}
            />
            <label htmlFor="bordered-checkbox-1"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Followers
            </label>
            <br />



            <input id="bordered-checkbox-2" type="checkbox" value="name" name="bordered-checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleSorts}
            />
            <label htmlFor="bordered-checkbox-2"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Name
            </label>
            <br />


            <input id="bordered-checkbox-3" type="checkbox" value="date" name="bordered-checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleSorts}
            />
            <label htmlFor="bordered-checkbox-3"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Creation Date
            </label>
            <br />

            <p>Tags: {JSON.stringify(tags)}</p>
            {/*<p>Tags: {tags}</p>*/}
            <p>Sort Order: {JSON.stringify(sorts)}</p>



            {subreddits}


        </>

    )
}