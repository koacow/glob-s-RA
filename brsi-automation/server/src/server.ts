import app from "./app";
import config from "./config/config";
import cron from 'node-cron';
import runJob from "./cron/gdeltPull";
import cronConfig from "./config/cron";


app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
});


// Run the GDELT data pull every day at 00:00 EST
const dailyGDELTPull = cron.schedule('0 0 * * *', () => {
    runJob();
    console.log('GDELT data pull job executed.');
}, cronConfig);

dailyGDELTPull.start();
