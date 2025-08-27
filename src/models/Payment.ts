import { DataTypes, Model } from "sequelize";
import Invoice from "./Invoice";
import { IPayment } from "./interface/Payment";
import sequelizeConnection from "../db";

export default class Payment extends Model<IPayment> implements IPayment {
    public id!: number;
    public event_id!: string;
    public invoice_id!: number;
    public amount!: number;    
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        event_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true    // IDEMPOTENCY enforced here via DB unique constraint
        },
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "invoices",
                key: "id"
            }       
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeConnection,
        modelName: "Payment",
        tableName: "payments",
        indexes: [{ unique: true, fields: ["event_id"] }],
        timestamps: false
    }
);

Payment.belongsTo(Invoice, { foreignKey: "invoice_id" });
Invoice.hasMany(Payment, { foreignKey: "invoice_id" });

Payment.sync({ force: false }).then(() => console.log("Connected to table - payments"));
