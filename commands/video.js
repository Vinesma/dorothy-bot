class Video{
    constructor(title, id, datePosted ,ytLink){
        this.title = title;
        this.id = id;
        this.datePosted = datePosted;
        this.ytLink = ytLink;
    }

    format(){ 
        return `${this.title}\n${this.ytLink}${this.id}`;
    } //formats data into a discord friendly string
}

module.exports = Video;