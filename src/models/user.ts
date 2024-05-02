class User {
    _id: String;
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    role: String;
    events: [Number];

    constructor (_id: String, firstName: String, lastName: String, email: String, password: String, role: String, events: [Number]) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.events = events;
    }
}

export default User;