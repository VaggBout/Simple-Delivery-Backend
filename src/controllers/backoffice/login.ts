import { Request, Response } from "express";

export async function get(_req: Request, res: Response): Promise<void> {
    if (res.locals.user) {
        res.redirect("/backoffice");
        return;
    }

    res.render("login");
}
