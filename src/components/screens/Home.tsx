import React from 'react';


const Home: React.FC = () => {
    return (
        <div className="home">
            <div className="card home-card">
                <h5>Nadine</h5>
                <div className="card-image">
                    <img alt="post images"
                         src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhbGxwYXBlcnxlbnwwfDB8MHx8fDA%3D"/>
                </div>
                <div className="card-content">
                    <i className="material-icons" style={{color: "red"}}>favorite</i>
                    <h6>Title</h6>
                    <p>this is amazing post</p>
                    <input type="text" placeholder="add comment"/>
                </div>
            </div>
            <div className="card home-card">
                <h5>Nadine</h5>
                <div className="card-image">
                    <img alt="post images"
                         src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhbGxwYXBlcnxlbnwwfDB8MHx8fDA%3D"/>
                </div>
                <div className="card-content">
                    <i className="material-icons" style={{color: "red"}}>favorite</i>
                    <h6>Title</h6>
                    <p>this is amazing post</p>
                    <input type="text" placeholder="add comment"/>
                </div>
            </div>
            <div className="card home-card">
                <h5>Nadine</h5>
                <div className="card-image">
                    <img alt="post images"
                         src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhbGxwYXBlcnxlbnwwfDB8MHx8fDA%3D"/>
                </div>
                <div className="card-content">
                    <i className="material-icons" style={{color: "red"}}>favorite</i>
                    <h6>Title</h6>
                    <p>this is amazing post</p>
                    <input type="text" placeholder="add comment"/>
                </div>
            </div>
        </div>
    )
}

export default Home;