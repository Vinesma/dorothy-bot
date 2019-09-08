class Video{
    constructor(id, title, datePosted ,link){
        this.id = id;
        this.title = title;
        this.datePosted = datePosted;
        this.link = link;
    }

    format(){ 
        return `${this.title}\n${this.link}${this.id}`;
    } //formats data into a discord friendly string

    logData(){
        console.log(`VIDEOTITLE:${this.title}|ID:${this.id}|DATE:${this.datePosted}`);
    }
}

module.exports = Video;