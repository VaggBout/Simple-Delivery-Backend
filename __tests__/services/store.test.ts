import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Types } from "mongoose";
import * as StoreService from "../../src/services/store";
import Store from "../../src/models/store";
import User from "../../src/models/user";
import Category from "../../src/models/category";

describe("Store service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("create", () => {
        test("Should return error when store already exists", async () => {
            const mockFindOne = jest
                .spyOn(Store, "findOne")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            name: "test",
                        }) as any
                );

            const result = await StoreService.create({
                name: "test",
                owner: new Types.ObjectId(),
                status: "DRAFT",
            });

            expect(result.error).toBe("Store with name test already exists");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when user does not exist", async () => {
            const mockFindOne = jest
                .spyOn(Store, "findOne")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const mockFindById = jest
                .spyOn(User, "findById")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const result = await StoreService.create({
                name: "test",
                owner: new Types.ObjectId(),
                status: "DRAFT",
            });

            expect(result.error).toBe("Invalid user");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFindById).toHaveBeenCalledTimes(1);
        });

        test("Should create new store when data is valid", async () => {
            const mockFindOne = jest
                .spyOn(Store, "findOne")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const mockFindById = jest
                .spyOn(User, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            name: "test",
                        }) as any
                );

            const mockSave = jest
                .spyOn(Store.prototype, "save")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            _id: "test",
                        }) as any
                );

            const result = await StoreService.create({
                name: "test",
                owner: new Types.ObjectId(),
                status: "DRAFT",
            });

            expect(result.error).toBeUndefined();
            expect(result.data).toBe("test");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFindById).toHaveBeenCalledTimes(1);
            expect(mockSave).toHaveBeenCalledTimes(1);
        });
    });

    describe("Publish", () => {
        test("Should return error when store does not exist", async () => {
            const mockStoreId = new Types.ObjectId();
            const mockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const result = await StoreService.publish(mockStoreId);
            expect(result.error).toBe(`Store ${mockStoreId} does not exist`);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when store is already published", async () => {
            const mockStoreId = new Types.ObjectId();
            const mockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "LIVE",
                        }) as any
                );

            const result = await StoreService.publish(mockStoreId);
            expect(result.error).toBe(`Store ${mockStoreId} is already live`);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should return error when store has less than 3 categories", async () => {
            const mockStoreId = new Types.ObjectId();
            const mockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "DRAFT",
                        }) as any
                );

            const mockFind = jest
                .spyOn(Category, "find")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve([
                            {
                                name: "test",
                            },
                        ]) as any
                );

            const result = await StoreService.publish(mockStoreId);
            expect(result.error).toBe(
                "Store needs at least 3 categories before publishing"
            );
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFind).toHaveBeenCalledTimes(1);
        });

        test("should update store status when data is valid", async () => {
            const mockStoreId = new Types.ObjectId();
            const mockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "DRAFT",
                            updateOne: jest.fn(),
                        }) as any
                );

            const mockFind = jest
                .spyOn(Category, "find")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve([
                            {
                                name: "test",
                            },
                            {
                                name: "test",
                            },
                            {
                                name: "test",
                            },
                        ]) as any
                );

            const result = await StoreService.publish(mockStoreId);
            expect(result.error).toBeUndefined();
            expect(result.data).toBe(mockStoreId);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFind).toHaveBeenCalledTimes(1);
        });
    });
});
