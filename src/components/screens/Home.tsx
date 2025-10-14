import React, {useContext, useEffect, useState} from 'react';
import {Post} from '../../models/post.model';
import {UserContext} from "../../App";

type UserContextType = {
    state: any;
    dispatch: React.Dispatch<{ type: string; payload: any }>;
} | null;

const Home: React.FC = () => {
    const [data, setData] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const context = useContext(UserContext) as UserContextType;

    // Safely access state
    const state = context?.state ?? null;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError(null)

                const userString = localStorage.getItem("user")
                const token = localStorage.getItem("jwt")
                if (!userString || !token) {
                    setError("Please log in to view posts")
                    setLoading(false)
                    return
                }

                const response = await fetch("/posts", {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch posts: ${response.status}`)
                }

                const result = await response.json()
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

    const likesPosts = async (id: string) => {
        fetch('/like-post', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === id) {
                        return {...item, ...result.post}  // Merges updated fields while preserving original structure
                    } else {
                        return item
                    }
                })
                setData(newData || [])
            })
    }

    const unLikesPosts = async (id: string) => {
        fetch('/unlike-post', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === id) {
                        return {...item, ...result.post}  // Merges updated fields while preserving original structure
                    } else {
                        return item
                    }
                })
                setData(newData || [])
            })
    }

    if (loading) {
        return (
            <div className="home" style={{padding: '20px'}}>
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card-panel" style={{textAlign: 'center', padding: '40px'}}>
                <i className="material-icons large" style={{color: '#9e9e9e', marginBottom: '20px'}}>photo_camera</i>
                <h5 style={{color: '#9e9e9e'}}>No Posts Yet</h5>
                <p>When you follow people, you'll see their photos and videos here.</p>
            </div>
        )
    }

    return (
        <div className="home" style={{padding: '20px'}}>
            {data.length === 0 ? (
                <div className="card-panel" style={{textAlign: 'center', padding: '40px'}}>
                    <i className="material-icons large"
                       style={{color: '#9e9e9e', marginBottom: '20px'}}>photo_camera</i>
                    <h5 style={{color: '#9e9e9e'}}>No Posts Yet</h5>
                    <p>When you follow people, you'll see their photos and videos here.</p>
                </div>
            ) : (
                data.map((item) => (
                    <div key={item._id} className="card home-card" style={{marginBottom: '20px'}}>
                        <h5 style={{padding: '15px', margin: 0, borderBottom: '1px solid #eee'}}>
                            {item.postBy?.name || 'Unknown User'}
                        </h5>
                        <div className="card-image">
                            <img
                                alt="post"
                                src={item.imageUrl}
                                style={{width: '100%', maxHeight: '600px', objectFit: 'contain'}}
                            />
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color: "red", cursor: 'pointer'}}>favorite</i>
                            {item.likes.includes(state._id)
                                ? <i className="material-icons"
                                     onClick={() => unLikesPosts(item._id)}
                                >thumb_down</i>
                                : <i className="material-icons"
                                     onClick={() => likesPosts(item._id)}
                                >thumb_up</i>
                            }
                            <h6 style={{marginTop: '10px'}}>{item.likes.length} likes</h6>
                            <h6 style={{marginTop: '10px'}}>{item.title}</h6>
                            <p style={{marginBottom: '20px'}}>{item.body}</p>
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    style={{margin: 0}}
                                />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Home