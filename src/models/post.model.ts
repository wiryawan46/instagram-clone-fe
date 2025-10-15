export interface Comment {
    text: string;
    postedBy: {
        _id: string;
        name: string;
    };
}

export interface Post {
    _id: string;
    title: string;
    body: string;
    imageUrl: string;
    photo: string;
    likes: string[];
    comments: Comment[],
    postBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
}
