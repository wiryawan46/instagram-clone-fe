import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            M.toast({ html: "Please select a file first!", classes: "#c62828 red darken-3" });
            return;
        }
        if (!title || !body) {
            M.toast({ html: "Title and body are required!", classes: "#c62828 red darken-3" });
            return;
        }

        setLoading(true);
        try {
            // 1. Upload file
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("File upload failed");
            const uploadData = await uploadRes.json();

            // 2. Create post pakai url hasil upload
            const postRes = await fetch("/create-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: uploadData.fileName,
                }),
            });

            const postData = await postRes.json();

            if (postData.error) {
                M.toast({ html: postData.error, classes: "#c62828 red darken-3" });
            } else {
                M.toast({ html: postData.message, classes: "#43a047 green darken-1" });
                navigate("/");
            }
        } catch (err) {
            console.error("Error:", err);
            M.toast({ html: "Something went wrong", classes: "#c62828 red darken-3" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="card input-field"
            style={{ margin: "10px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}
        >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input"
                    />
                </div>
                <div className="file-path-wrapper">
                    <input
                        className="file-path validate"
                        type="text"
                        value={file?.name || ""}
                        placeholder="Choose an image to upload"
                        readOnly
                    />
                </div>
            </div>
            <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Posting..." : "Post"}
            </button>
        </div>
    );
};

export default CreatePost;
