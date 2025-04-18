import supabase from "../config/supabase";
import { Database } from "../models/supabase";
import { Request, Response, NextFunction } from "express";

export const getLatestRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { actor1CountryCode, actor2CountryCode, range } = req.query as { actor1CountryCode: string, actor2CountryCode: string, range: string };
        if (!actor1CountryCode || !actor2CountryCode || !range) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        const response = {
            actor1CountryCode: actor1CountryCode,
            actor2CountryCode: actor2CountryCode,
            range: range,
            numRecords: 0,
            records: [] as Database["public"]["Tables"]["gdelt_daily"]["Row"][],
        }
        switch (range) {
            case "5D":
                const fiveDayRecords = await getFiveDayRecords(actor1CountryCode, actor2CountryCode);
                if (fiveDayRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = fiveDayRecords.length;
                    response.records = fiveDayRecords;
                    res.status(200).json(response);
                }
            case "1M":
                const oneMonthRecords = await getOneMonthRecords(actor1CountryCode, actor2CountryCode);
                if (oneMonthRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = oneMonthRecords.length;
                    response.records = oneMonthRecords;
                    res.status(200).json(response);
                }
                return;
            case "3M":
                const threeMonthRecords = await getThreeMonthRecords(actor1CountryCode, actor2CountryCode);
                if (threeMonthRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = threeMonthRecords.length;
                    response.records = threeMonthRecords;
                    res.status(200).json(response);
                }
                return;
            case "1Y":
                const oneYearRecords = await getOneYearRecords(actor1CountryCode, actor2CountryCode);
                if (oneYearRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = oneYearRecords.length;
                    response.records = oneYearRecords;
                    res.status(200).json(response);
                }
                return;
            case "5Y":
                const fiveYearRecords = await getFiveYearRecords(actor1CountryCode, actor2CountryCode);
                if (fiveYearRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = fiveYearRecords.length;
                    response.records = fiveYearRecords;
                    res.status(200).json(response);
                }
                return;
            case "MAX":
                const maxRecords = await getMaxRecords(actor1CountryCode, actor2CountryCode);
                if (maxRecords.length === 0) {
                    res.status(404).json({ message: "No records found" });
                } else {
                    response.numRecords = maxRecords.length;
                    response.records = maxRecords;
                    res.status(200).json(response);
                }
                return;
            default:
                res.status(400).json({ error: "Invalid range parameter" });
                return;

        }
    } catch (error) {
        next(error);
    }
}

const getFiveDayRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false })
        .limit(5);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const getOneMonthRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false })
        .limit(30);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const getThreeMonthRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false })
        .limit(90);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const getOneYearRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false })
        .limit(365);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const getFiveYearRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false })
        .limit(1825);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const getMaxRecords = async (actor1CountryCode: string, actor2CountryCode: string) => {
    const { data, error } = await supabase
        .from("gdelt_daily")
        .select("*")
        .eq("Actor1CountryCode", actor1CountryCode)
        .eq("Actor2CountryCode", actor2CountryCode)
        .order("Year", { ascending: false })
        .order("Month", { ascending: false })
        .order("Day", { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

