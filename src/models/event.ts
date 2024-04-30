class Event {
    _id: String;
    title: String;
    description: String;
    city: String;
    date: Date;
    type: String;
    users: [];

    constructor (_id: String, title: String, description: String, city: String, date: Date, type: String, users: []) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.city = city;
        this.date = date;
        this.type = type;
        this.users = users;
    }
}

export default Event