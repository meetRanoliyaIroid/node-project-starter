import cron from "node-cron";

export default async function cronTask() {
    // Run cron job every day at 12:01 AM
    cron.schedule('01 00 * * *', async () => {
        // TODO: Add cron job logichere
    });
}