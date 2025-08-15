import "dotenv/config";
import { AccessToken } from "livekit-server-sdk";

export const createLivekitToken = (userInfo, grant) => {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set");
    }

    const at = new AccessToken(apiKey, apiSecret, userInfo);
    at.addGrant(grant);
    return at.toJwt();
};
