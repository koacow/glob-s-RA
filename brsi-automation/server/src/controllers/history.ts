import supabase from "../config/supabase";
import { Request, Response, NextFunction } from "express";

export const getHistoricalRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { actor1CountryCode, actor2CountryCode, startDate, endDate } = req.query as any;
        if (!actor1CountryCode || !actor2CountryCode || !startDate || !endDate) {
            res.status(400).json({ error: "Missing required parameters" });
        }
        var startDateObj;
        var endDateObj;
        try {
            startDateObj = new Date(startDate);
            if (isNaN(startDateObj.getTime())) {
                throw new Error("Invalid date");
            }
            endDateObj = new Date(endDate);
            if (isNaN(endDateObj.getTime())) {
                throw new Error("Invalid date");
            }
            if (startDateObj > endDateObj) {
                res.status(400).json({ error: "Start date must be before end date" });
                return;
            }
        } catch (error) {
            res.status(400).json({ error: "Invalid date format" });
            return;
        }

        const { data, error } = await supabase
            .from("gdelt_daily")
            .select("*")
            .eq("Actor1CountryCode", actor1CountryCode)
            .eq("Actor2CountryCode", actor2CountryCode)
            .gte("Year", startDateObj.getFullYear())
            .gte("Month", startDateObj.getMonth() + 1)
            .gte("Day", startDateObj.getDate())
            .lte("Year", endDateObj.getFullYear())
            .lte("Month", endDateObj.getMonth() + 1)
            .lte("Day", endDateObj.getDate())
            .order("Year", { ascending: true })
            .order("Month", { ascending: true })
            .order("Day", { ascending: true });
        if (error) {
            next(error);
        } else if (data.length === 0) {
            res.status(404).json({ message: "No records found" });
        } else {
            res.status(200).json(data);
        }
    }
    catch (error) {
        next(error);
    }
}