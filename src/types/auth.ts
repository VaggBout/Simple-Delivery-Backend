import { Types } from "mongoose";

type JwtToken = {
    email: string;
    name: string;
    exp: number;
    id: Types.ObjectId;
};

export { JwtToken };
