import supabase from "../config/supabase";
import { BRSIParams } from "../models/brsiParams";
import { Request, Response, NextFunction } from "express";

export const getBRSIRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { actor1CountryCode, actor2CountryCode, startYear, startMonth, endYear, endMonth } = req.query as any;
        if (!actor1CountryCode || !actor2CountryCode || !startYear || !startMonth || !endYear || !endMonth) {
            res.status(400).json({ error: "Missing required parameters" });
        }

        const { data, error } = await supabase
            .from("gdelt_monthly")
            .select("*")
            .eq("Actor1CountryCode", actor1CountryCode)
            .eq("Actor2CountryCode", actor2CountryCode)
            .gte("Year", startYear)
            .gte("Month", startMonth)
            .lte("Year", endYear)
            .lte("Month", endMonth);
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