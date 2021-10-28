import { CronJob } from "cron";

const job = new CronJob("0 0 * * *", () => {});

job.start();
