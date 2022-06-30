import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter} from "./controllers/main-controller";
import {initDb} from "./database/db";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

initDb().catch(()=>{});

const app = express();

// basic security
app.use(helmet());

// allow cors
app.use(cors());

// express parse requests as json
app.use(express.json());

app.use("/pivot", mainRouter);


// start server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

