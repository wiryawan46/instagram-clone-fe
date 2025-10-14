import React, { useContext, useEffect, useState } from "react";
import { Post } from "../../models/post.model";
import { UserContext } from "../../App";

type UserContextType = {
    state: any;
    dispatch: React.Dispatch<{ type: string; payload: any }>;
} | null;

const Profile: React.FC = () => {
    const [mypics, setPics] = useState<Post[]>([]);
    const context = useContext(UserContext) as UserContextType;
    
    // Safely access state
    const state = context?.state ?? null;

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            // Tidak ada token: jangan fetch agar tidak 401 & spam error
            setPics([]);
            return;
        }

        const ac = new AbortController();

        (async () => {
            try {
                const res = await fetch("/myposts", {
                    headers: { Authorization: `Bearer ${jwt}` },
                    signal: ac.signal,
                });

                if (!res.ok) {
                    // Bisa log atau tampilkan toast di sini
                    setPics([]);
                    return;
                }

                const result = await res.json();
                // Antisipasi bentuk data yang tidak sesuai
                const posts: Post[] = Array.isArray(result?.posts) ? result.posts : [];
                setPics(posts);
            } catch (err) {
                // Abort tidak dianggap error fatal
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    setPics([]);
                }
            }
        })();

        return () => ac.abort();
    }, []);

    return (
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
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
                        style={{ width: 160, height: 160, borderRadius: 80, objectFit: "cover" }}
                        src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                        alt="profile"
                    />
                </div>

                <div style={{ minWidth: 220 }}>
                    <h4 style={{ margin: "4px 0 8px" }}>{state?.name ?? "User"}</h4>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <h6 style={{ margin: 0 }}>{mypics.length} posts</h6>
                        <h6 style={{ margin: 0 }}>100 followers</h6>
                        <h6 style={{ margin: 0 }}>100 following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {mypics.map((item) => {
                    // Lindungi dari field yang tidak ada
                    const key = (item as any)?._id ?? crypto.randomUUID();
                    const src = (item as any)?.imageUrl ?? (item as any)?.photo ?? "";
                    const alt = item?.title ?? "post image";

                    if (!src) return null;

                    return <img key={key} className="item" src={src} alt={alt} style={{ width: "100%", objectFit: "cover" }} />;
                })}
            </div>
        </div>
    );
};

export default Profile;
