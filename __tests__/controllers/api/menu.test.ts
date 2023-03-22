import { describe, expect, test, jest, afterAll } from "@jest/globals";
import { Types } from "mongoose";
import * as MenuController from "../../../src/controllers/api/menu";
import * as CategoryService from "../../../src/services/category";
import { Request, Response } from "express";

describe("Menu controller", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("get", () => {
        test("should respond with categories", async () => {
            const mockCategory = {
                name: "test",
                products: [],
                store: new Types.ObjectId(),
                _id: new Types.ObjectId(),
            };
            const mockGetStoresCategories = jest
                .spyOn(CategoryService, "getStoresCategories")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        code: 200,
                        data: [mockCategory],
                    })
                );

            const req = {
                params: {
                    id: new Types.ObjectId().toString(),
                },
            } as unknown as Request;

            const res = {
                send: jest.fn(),
                status: jest.fn(),
            } as unknown as Response;

            await MenuController.get(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith([mockCategory]);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(mockGetStoresCategories).toHaveBeenCalledTimes(1);
        });

        test("should respond with service error", async () => {
            const mockGetStoresCategories = jest
                .spyOn(CategoryService, "getStoresCategories")
                .mockImplementationOnce(() =>
                    Promise.resolve({
                        code: 400,
                        error: "test",
                    })
                );

            const req = {
                params: {
                    id: new Types.ObjectId().toString(),
                },
            } as unknown as Request;

            const res = {
                send: jest.fn(),
                status: jest.fn(),
            } as unknown as Response;

            await MenuController.get(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith({
                error: "test",
            });
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(mockGetStoresCategories).toHaveBeenCalledTimes(1);
        });

        test("should respond with error when service throws", async () => {
            const mockGetStoresCategories = jest
                .spyOn(CategoryService, "getStoresCategories")
                .mockImplementationOnce(() => {
                    throw new Error("test");
                });

            const req = {
                params: {
                    id: new Types.ObjectId().toString(),
                },
            } as unknown as Request;

            const res = {
                send: jest.fn(),
                status: jest.fn(),
            } as unknown as Response;

            await MenuController.get(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith({
                error: "Something went wrong!",
            });
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(mockGetStoresCategories).toHaveBeenCalledTimes(1);
        });
    });
});
