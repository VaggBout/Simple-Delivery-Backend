import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Types } from "mongoose";
import * as OrderService from "../../src/services/order";
import * as CategoryService from "../../src/services/category";
import { IUser, ProductOrder } from "../../src/types/models";
import Order from "../../src/models/order";
import Store from "../../src/models/store";

describe("Order service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("create", () => {
        test("Should return error when store does not exist", async () => {
            const mockGetProductsByStoreId = jest
                .spyOn(CategoryService, "getProductsByStoreId")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        error: "test",
                        code: 404,
                    })
                );
            const mockStoreId = new Types.ObjectId();
            const mockUser: IUser = {
                name: "test",
                address: "test",
                email: "test",
                type: "GUEST",
            };
            const mockProducts: Array<ProductOrder> = [
                {
                    _id: new Types.ObjectId().toString(),
                    quantity: 1,
                },
            ];
            const result = await OrderService.create(
                mockUser,
                mockProducts,
                mockStoreId
            );
            expect(result.error).toBe("test");
            expect(mockGetProductsByStoreId).toHaveBeenCalledTimes(1);
        });

        test("Should return error when product does not exist for store", async () => {
            const mockGetProductsByStoreId = jest
                .spyOn(CategoryService, "getProductsByStoreId")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        data: [
                            {
                                name: "test",
                                price: 1,
                                description: "test",
                                _id: new Types.ObjectId(),
                            },
                        ],
                        code: 200,
                    })
                );

            const mockStoreId = new Types.ObjectId();
            const mockUser: IUser = {
                name: "test",
                address: "test",
                email: "test",
                type: "GUEST",
            };
            const mockProducts: Array<ProductOrder> = [
                {
                    _id: new Types.ObjectId().toString(),
                    quantity: 1,
                },
            ];
            const result = await OrderService.create(
                mockUser,
                mockProducts,
                mockStoreId
            );
            expect(result.error).toBe(
                `Product ${mockProducts[0]._id} does not exist on store ${mockStoreId}`
            );
            expect(mockGetProductsByStoreId).toHaveBeenCalledTimes(1);
        });

        test("Should save order and return doc id when data is valid", async () => {
            const productId = new Types.ObjectId();
            const orderId = new Types.ObjectId();
            const mockGetProductsByStoreId = jest
                .spyOn(CategoryService, "getProductsByStoreId")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        data: [
                            {
                                name: "test",
                                price: 1,
                                description: "test",
                                _id: productId,
                            },
                        ],
                        code: 200,
                    })
                );

            const orderMockSave = jest
                .spyOn(Order.prototype, "save")
                .mockImplementationOnce(
                    () => Promise.resolve({ id: orderId }) as any
                );

            const mockStoreId = new Types.ObjectId();
            const mockUser: IUser = {
                name: "test",
                address: "test",
                email: "test",
                type: "GUEST",
            };
            const mockProducts: Array<ProductOrder> = [
                {
                    _id: productId.toString(),
                    quantity: 1,
                },
            ];
            const result = await OrderService.create(
                mockUser,
                mockProducts,
                mockStoreId
            );

            expect(result.error).toBeUndefined();
            expect(result.data).toBe(orderId);
            expect(mockGetProductsByStoreId).toHaveBeenCalledTimes(1);
            expect(orderMockSave).toHaveBeenCalledTimes(1);
        });
    });

    describe("Get orders by store id", () => {
        test("should return error when store does not exist", async () => {
            const storeMockFindById = jest
                .spyOn(Store, "findById")
                .mockImplementationOnce(() => Promise.resolve(null) as any);
            const mockStoreId = new Types.ObjectId();
            const result = await OrderService.getOrdersByStoreId(mockStoreId);

            expect(result.error).toBe(`Store ${mockStoreId} does not exist`);
            expect(storeMockFindById).toHaveBeenCalledTimes(1);
        });
    });
});
