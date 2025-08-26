import express from 'express';
import { PaymentRoutes } from './routes/webhooks';
//import sequelize from "./db"

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.setUpRoutes();
    }

    private setUpRoutes() {
        this.app.get("/", (req, res) => {
            res.send("API is running");
        });
        PaymentRoutes.routes(this.app);

    }
}

export default new App().app;

    