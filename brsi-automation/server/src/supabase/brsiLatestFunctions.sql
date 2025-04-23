DROP FUNCTION IF EXISTS getbrsirecordsaggregatedbyday(character varying, character varying,integer,integer,integer,integer,integer,integer);

CREATE FUNCTION getBRSIRecordsAggregatedByDay(
    actor_1_country_code VARCHAR,
    actor_2_country_code VARCHAR,
    start_day INT,
    start_month INT,
    start_year INT,
    end_day INT,
    end_month INT,
    end_year INT
) RETURNS TABLE (
    Actor1CountryCode VARCHAR,
    Actor2CountryCode VARCHAR,
    Year SMALLINT,
    Month SMALLINT,
    Day SMALLINT,
    AvgGoldsteinScale FLOAT
) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year",
            "Month",
            "Day",
            AVG("AvgGoldsteinScale") AS AvgGoldsteinScale
        FROM
            gdelt_daily
        WHERE
            gdelt_daily."Actor1CountryCode" = $1 AND
            gdelt_daily."Actor2CountryCode" = $2 AND
            MAKE_DATE(gdelt_daily."Year", gdelt_daily."Month", gdelt_daily."Day") BETWEEN MAKE_DATE($5, $4, $3) AND MAKE_DATE($8, $7, $6)
        GROUP BY
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year",
            "Month",
            "Day"
        ORDER BY
            gdelt_daily."Year" ASC,
            gdelt_daily."Month" ASC,
            gdelt_daily."Day" ASC;
    END; 
$$ LANGUAGE 'plpgsql';

DROP FUNCTION IF EXISTS getBRSIRecordsAggregatedByMonth(character varying, character varying,integer,integer,integer,integer,integer,integer);

CREATE FUNCTION getBRSIRecordsAggregatedByMonth(
    actor_1_country_code VARCHAR,
    actor_2_country_code VARCHAR,
    start_day INT,
    start_month INT,
    start_year INT,
    end_day INT,
    end_month INT,
    end_year INT
) RETURNS TABLE (
    Actor1CountryCode VARCHAR,
    Actor2CountryCode VARCHAR,
    Year SMALLINT,
    Month SMALLINT,
    AvgGoldsteinScale FLOAT
) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year",
            "Month",
            AVG("AvgGoldsteinScale") AS AvgGoldsteinScale
        FROM
            gdelt_daily
        WHERE
            gdelt_daily."Actor1CountryCode" = $1 AND
            gdelt_daily."Actor2CountryCode" = $2 AND
            MAKE_DATE(gdelt_daily."Year", gdelt_daily."Month", 1) BETWEEN MAKE_DATE($5, $4, 1) AND MAKE_DATE($8, $7, 1)
        GROUP BY
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year",
            "Month"
        ORDER BY
            gdelt_daily."Year" ASC,
            gdelt_daily."Month" ASC;
    END;
$$ LANGUAGE 'plpgsql';

DROP FUNCTION IF EXISTS getBRSIRecordsAggregatedByYear(character varying, character varying,integer,integer,integer,integer,integer,integer);

CREATE FUNCTION getBRSIRecordsAggregatedByYear(
    actor_1_country_code VARCHAR,
    actor_2_country_code VARCHAR,
    start_day INT,
    start_month INT,
    start_year INT,
    end_day INT,
    end_month INT,
    end_year INT
) RETURNS TABLE (
    Actor1CountryCode VARCHAR,
    Actor2CountryCode VARCHAR,
    Year SMALLINT,
    AvgGoldsteinScale FLOAT
) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year",
            AVG("AvgGoldsteinScale") AS AvgGoldsteinScale
        FROM
            gdelt_daily
        WHERE
            gdelt_daily."Actor1CountryCode" = $1 AND
            gdelt_daily."Actor2CountryCode" = $2 AND
            MAKE_DATE(gdelt_daily."Year", 1, 1) BETWEEN MAKE_DATE($5, 1, 1) AND MAKE_DATE($8, 1, 1)
        GROUP BY
            "Actor1CountryCode",
            "Actor2CountryCode",
            "Year"
        ORDER BY
            gdelt_daily."Year" ASC;
    END;
$$ LANGUAGE 'plpgsql';


    