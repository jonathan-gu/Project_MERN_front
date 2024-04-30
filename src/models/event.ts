class Event {
    title: String;
    description: String;
    city: String;
    date: Date;
    type: String;
    users: [];

    constructor (title: String, description: String, city: String, date: Date, type: String, users: []) {
        this.title = title;
        this.description = description;
        this.city = city;
        this.date = date;
        this.type = type;
        this.users = users;
    }
}

export default Event