class booruImg {
    constructor(id, datePosted, link, isPending, isFlagged, tag_string, tag_string_chars) {
        this.id = id;
        this.datePosted = datePosted;
        this.link = link;
        this.isPending = isPending;
        this.isFlagged = isFlagged;
        this.tag_string = tag_string;
        this.tag_string_chars = tag_string_chars;
    }

    format() {
        return `${this.link}${this.id}`;
    }

    logData() {
        console.log(`ID:${this.id}|DATE:${this.datePosted}|ISPENDING:${this.isPending}|ISFLAGGED:${this.isFlagged}|\nTAGSTRING:${this.tag_string}\n|TAGSTRINGCHARS:${this.tag_string_chars}`);
    }
}

module.exports = booruImg;