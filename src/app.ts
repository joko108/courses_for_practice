import express, { Express } from "express";
import { getCoursesRouter } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";
import { db } from "./db/db";
import { getInterestingRouter } from "./routes/getInterestingRouter";

export const app: Express = express();

app.use(express.json());

app.use('/courses', getCoursesRouter(db));
app.use('/__test__', getTestsRouter(db));
app.use('/interesting', getInterestingRouter(db));
