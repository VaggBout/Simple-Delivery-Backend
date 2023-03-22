import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Types } from "mongoose";
import * as UserService from "../../src/services/user";
import User from "../../src/models/user";
import { UserDao } from "../../src/types/models";

describe("User service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("register", () => {
        test("should return error when email is already used", async () => {
            const mockFindOne = jest.spyOn(User, "findOne").mockImplementation(
                () =>
                    Promise.resolve({
                        name: "test",
                    }) as any
            );

            const result = await UserService.register(
                {
                    name: "test",
                    address: "test address",
                    email: "test",
                    type: "OWNER",
                },
                "test"
            );

            expect(result.error).toBe("User with email test already exists");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should return error when password is not provided and type is OWNER", async () => {
            const mockFindOne = jest
                .spyOn(User, "findOne")
                .mockImplementation(() => Promise.resolve(null) as any);

            const result = await UserService.register(
                {
                    name: "test",
                    address: "test address",
                    email: "test",
                    type: "OWNER",
                },
                null
            );

            expect(result.error).toBe("Password is mandatory");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should save user and return id when data is valid", async () => {
            const mockFindOne = jest
                .spyOn(User, "findOne")
                .mockImplementation(() => Promise.resolve(null) as any);

            const mockSave = jest
                .spyOn(User.prototype, "save")
                .mockImplementationOnce(() => Promise.resolve({ _id: 1 }));

            const result = await UserService.register(
                {
                    name: "test",
                    address: "test address",
                    email: "test",
                    type: "OWNER",
                },
                "test"
            );

            expect(result.error).toBeUndefined();
            expect(result.data).toBe(1);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockSave).toHaveBeenCalledTimes(1);
        });
    });

    describe("auth", () => {
        test("should return error when user does not exist", async () => {
            const mockFindOne = jest
                .spyOn(User, "findOne")
                .mockImplementation(() => Promise.resolve(null) as any);

            const result = await UserService.auth("test", "test");

            expect(result.error).toBe("Invalid credentials");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should return error when user is type of GUEST", async () => {
            const mockFindOne = jest
                .spyOn(User, "findOne")
                .mockImplementation(
                    () => Promise.resolve({ type: "GUEST" }) as any
                );

            const result = await UserService.auth("test", "test");

            expect(result.error).toBe("Invalid credentials");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when password and hash does not match", async () => {
            const mockFindOne = jest
                .spyOn(User, "findOne")
                .mockImplementation(
                    () =>
                        Promise.resolve({ type: "OWNER", hash: "hash" }) as any
                );

            const result = await UserService.auth("test", "test");

            expect(result.error).toBe("Invalid credentials");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });
    });

    describe("Auth token", () => {
        test("Should issue as JWT token", () => {
            const user: UserDao = {
                name: "test",
                address: "test",
                email: "test",
                type: "OWNER",
                _id: new Types.ObjectId(),
            };

            const token = UserService.generateAuthToken(user);
            expect(token).toBeDefined();
            const validatedToken = UserService.validateToken(token);
            expect(validatedToken?.id).toBe(user._id.toString());
        });
    });
});
