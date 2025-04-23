# Real-time BRSI Data Automation Server

## Overview

This is a Node.js server that automates the process of fetching and storing BRSI data in a Supabase PostgreSQL database. It 
queries the GDELT Events 1.0 Database for BRSI data daily at 00:00 America/New_York time and upserts the data into the database. The server exposes a REST API for querying the data at the `/api/brsi` endpoint.

## Technology Stack

- Typescript
- Node.js
- Express.js
- Node-cron
- Supabase
- Google Cloud BigQuery

## Getting Started

### Installing Dependencies

```bash
cd server
npm install
```

### Authenticate with Google Cloud using Application Default Credentials (ADC)

Follow the instructions in the [Google Cloud documentation](https://cloud.google.com/docs/authentication/set-up-adc-local-dev-environment) to set up Application Default Credentials (ADC) for your Google Cloud project. This is required to authenticate with Google Cloud BigQuery.

### Environment Variables

Create a `.env` file in the root directory of the project and add the environment variables according to the `.env.example` file. The required environment variables are:

```env
# Project configuration
PORT=4000
NODE_ENV=development
# Supabase credentials
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
```

### Running the Server

To start the server, run the following command:

```bash
npm run dev
```

This will start the server in development mode. The server will listen on the port specified in the `.env` file (default is 4000).

### Using the API

**NOTE:** The API route is intended for internal use only as it is insecure.
The server exposes a REST API at the `/api/brsi/:aggregateLevel` endpoint. You can use this endpoint to query the BRSI data stored in the Supabase database.

The API supports the following aggregate levels in the URL:

- `daily`: Daily data
- `monthly`: Monthly data
- `yearly`: Yearly data

The API supports the following query parameters:

- `startDate`: The desired start date for records in YYYY-MM-DD format.
- `endDate`: The desired end date for records in YYYY-MM-DD format.
- `actor1CountryCode`: The country code of the actor 1 - the country whose perspective of which the sentiment is being measured.
- `actor2CountryCode`: The country code of the actor 2 - the opposing country whose perspective towards which the sentiment is being measured.

Example API request:

```bash
curl -X GET http://localhost:4000/api/brsi/daily?startDate=2023-01-01&endDate=2023-12-31&actor1CountryCode=USA&actor2CountryCode=CHN
```

## Future TODOs

- **Migrate to Go or Java**: The current implementation is in Node.js, but we plan to migrate to Go or Java for better performance and scalability.
- Get a service account key from Google Cloud and use it to authenticate with BigQuery.
- Add authentication to the API.
- Add error handling and logging.
- Add more API endpoints for different queries.
- Aggregate data by day instead of month to increase granularity.
- Use WebSockets to push data to the client in real-time.
- Add a frontend to visualize the data. 