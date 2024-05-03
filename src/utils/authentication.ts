class Authentication {
    constructor() {}

    isConnected (): Boolean {
        const userId = this.getUserId();
        if (userId) {
            const expirationDate = localStorage.getItem("expirationDate");
            if (expirationDate) {
                if (new Date(expirationDate) > new Date()) {
                    return true;
                }
            }
        }
        return false
    }

    getUserId (): string | null {
        const userId = localStorage.getItem("userId");
        return userId
    }
}

export default Authentication;