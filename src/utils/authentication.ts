class Authentication {
    constructor() {}

    isConnected (): Boolean {
        const userId = localStorage.getItem("userId");
        if (userId) {
            return true;
        }
        return false
    }
}

export default Authentication;