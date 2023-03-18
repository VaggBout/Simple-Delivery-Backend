import { Schema } from "mongoose";

interface IProduct {
    name: string;
    price: number;
    description: string;
}

interface ICategory {
    name: string;
    products: Array<IProduct>;
    store: Schema.Types.ObjectId;
}

interface IUser {
    name: string;
    address: string;
    email: string;
    type: "GUEST" | "OWNER";
    hash?: string;
}

interface IOrder {
    user: IUser;
    products: Array<IProduct>;
    date: Date;
    totalPrice: number;
    store: Schema.Types.ObjectId;
}

interface IStore {
    name: string;
    owner: Schema.Types.ObjectId;
    status: "DRAFT" | "LIVE";
}

export { IProduct, ICategory, IUser, IOrder, IStore };
