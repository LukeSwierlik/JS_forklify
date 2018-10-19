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

        this.persistData();

        this.likes.push(like);
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);

        this.likes.splice(index, 1);

        this.persistData();
    }

    isLiked(id) {
        return this.likes.some(element => element.id === id);
    }

    getCountLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storageLikes = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localStorage
        if(storageLikes) {
            this.likes = storageLikes;
        }
    }
}

export default Likes;