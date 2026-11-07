// Request and socket payload validation
import {z} from "zod";

const moneySchema = z.number().int().nonnegative();

export const createRoomSchema = z.object({
    roomName: z.string().trim().min(1),
    adminName: z.string().trim().min(1),
    memberNames: z.array(z.string().trim().min(1)),
});

export const roomJoinSchema = z.object({
    roomId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
    userName: z.string().trim().min(1),
})

export const itemAddSchema = z.object({
    name: z.string().trim().min(1),
    count: z.number().min(1),
    price: moneySchema,
    mode: z.enum(["quantity", "shares"]),
})

export const itemUpdateSchema = z.strictObject({
    itemId: z.string().trim().min(1),
    changes: itemAddSchema.partial().strict().refine(
        (changes) => Object.values(changes).some((value) => value !== undefined),
        { message: "Provide at least one item field to update" },
    ),
});

export const itemRemoveSchema = z.object({
    itemId : z.string().trim().min(1)
})

export const claimUpdateSchema = z.object({
    itemId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
    quantity: z.number().nonnegative(),
})

export const roomAdjustmentUpdateSchema = z.strictObject({
    groupAdditionals: moneySchema.optional(),
    groupDiscount: moneySchema.optional(),
}).refine(
    (changes) => Object.values(changes).some((value) => value !== undefined),
    { message: "Provide at least one group adjustment to update" },
);

export const addMemberSchema = z.object({
    name: z.string().trim().min(1),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export type RoomJoinInput = z.infer<typeof roomJoinSchema>;
export type ItemAddInput = z.infer<typeof itemAddSchema>;
export type ItemUpdatedInput = z.infer<typeof itemUpdateSchema>;
export type ItemRemoveInput = z.infer<typeof itemRemoveSchema>;
export type ClaimUpdatedInput = z.infer<typeof claimUpdateSchema>;
export type RoomAdjustmentUpdateInput = z.infer<typeof roomAdjustmentUpdateSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;