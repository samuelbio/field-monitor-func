import { Router} from "express";
import * as admin from "firebase-admin";
import { Fiche } from "../models/model"

const db = admin.firestore().collection('fiches');

const router = Router();

router.route('/')
.get(async (req, res) => {
    try {
        const fiches = await db.get();
        const data:Fiche[] = []
        fiches.forEach(elt => data.push(elt.data() as Fiche))
        res.status(200).send(data)

    } catch (error) {
        res.status(409).send({message: "Bad request"})
    }
})
.post(async(req, res) => {
    try {
        const data:Fiche = {
            wholeSallerId: req.body.wholeSallerId,
            stk_b: req.body.stk_b,
            phones: req.body.phones,
            dayOfWork: req.body.dayOfWork,
            hourOfWork: req.body.hourOfWork,
            photo: req.body.photo,
            isDualWallet: req.body.isDualWallet,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        } as Fiche;
        const result = await db.add(data)
        res.status(200).json({...data,id: result.id})
    } catch (error) {
        console.error(error)
        res.status(409).send({message: "Bad request"})
    }
})

router.route('/:id')
.get(async(req, res) => {
    try {
        const id = req.params.id;
        const data = await db.doc(id).get()
        if (data.exists) {
            res.status(200).json(data.data())
        } else {
            res.status(409).send({message: "Fiche doesn't exist"})
        }

    } catch (error) {
        console.error(error)
        res.status(409).send({message: "Bad request"})
    }
})
.put(async(req, res) => {
    try {
        const id = req.params.id;
        const data = await db.doc(id).get()
        if (data.exists) {
            const body = req.body;
            const fiche:Fiche = {
                wholeSallerId: body.wholeSallerId,
                stk_b: body.stk_b,
                phones: body.phones,
                dayOfWork: body.dayOfWork,
                hourOfWork: body.hourOfWork,
                photo: body.photo,
                isDualWallet: body.isDualWallet,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            } as Fiche;
            db.doc(id).update(fiche).then(result => {
                res.status(200).send({message: "Fiche edited"})
            })
            .catch(err => res.status(409).send({message: "Something wrong"}))
        } else {
            res.status(409).send({message: "Fiche doesn't exist"})
        }

    } catch (error) {
        console.error(error)
        res.status(409).send("Bad request")
    }
})

export const ficheRouter:Router = router