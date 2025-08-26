import { DataTypes, Model } from "sequelize";
import { Iinvoice } from "./interface/Invoice";
import sequelizeConnection from "../db";

export default class Invoice extends Model<Iinvoice> implements Iinvoice {
    public id!: number;
    public amount!: number;
    public status!: string;
}

Invoice.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("sent", "partially_paid", "paid"),
            allowNull: false,
            defaultValue: "sent"
        }
    },
    {
        sequelize: sequelizeConnection,
        modelName: "Invoice",
        tableName: "invoices",
        timestamps: false
    }
);

Invoice.sync({ force: false }).then(() => console.log("Connected to table - invoices"));