import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db";
import { IPaymentEvent } from "./interface/paymentEvent";

export default class PaymentEvent extends Model<IPaymentEvent> implements IPaymentEvent {
    public id?: number;
    public event_id!: string;
    public invoice_id!: number;
    public amount!: number;
    public status?: string;
    public retry_count!: number;
}

PaymentEvent.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    event_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "processing", "processed", "failed"),
        defaultValue: "pending"
    },
    retry_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
}, {
    sequelize: sequelizeConnection,
    modelName: "PaymentEvent",
    tableName: "payment_events",
    timestamps: false
});

PaymentEvent.sync({ force: false }).then(() => console.log("Connected to table - payment_events"));

