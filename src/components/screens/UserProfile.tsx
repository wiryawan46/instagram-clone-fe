import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Post} from "../../models/post.model";
import {User} from "../../models/user.model";

// Add this interface at the top of the file, after the imports
interface UserProfileResponse {
    success: boolean;
    user: User;
    posts: Post[]; // You might want to create a proper Post interface later
}

const UserProfile: React.FC = () => {
    const [res, setResult] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const {userId} = useParams()

    // Safely access state

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            // Tidak ada token: jangan fetch agar tidak 401 & spam error
            console.error("Could not find token");
            setResult(null)
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`/user/${userId}`, {
                    headers: {Authorization: `Bearer ${jwt}`},
                });

                if (!res.ok) {
                    setResult(null);
                    console.log(res)
                    return;
                }

                const result = await res.json();
                console.log(result);
                setResult(result);
            } catch (err) {
                console.log(err)
                // Only set error if it's not an abort error
                if (err instanceof DOMException && err.name === 'AbortError') {
                    console.log('Request was aborted');
                    return;
                }
                console.error('Fetch error:', err);
                setResult(null);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
        }
    }, [userId]);


    if (loading) {
        return (
            <div className="home" style={{padding: '20px'}}>
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        );
    }


    return (
        <div style={{maxWidth: "550px", margin: "0 auto"}}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0",
                    borderBottom: "1px solid grey",
                    paddingBottom: 12,
                }}
            >
                <div>
                    <img
                        style={{width: 160, height: 160, borderRadius: 80, objectFit: "cover"}}
                        src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                        alt="profile"
                    />
                </div>

                <div style={{minWidth: 220}}>
                    <h4 style={{margin: "4px 0 8px"}}>{res?.user?.name ?? "User"}</h4>
                    <h5 style={{margin: "4px 0 8px"}}>{res?.user?.email ?? "no email"}</h5>
                    <div style={{display: "flex", gap: 16, flexWrap: "wrap"}}>
                        <h6 style={{margin: 0}}>{res?.posts?.length ?? 0}posts</h6>
                        <h6 style={{margin: 0}}>100 followers</h6>
                        <h6 style={{margin: 0}}>100 following</h6>
                    </div>
                </div>
            </div>


            {res?.posts && res.posts.length > 0 ? (
                <div
                    className="gallery"
                    style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8}}
                >
                    {res.posts.map((item) => {
                        const key = (item as any)?._id ?? crypto.randomUUID();
                        const src = (item as any)?.imageUrl ?? (item as any)?.photo ?? "";
                        const alt = item?.title ?? "post image";

                        if (!src) return null;

                        return (
                            <img
                                key={key}
                                className="item"
                                src={src}
                                alt={alt}
                                style={{width: "100%", objectFit: "cover"}}
                            />
                        );
                    })}
                </div>
            ) : (
                <div
                    className="card-panel"
                    style={{textAlign: "center", padding: "40px"}}
                >
                    <i
                        className="material-icons large"
                        style={{color: "#9e9e9e", marginBottom: "20px"}}
                    >
                        photo_camera
                    </i>
                    <h5 style={{color: "#9e9e9e"}}>No Posts Yet</h5>
                    <p>When you follow people, you'll see their photos and videos here.</p>
                </div>
            )}
        </div>
    )
};

export default UserProfile;
