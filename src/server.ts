import app from "./app";

import "./services/env";
import "./services/database";
import "./services/basicConfig";
import "./services/cron";

app.listen(process.env.PORT, () => {
  console.log("listen on port " + process.env.PORT);
});
