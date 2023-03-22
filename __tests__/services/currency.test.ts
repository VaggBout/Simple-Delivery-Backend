import { describe, expect, test, jest, afterAll } from "@jest/globals";
import axios from "axios";
import mongoose from "mongoose";
import Currency from "../../src/models/currency";
import * as CurrencyService from "../../src/services/currency";

describe("Currency service", () => {
    afterAll(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("Upsert currencies", () => {
        test("Should retrieve currencies and save to DB", async () => {
            const mockAxios = jest.spyOn(axios, "get").mockReturnValueOnce(
                Promise.resolve({
                    data: {
                        success: true,
                        rates: {
                            USD: 1,
                        },
                    },
                })
            );

            const mockBulkWrite = jest
                .spyOn(Currency, "bulkWrite")
                .mockImplementationOnce(() => Promise.resolve() as any);

            await CurrencyService.upsertCurrencies();

            expect(mockAxios).toHaveBeenCalledTimes(1);
            expect(mockBulkWrite).toHaveBeenCalledTimes(1);
            expect(mockBulkWrite).toHaveBeenCalledWith([
                {
                    updateOne: {
                        filter: { symbol: "USD" },
                        update: {
                            $set: {
                                symbol: "USD",
                                rate: mongoose.Types.Decimal128.fromString("1"),
                            },
                        },
                        upsert: true,
                    },
                },
            ]);

            mockAxios.mockClear();
        });

        test("should throw error when it fails to retrieve currencies", async () => {
            const mockAxios = jest.spyOn(axios, "get").mockReturnValueOnce(
                Promise.resolve({
                    data: {
                        success: false,
                    },
                })
            );

            try {
                await CurrencyService.upsertCurrencies();
            } catch (error: any) {
                expect(error.message).toBe("Failed to retrieve currencies");
            }
            expect(mockAxios).toHaveBeenCalledTimes(1);
        });
    });
});
