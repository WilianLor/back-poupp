import app from "./app";

import "./services/env"
import "./services/database"

app.listen(process.env.PORT, () => {
  console.log("listen on port " + process.env.PORT);
});
