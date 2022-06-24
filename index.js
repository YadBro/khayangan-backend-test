const express   = require("express");
const app       = express();
const PORT      = 5000;
const route     = require("./src/routes");
app.use(express.json());
app.use("/api/v1/", route);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});