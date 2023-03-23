import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import Category from "../../src/models/category";
import * as CategoryService from "../../src/services/category";
import { Types } from "mongoose";
import Store from "../../src/models/store";
import Currency from "../../src/models/currency";

describe("Category service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("Create", () => {
        test("Should return error when category already exists", async () => {
            const mockFindOne = jest
                .spyOn(Category, "findOne")
                .mockImplementationOnce(
                    () => Promise.resolve({ name: "test" }) as any
                );

            const result = await CategoryService.create(
                {
                    name: "test",
                    products: [],
                    store: new Types.ObjectId(),
                },
                new Types.ObjectId()
            );

            expect(result.error).toBe("Category test already exists");
            expect(mockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when store does not exist", async () => {
            const categoryMockFindOne = jest
                .spyOn(Category, "findOne")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const storeMockFindOne = jest
                .spyOn(Store, "find")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const data = {
                name: "test",
                products: [],
                store: new Types.ObjectId(),
            };
            const result = await CategoryService.create(
                data,
                new Types.ObjectId()
            );

            expect(result.error).toBe(
                `Store with ${data.store} does not exist`
            );
            expect(categoryMockFindOne).toHaveBeenCalledTimes(1);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return doc _id when category is created", async () => {
            const mockId = new Types.ObjectId();
            const categoryMockFindOne = jest
                .spyOn(Category, "findOne")
                .mockImplementationOnce(() => Promise.resolve(null) as any);

            const storeMockFindOne = jest
                .spyOn(Store, "find")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            name: "test-store",
                        }) as any
                );

            const categoryMockSave = jest
                .spyOn(Category.prototype, "save")
                .mockImplementationOnce(
                    () => Promise.resolve({ _id: mockId }) as any
                );

            const data = {
                name: "test",
                products: [],
                store: new Types.ObjectId(),
            };
            const result = await CategoryService.create(
                data,
                new Types.ObjectId()
            );
            expect(result.error).toBeUndefined();
            expect(result.data).toBe(mockId);
            expect(categoryMockFindOne).toHaveBeenCalledTimes(1);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
            expect(categoryMockSave).toHaveBeenCalledTimes(1);
        });
    });

    describe("Get store's categories", () => {
        test("Should return error when store does not exist", async () => {
            const storeMockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(() => Promise.resolve(null) as any);
            const mockStoreId = new Types.ObjectId();

            const result = await CategoryService.getStoresCategories(
                mockStoreId,
                null
            );

            expect(result.error).toBe(`Store ${mockStoreId} does not exist`);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when store is DRAFT", async () => {
            const storeMockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "DRAFT",
                        }) as any
                );
            const mockStoreId = new Types.ObjectId();

            const result = await CategoryService.getStoresCategories(
                mockStoreId,
                null
            );

            expect(result.error).toBe(`Store ${mockStoreId} does not exist`);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
        });

        test("Should return error when currency is not supported", async () => {
            const storeMockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "LIVE",
                        }) as any
                );

            const currencyMockFindOne = jest
                .spyOn(Currency, "findOne")
                .mockImplementationOnce(() => Promise.resolve(null) as any);
            const mockStoreId = new Types.ObjectId();

            const result = await CategoryService.getStoresCategories(
                mockStoreId,
                "TEST"
            );

            expect(result.error).toBe("Unsupported currency: TEST");
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
            expect(currencyMockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should return array of categories", async () => {
            const storeMockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "LIVE",
                        }) as any
                );

            const categoryMockAggregate = jest
                .spyOn(Category, "find")
                .mockImplementationOnce(() => Promise.resolve([]) as any);

            const mockStoreId = new Types.ObjectId();

            const result = await CategoryService.getStoresCategories(
                mockStoreId,
                null
            );

            expect(result.error).toBeUndefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data?.length).toBe(0);
            expect(categoryMockAggregate).toHaveBeenCalledTimes(1);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
        });

        test("should return array of categories by invoking aggregate when valid currency is provided", async () => {
            const storeMockFindOne = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            status: "LIVE",
                        }) as any
                );

            const currencyMockFindOne = jest
                .spyOn(Currency, "findOne")
                .mockImplementationOnce(
                    () =>
                        Promise.resolve({
                            rate: 1,
                        }) as any
                );
            const categoryMockAggregate = jest
                .spyOn(Category, "aggregate")
                .mockImplementationOnce(() => Promise.resolve([]) as any);

            const mockStoreId = new Types.ObjectId();

            const result = await CategoryService.getStoresCategories(
                mockStoreId,
                "TEST"
            );

            expect(result.error).toBeUndefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data?.length).toBe(0);
            expect(categoryMockAggregate).toHaveBeenCalledTimes(1);
            expect(storeMockFindOne).toHaveBeenCalledTimes(1);
            expect(currencyMockFindOne).toHaveBeenCalledTimes(1);
        });
    });
});
