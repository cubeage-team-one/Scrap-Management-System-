import express from "express";
import cors from "cors";

import router from "./routes/routes.js";
import { clientUrl } from "./core/config/db.js";
import notFound from "./core/middlewares/notFound.js";
import errorHandler from "./core/middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: clientUrl }));
app.use(express.json());

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;