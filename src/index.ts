import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Example app listening on ${PORT}`);
});
