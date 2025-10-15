import React, {useContext, useEffect, useState, FormEvent, ChangeEvent} from 'react';
import {Post} from '../../models/post.model';
import {UserContext} from "../../App";

type UserContextType = {
    state: any;
    dispatch: React.Dispatch<{ type: string; payload: any }>;
} | null;

type CommentTextMap = Record<string, string>; // postId -> text

const Home: React.FC = () => {
    const [data, setData] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<CommentTextMap>({});
    const context = useContext(UserContext) as UserContextType;
    const me = context?.state ?? null;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                const userString = localStorage.getItem("user");
                const token = localStorage.getItem("jwt");
                if (!userString || !token) {
                    setError("Please log in to view posts");
                    setLoading(false);
                    return;
                }

                const res = await fetch("/posts", {
                    headers: { Authorization: "Bearer " + token }
                });
                if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

                const result = await res.json();
                setData(result.posts || []);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const patchPostInState = (postId: string, updater: (old: Post) => Post) => {
        setData(prev => prev.map(p => (p._id === postId ? updater(p) : p)));
    };

    const mergeServerPost = (postId: string, serverPost: Partial<Post>) => {
        patchPostInState(postId, old => ({ ...old, ...serverPost }));
    };

    const likesPosts = async (id: string) => {
        try {
            const res = await fetch('/like-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({ postId: id })
            });
            const result = await res.json();
            if (result?.post) {
                mergeServerPost(id, result.post); // ← MERGE, bukan replace
            }
        } catch (e) {
            console.error(e);
        }
    };

    const unLikesPosts = async (id: string) => {
        try {
            const res = await fetch('/unlike-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({ postId: id })
            });
            const result = await res.json();
            if (result?.post) {
                mergeServerPost(id, result.post); // ← MERGE, bukan replace
            }
        } catch (e) {
            console.error(e);
        }
    };

    // === COMMENT HANDLERS (kunci masalahmu di sini) ===
    const handleCommentChange = (postId: string, e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setCommentText(prev => ({ ...prev, [postId]: text }));
    };

    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>, postId: string) => {
        e.preventDefault();
        const text = (commentText[postId] || "").trim();
        if (!text) return;

        // 1) Optimistic UI: langsung tampilkan komentar
        const tempId = `temp-${Date.now()}`;
        const optimisticComment = {
            _id: tempId,
            text,
            postedBy: { _id: me?._id, name: me?.name || 'You' }
        };

        patchPostInState(postId, old => ({
            ...old,
            comments: [...(old.comments || []), optimisticComment as any]
        }));

        // kosongkan input segera biar feel-nya "langsung muncul"
        setCommentText(prev => ({ ...prev, [postId]: "" }));

        try {
            // 2) Panggil API
            const res = await fetch('/comment-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({ id: postId, text })
            });

            const result = await res.json();

            // 3) Sinkronkan dengan data server (lebih aman daripada merge manual)
            if (result?.post) {
                mergeServerPost(postId, result.post); // ← MERGE
            }
        } catch (err) {
            console.error("Failed to comment:", err);
            // Rollback kalau error
            patchPostInState(postId, old => ({
                ...old,
                comments: (old.comments || []).filter(c => (c as any)._id !== tempId)
            }));
            // optionally: tampilkan toast
        }
    };

    if (loading) {
        return (
            <div className="home" style={{ padding: '20px' }}>
                <div className="progress"><div className="indeterminate"></div></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-panel" style={{ textAlign: 'center', padding: '40px' }}>
                <i className="material-icons large" style={{ color: '#9e9e9e', marginBottom: '20px' }}>photo_camera</i>
                <h5 style={{ color: '#9e9e9e' }}>No Posts Yet</h5>
                <p>When you follow people, you'll see their photos and videos here.</p>
            </div>
        );
    }

    return (
        <div className="home" style={{ padding: '20px' }}>
            {data.length === 0 ? (
                <div className="card-panel" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="material-icons large" style={{ color: '#9e9e9e', marginBottom: '20px' }}>photo_camera</i>
                    <h5 style={{ color: '#9e9e9e' }}>No Posts Yet</h5>
                    <p>When you follow people, you'll see their photos and videos here.</p>
                </div>
            ) : (
                data.map(item => (
                    <div key={item._id} className="card home-card" style={{ marginBottom: '20px' }}>
                        <h5 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #eee' }}>
                            {item.postBy?.name || 'Unknown User'}
                        </h5>

                        <div className="card-image">
                            <img
                                alt="post"
                                src={item.imageUrl || item.photo}   // ← fallback
                                style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
                            />
                        </div>

                        <div className="card-content">
                            <i className="material-icons" style={{ color: "red", cursor: 'pointer' }}>favorite</i>

                            {item.likes.includes(me?._id)
                                ? <i className="material-icons" onClick={() => unLikesPosts(item._id)}>thumb_down</i>
                                : <i className="material-icons" onClick={() => likesPosts(item._id)}>thumb_up</i>
                            }

                            <h6 style={{ marginTop: '10px' }}>{item.likes.length} likes</h6>
                            <h6 style={{ marginTop: '10px' }}>{item.title}</h6>
                            <p style={{ marginBottom: '20px' }}>{item.body}</p>

                            {item.comments?.length ? item.comments.map((c, idx) => (
                                <h6 key={c._id || `c-${idx}`}>
                                    <span style={{ fontWeight: 500 }}>{c.postedBy?.name || 'Unknown User'}</span>
                                    <span style={{ marginLeft: 5 }}>{c.text}</span>
                                </h6>
                            )) : null}

                            <form onSubmit={(e) => handleCommentSubmit(e, item._id)}>
                                <div className="input-field">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        style={{ margin: 0 }}
                                        value={commentText[item._id] || ""}
                                        onChange={(ev) => handleCommentChange(item._id, ev)}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
