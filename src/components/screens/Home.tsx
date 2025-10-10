import React, {useEffect, useState} from 'react';

interface Post {
    _id: string;
    title: string;
    body: string;
    imageUrl: string,
    photo: string;
    postBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

const Home: React.FC = () => {
    const [data, setData] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get user data from localStorage to access the token
                const userString = localStorage.getItem("user")
                const token = localStorage.getItem("jwt")
                if (!userString) {
                    setError("User not authenticated")
                    setLoading(false)
                    return
                }

                const user = JSON.parse(userString)
                const response = await fetch("/posts", {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const result = await response.json()
                console.log(result)
                setData(result.posts || [])
            } catch (err) {
                console.error("Error fetching posts:", err)
                setError(err instanceof Error ? err.message : "Failed to fetch posts")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts().then(r => console.log(r))
    }, [])

    if (loading) {
        return (
            <div className="home">
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="home">
                <div className="card-panel red lighten-4">
                    <span className="red-text">Error: {error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="home">
            {data.length === 0 ? (
                <div className="card-panel grey lighten-4">
                    <span className="grey-text">No posts to display</span>
                </div>
            ) : (
                data.map((item) => (
                    <div key={item._id} className="card home-card">
                        <h5>{item.postBy?.name || 'Unknown User'}</h5>
                        <div className="card-image">
                            <img alt="post images" src={item.imageUrl}/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color: "red"}}>favorite</i>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <input type="text" placeholder="add comment"/>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Home