import { describe, expect, test, jest } from "@jest/globals";
import { Types } from "mongoose";
import * as LoginController from "../../../src/controllers/backoffice/api/login";
import * as UserService from "../../../src/services/user";
import * as StoreService from "../../../src/services/store";
import { Request, Response } from "express";

describe("Login controller", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("should add cookie and include store id in response when login is success", async () => {
        const mockAuth = jest
            .spyOn(UserService, "auth")
            .mockImplementationOnce(() =>
                Promise.resolve({
                    code: 200,
                    data: {
                        name: "test",
                        address: "test",
                        email: "test",
                        type: "OWNER",
                        _id: new Types.ObjectId(),
                    },
                })
            );

        const mockGetStoreByOwnerId = jest
            .spyOn(StoreService, "getStoreByOwnerId")
            .mockImplementationOnce(
                () =>
                    Promise.resolve({
                        data: { _id: "test-id" },
                    }) as any
            );

        const req = {
            body: {
                email: "test",
                password: "test",
            },
        } as Request;

        const res = {
            send: jest.fn(),
            status: jest.fn(),
            cookie: jest
                .fn()
                .mockImplementationOnce((name, _value, opt: any) => {
                    expect(name).toBe("token");
                    expect(opt.expires).toBeDefined();
                }),
        } as unknown as Response;

        await LoginController.post(req, res);
        expect(res.send).toHaveBeenCalledWith({ data: { _id: "test-id" } });
        expect(mockAuth).toHaveBeenCalledTimes(1);
        expect(mockGetStoreByOwnerId).toHaveBeenCalledTimes(1);
    });

    test("should respond with error when login failed", async () => {
        const mockAuth = jest
            .spyOn(UserService, "auth")
            .mockImplementationOnce(() =>
                Promise.resolve({
                    code: 400,
                    error: "test",
                })
            );

        const req = {
            body: {
                email: "test",
                password: "test",
            },
        } as Request;

        const res = {
            send: jest.fn(),
            status: jest.fn(),
        } as unknown as Response;

        await LoginController.post(req, res);
        expect(mockAuth).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(400);
        expect(res.send).toHaveBeenLastCalledWith({ error: "test" });
    });
});
