class Video{
    constructor(title, id, ytLink){
        this.title = title;
        this.id = id;
        this.ytLink = ytLink;
    }

    format(){
        return `${this.title}\n${this.ytLink}${this.id}`;
    }
}

module.exports = Video;