export interface Post {
    _id: string;
    title: string;
    body: string;
    imageUrl: string;
    photo: string;
    likes: string[];
    postBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
}
