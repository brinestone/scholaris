import { APIError } from "@/lib/api";
import { Response } from "express";

export function handleApiError(e: unknown, res: Response) {
    const err = e as APIError;
    res.status(err.status).json({ message: err.message });
}
