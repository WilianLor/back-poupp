import app from "./app";

app.listen(process.env.PORT, () => {
  console.log("listen on port " + process.env.PORT);
});
