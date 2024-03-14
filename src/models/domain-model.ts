import { Schema, model } from "mongoose";
import { IDomainDocument, TDomainModel } from "../types/domain";

const DomainSchema = new Schema<IDomainDocument, TDomainModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DomainModel = model<IDomainDocument, TDomainModel>(
  "domain",
  DomainSchema
);

export default DomainModel;
