import {Schema, model, InferSchemaType} from "mongoose";

const ClaimSchema = new Schema(
  {
    memberId: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const ItemSchema = new Schema(
    {
        itemId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        
        createdBy: {
            type: String,
            required: true,
        },

        /**
         * For quantity mode, claims should not exceed the count of the item.
         * For shares mode, claims can be any number, but the total price will be divided among the claims.
         */
        mode: {
            type: String,
            enum: ["quantity", "shares"],
            required: true,
        },
        //Quantity entered by the admin
        count: {
            type: Number,
            required: true,
            min: 1,
        },

        // Stored price in paise
        // if Price = 25.50, stored price: 2250 paise
        price:{
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isSafeInteger,
                message: "Amount must be a safe integer in paise",
            }
        },
        
        claims:{
            type: [ClaimSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const MemberSchema = new Schema(

    {
        memberId: {
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        }

    },
    {
        _id: false,
    }
);

const RoomSchema = new Schema(
    {
        roomId:{
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        roomName: {
            type: String,
            required: true,
            trim: true,
        },
        adminMemberId:{
            type: String,
            required: true,
        },
        members: {
            type: [MemberSchema],
            default: [], // NOTE: admin will always be there, so this is techincally will never be empty
        },
        items:{
            type: [ItemSchema],
            default: [],
        },

        // to be divided equally among all of them
        groupAdditionals:{
            // in paise
            type: Number,
            min: 0,
            default: 0,
            validate: {
                validator: Number.isSafeInteger,
                message: "Amount must be a safe integer in paise",
            }
        },

        // to be required equally among all of them
        groupDiscount:{
            // in paise
            type: Number,
            min: 0,
            default: 0,
            validate: {
                validator: Number.isSafeInteger,
                message: "Amount must be a safe integer in paise",
            }
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0,
            },
        },
    },
    {
        timestamps: true,

    }
);

export type Room = InferSchemaType<typeof RoomSchema>;
export default model<Room>("Room", RoomSchema);