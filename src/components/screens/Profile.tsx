import React from "react";

const Profile: React.FC = () => {
    return (
        <div style={{maxWidth: "550px", margin: "0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}}
                         src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                         alt="person images"
                    />
                </div>
                <div>
                    <h4>Dina Mardina</h4>
                    <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                        <h6>100 posts</h6>
                        <h6>100 followers</h6>
                        <h6>100 following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
                <img className="item"
                     src="https://images.unsplash.com/photo-1564463836146-4e30522c2984?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxwZXJzb258ZW58MHx8MHx8fDA%3D"
                     alt="images"
                />
            </div>
        </div>
    )
}

export default Profile