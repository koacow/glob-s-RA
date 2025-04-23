import supabase from "../config/supabase";
import { Database } from "../models/database.supabase";
import { BRSIQueryParams, BRSIResponse } from "../models/brsi";
import { Request, Response, NextFunction } from "express";


const aggregateLevels = ["daily", "monthly", "yearly"];

export const getBRSIRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Validate the request parameters in a middleware
        const { aggregateLevel } = req.params;
        if (!aggregateLevel || !aggregateLevels.includes(aggregateLevel)) {
            res.status(400).json({ error: "Invalid aggregate level. Accepted values: daily, monthly, yearly" });
            return;
        }
        const { actor1CountryCode, actor2CountryCode, startDate, endDate } = req.query as unknown as BRSIQueryParams;

        if (!actor1CountryCode || !actor2CountryCode || !startDate || !endDate) {
            res.status(400).json({ error: "Missing required parameters: actor1CountryCode, actor2CountryCode, startDate, endDate" });
            return;
        }

        if (actor1CountryCode.length !== 3 || actor2CountryCode.length !== 3) {
            res.status(400).json({ error: "Country codes must be 3 characters long" });
            return;
        }

        const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            res.status(400).json({ error: "Invalid date format. Accepted format: YYYY-MM-DD" });
            return;
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj > endDateObj) {
            res.status(400).json({ error: "Invalid date range. Start date must be before end date" });
            return;
        }

        const response = {
            actor1CountryCode,
            actor2CountryCode,
            startDate,
            endDate,
            aggregateLevel,
            numRecords: 0,
            records: []
        } as BRSIResponse;
        switch (aggregateLevel) {
            case "daily":
                const { data: dailyData, error: dailyDataFetchError } = await supabase.rpc("getbrsirecordsaggregatedbyday", {
                    actor_1_country_code: actor1CountryCode,
                    actor_2_country_code: actor2CountryCode,
                    start_day: startDateObj.getDate(),
                    start_month: startDateObj.getMonth() + 1,
                    start_year: startDateObj.getFullYear(),
                    end_day: endDateObj.getDate(),
                    end_month: endDateObj.getMonth() + 1,
                    end_year: endDateObj.getFullYear()
                });
                if (dailyDataFetchError) {
                    throw new Error(dailyDataFetchError.message);
                }
                response.numRecords = dailyData.length;
                response.records = dailyData;
                res.status(200).json(response);
                return;
            case "monthly":
                const { data: monthlyData, error: monthlyDataFetchError } = await supabase.rpc("getbrsirecordsaggregatedbymonth", {
                    actor_1_country_code: actor1CountryCode,
                    actor_2_country_code: actor2CountryCode,
                    start_day: startDateObj.getDate(),
                    start_month: startDateObj.getMonth() + 1,
                    start_year: startDateObj.getFullYear(),
                    end_day: endDateObj.getDate(),
                    end_month: endDateObj.getMonth() + 1,
                    end_year: endDateObj.getFullYear()
                });

                if (monthlyDataFetchError) {
                    throw new Error(monthlyDataFetchError.message);
                }
                response.numRecords = monthlyData.length;
                response.records = monthlyData;
                res.status(200).json(response);
                return;
            case "yearly":
                const { data: yearlyData, error: yearlyDataFetchError } = await supabase.rpc("getbrsirecordsaggregatedbyyear", {
                    actor_1_country_code: actor1CountryCode,
                    actor_2_country_code: actor2CountryCode,
                    start_day: startDateObj.getDate(),
                    start_month: startDateObj.getMonth() + 1,
                    start_year: startDateObj.getFullYear(),
                    end_day: endDateObj.getDate(),
                    end_month: endDateObj.getMonth() + 1,
                    end_year: endDateObj.getFullYear()
                });
                if (yearlyDataFetchError) {
                    throw new Error(yearlyDataFetchError.message);
                }
                response.numRecords = yearlyData.length;
                response.records = yearlyData;
                res.status(200).json(response);
                return;
            default: 
                res.status(400).json({ error: "Invalid aggregate level" });
                return;
        }
    } catch (error) {
        next(error);
    }
}