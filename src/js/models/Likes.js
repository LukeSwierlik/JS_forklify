class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, image_url) {
        const like = {
            id,
            title,
            publisher,
            image_url
        };

        this.likes.push(like);
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);

        return this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.some(element => element.id === id);
    }

    getCountLikes() {
        return this.likes.length;
    }
}

export default Likes;