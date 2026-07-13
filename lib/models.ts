import { model, models, Schema, type Document, type Model, type Types } from "mongoose";

export interface IHistoryEntry {
  _id: Types.ObjectId;
  at: Date;
  actorName: string;
  action: "CREATE" | "UPDATE";
  content: string;
}

export interface ICustomerDeposit extends Document {
  _id: Types.ObjectId;
  fullName: string;
  phone: string;
  depositDate: string;
  depositTime: string;
  cardAction: string;
  ballAction: string;
  cards: number;
  balls: number;
  remainingCards?: number;
  remainingBalls?: number;
  totalText: string;
  status: string;
  createdByName: string;
  updatedByName: string;
  history: IHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IHistoryEntry>(
  {
    at: { type: Date, required: true, default: Date.now },
    actorName: { type: String, required: true },
    action: { type: String, enum: ["CREATE", "UPDATE"], required: true },
    content: { type: String, required: true },
  },
  { _id: true },
);

const CustomerDepositSchema = new Schema<ICustomerDeposit>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    depositDate: { type: String, required: true },
    depositTime: { type: String, required: true },
    cardAction: { type: String, required: true },
    ballAction: { type: String, required: true },
    cards: { type: Number, required: true, min: 0 },
    balls: { type: Number, required: true, min: 0 },
    remainingCards: { type: Number, required: false, min: 0 },
    remainingBalls: { type: Number, required: false, min: 0 },
    totalText: { type: String, required: true },
    status: { type: String, required: true },
    createdByName: { type: String, required: true, default: "Nhân viên" },
    updatedByName: { type: String, required: true, default: "Nhân viên" },
    history: { type: [HistorySchema], default: [] },
  },
  {
    collection: "customers_deposits",
    timestamps: true,
  },
);

export const CustomerDeposit =
  (models.CustomerDeposit as Model<ICustomerDeposit> | undefined) ??
  model<ICustomerDeposit>("CustomerDeposit", CustomerDepositSchema);
