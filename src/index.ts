console.log("hello");
import "./models/Invoice";
import "./models/Payment";
import { connectDB } from './db';
import app from "./app";

const port = process.env.PORT || 3000;

(async () => {
    await connectDB();
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

})();

console.log("Hello, TypeScript!");