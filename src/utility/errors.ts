class BadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadError";
    }
}

export default {
    BadError
}