import { describe, expect, test, jest } from "@jest/globals";
import { Types } from "mongoose";
import * as OrderController from "../../../src/controllers/api/order";
import * as OrderService from "../../../src/services/order";
import { Request, Response } from "express";

describe("Order controller", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("post", () => {
        test("Should respond with order id", async () => {
            const mockOrderId = new Types.ObjectId();
            const mockGetStoresCategories = jest
                .spyOn(OrderService, "create")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        code: 200,
                        data: mockOrderId,
                    })
                );

            const req = {
                params: {
                    id: new Types.ObjectId().toString(),
                },
                body: {
                    user: {},
                    products: [],
                },
            } as unknown as Request;

            const res = {
                send: jest.fn(),
                status: jest.fn(),
            } as unknown as Response;

            await OrderController.post(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith({ data: mockOrderId });
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(mockGetStoresCategories).toHaveBeenCalledTimes(1);
        });
    });
});
