import crypto from "crypto";

export const generateExitToken = () => {
    return crypto.randomBytes(64).toString("hex");
}
