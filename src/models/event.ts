class Event {
    _id: String;
    title: String;
    description: String;
    city: String;
    date: Date;
    type: String;
    link: [String];
    owner: String;
    subscriber: [String];

    constructor (_id: String, title: String, description: String, city: String, date: Date, type: String, link: [String], owner: String, subscriber: [String]) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.city = city;
        this.date = date;
        this.type = type;
        this.link = link;
        this.owner = owner;
        this.subscriber = subscriber;
    }
}

export default Event