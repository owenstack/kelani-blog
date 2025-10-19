export type Comment = {
	_id: string;
	username: string;
	comment: string;
	likes: number | null;
	dislikes: number | null;
	interactionScore: number;
	replies: number;
	likedBy: boolean;
	dislikedBy: boolean;
};
