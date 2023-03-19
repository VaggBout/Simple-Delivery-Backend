import { Types } from "mongoose";
import { WithRequired } from "./common";

interface IProduct {
    name: string;
    price: number;
    description: string;
}

interface ICategory {
    name: string;
    products: Array<IProduct>;
    store: Types.ObjectId;
}

interface IUser {
    name: string;
    address: string;
    email: string;
    type: "GUEST" | "OWNER";
    hash?: string;
    _id?: Types.ObjectId;
}

type UserDao = WithRequired<IUser, "_id">;

interface IOrder {
    user: IUser;
    products: Array<IProduct>;
    date: Date;
    totalPrice: number;
    store: Types.ObjectId;
}

interface IStore {
    name: string;
    owner: Types.ObjectId;
    status: "DRAFT" | "LIVE";
    _id?: Types.ObjectId;
}

type StoreDao = WithRequired<IStore, "_id">;

export { IProduct, ICategory, IUser, IOrder, IStore, UserDao, StoreDao };
