import {z} from "zod";
import type { Socket } from "socket.io";
import { getPresence, type Presence } from "./store";
import { AppError } from "../utils/AppError";


type AckResult<T> = 
    | {success: true; data: T}
    | {
        success: false;
        error: {
            code: string;
            message: string;
            issues?: z.core.$ZodIssue[];
        };
    };

type Ack<T> = (result : AckResult<T>) => void;

type HandlerContext<S extends z.ZodType, P> = {
    data: z.output<S>;
    presence: P;
}

type HandlerOptions<S extends z.ZodType, R> = {
    socket: Socket;
    schema: S;
} & (
    | {
        requirePresence: true;
        handler: (context: HandlerContext<S, Presence>) => Promise<R>;
    }
    | {
        requirePresence: false;
        handler: (context: HandlerContext<S, Presence | undefined>) => Promise<R>;
    }
)


export function withSocketHandler<S extends z.ZodType, R>(
    options: HandlerOptions<S,R>,
){
    return async (payload: unknown, ack: Ack<R>) => {
        if (typeof ack !== "function") return;

        try {
            const parsed = options.schema.safeParse(payload);

            if(!parsed.success){
                ack({
                    success: false,
                    error:{
                        code: "INVALID_PAYLOAD",
                        message: "Invalid event payload",
                        issues: parsed.error.issues,
                    },
                });

                return;
            }

            const presence = getPresence(options.socket.id);

            let result: R;

            if(options.requirePresence){
                if(!presence){
                    ack({
                        success: false,
                        error: {
                            code: "NOT_JOINED",
                            message: "Join a room first",
                        },
                    });

                    return;
                }

                result = await options.handler({
                    data: parsed.data,
                    presence,
                });
            }else{
                result = await options.handler({
                    data: parsed.data,
                    presence,
                });
            }

            ack({success: true, data: result});
        } catch(error){
            if (error instanceof AppError) {
                ack({
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                });
                return;
            }

            console.error("Socket handler failed", error);

            ack({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Something went wrong",
                },
            });
        }
    };
}
