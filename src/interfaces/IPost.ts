export interface IPost {
    _id: any;
    postedBy: IPostedBy
    image: string;
    likes: number;
    views: number;
    description: string;
    totalAnswers: number;
    answers: [];
    tags: [];
    crop: string;
    title: string;
}

interface IPostedBy {
    name: String;
    userId: any;
}