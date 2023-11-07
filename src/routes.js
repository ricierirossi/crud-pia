import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const router = Router();

router.options("*", cors());

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

router.get("/users/:id", async (req, res) => {
    try {
        const intRegex = /^-?\d+$/;
        const { id } = req.params;
        if (!intRegex.test(id)) {
            res.status(422).json("ID inválido");
            return;
        }
        const info = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!info) {
            res.status(404).json("id não existe");
            return;
        }
        res.status(200).json(info);
    } catch (e) {
        console.log(e);
    }
});

router.post("/users", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(422).json("Inválido");
            return;
        }
        const existingEmail = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });
        if (!!existingEmail) {
            res.status(400).json("Email já cadastrado");
            return;
        }
        const userData = await prisma.users.create({
            data: {
                email,
                password,
            },
        });
        res.status(201).json(userData.users);
    } catch (e) {
        res.status(500).json("Erro ao enviar");
    }
});
/*
router.delete("/users/:id", async (req, res) => {
    try {
        const intRegex = /^-?\d+$/;
        const { id } = req.params;
        if (!intRegex.test(id)) {
            res.send(422).json("id inválido");
            return;
        }
        const info = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!info) {
            res.status(404).json("id não existe");
            return;
        }
        const deletedInfo = await prisma.users.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json("Deletado com sucesso");
    } catch (e) {
        res.status(500).json("Erro, tente mais tarde");
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        const intRegex = /^-?\d+$/;
        const { id } = req.params;
        const { email } = req.body;
        if (!intRegex.test(id)) {
            res.status(422).json("id inválido");
            return;
        }
        const info = await prisma.users.update({
            where: {
                id: parseInt(id),
            },
            data: {
                email,
            },
        });
        res.status(200).json("Atualizado com sucesso");
    } catch (e) {
        res.status(500).json("Tente novamente mais tarde.");
    }
});
*/
export { router };
