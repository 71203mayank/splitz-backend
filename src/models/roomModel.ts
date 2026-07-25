import {Schema, model, InferSchemaType} from "mongoose";

const ClaimSchema = new Schema(
  {
    member_id: {
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
        item_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        
        //Quantity entered by the admin
        count: {
            type: Number,
            requred: true,
            min: 1,
        },

        // Stored price in paise
        // if Price = 25.50, stored price: 2250
        price:{
            type: Number,
            required: true,
            min: 0,
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
        member_id: {
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
        room_id:{
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        room_name: {
            type: String,
            required: true,
            trim: true,
        },
        admin_member_id:{
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
        taxes:{
            // in paise
            type: Number,
            min: 0,
        },

        // to be requred eually among all of them
        discount:{
            // in paise
            type: Number,
            min: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
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
        _id: false,
    }
);

export type Room = InferSchemaType<typeof RoomSchema>;
export default model<Room>("Room", RoomSchema);