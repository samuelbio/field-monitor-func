import { Router} from "express";
import * as admin from "firebase-admin";
import { Fiche } from "../models/model"

const db = admin.firestore().collection('fiches');
// admin.firestore().settings({ ignoreUndefinedProperties: true })

const router = Router();

router.route('/')
.get(async (req, res) => {

    try {
        const fiches = await db.get();
        const data:Fiche[] = []
        fiches.forEach(elt => data.push(elt.data() as Fiche))
        res.status(200).send(data)

    } catch (error) {
        res.status(409).send("Bad request")
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
            isDualWallet: req.body.isDualWallet
        } as Fiche;
        const result = await db.add(data)
        res.status(200).json({...data,id: result.id})
    } catch (error) {
        console.error(error)
        res.status(409).send("Bad request")
    }
})

export const ficheRouter:Router = router