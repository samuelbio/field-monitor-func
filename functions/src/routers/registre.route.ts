import { Router} from "express";
import * as admin from "firebase-admin";
import { from } from "rxjs";
import { take, mergeMap, toArray } from "rxjs/operators";
import { Fiche, Register } from "../models/model"

const db = admin.firestore().collection('registers');
const fiches = admin.firestore().collection('fiches');

const router = Router();

router
.post('/all', async (req, res) => {
    try {
        const wholeSalerId = req.body.wholeSalerId;
        const commercialId = req.body.commercialId;

        const register = await db.where('wholeSalerId','==',wholeSalerId).where('commercialId','==',commercialId).get();
        const data:Register[] = []
        register.forEach(elt => data.push({...elt.data(), id: elt.id, 
            createdAt: elt.data().createdAt.toDate(),
            updatedAt: elt.data().createdAt.toDate()} as Register))

        const result = await from(data)
        .pipe(
            mergeMap(async(register) => {
                const ficheDoc = await fiches.doc(register.ficheId).get()
                const fiche:Fiche = ficheDoc.data() as Fiche

                const data = { 
                    id: register.id,
                    ...register,
                    name: fiche.name,
                    lastName: fiche.lastName,
                    stk_b: fiche.stk_b,
                }
                return data
            }),
            take(data.length),
            toArray()
        ).toPromise()

        res.status(200).json(result)

    } catch (error) {
        res.status(400).send({message: "Bad request"})
    }
})

router
.post('/', async(req, res) => {
    try {
        const body = req.body

        // if (body.amountSent !== typeof(Number)) {
        //     throw new Error("Invalid parameter");
        // }

        const data:Register = {
            wholeSalerId: body.wholeSalerId,
            commercialId: body.commercialId,
            ficheId: body.ficheId,
            amountSent: Number(body.amountSent),
            receivedAmount: parseInt(body.receivedAmount),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        } as Register;

        const result = await db.add(data)
        res.status(200).json({...data,id: result.id})
    } catch (error) {
        // console.error(error)
        res.status(400).send({message: "Bad request"})
    }
})

router.post('/fiche',async(req, res) => {
    try {
        const wholeSalerId = req.body.wholeSalerId;
        const commercialId = req.body.commercialId;
        const ficheId = req.body.ficheId;

        const document = await db.where('wholeSalerId','==',wholeSalerId)
        .where('commercialId','==',commercialId)
        .where('ficheId','==',ficheId)
        .get()

        const data:Register[] = []
        document.forEach(elt => data.push({...elt.data(), id: elt.id,
            createdAt: elt.data().createdAt.toDate(),
            updatedAt: elt.data().createdAt.toDate()} as Register))

        const result = await from(data)
        .pipe(
            mergeMap(async(register) => {
                const ficheDoc = await fiches.doc(register.ficheId).get()
                const fiche:Fiche = ficheDoc.data() as Fiche

                const data = { 
                    id: register.id,
                    ...register,
                    name: fiche.name,
                    lastName: fiche.lastName,
                    stk_b: fiche.stk_b,
                }
                return data
            }),
            take(data.length),
            toArray()
        ).toPromise()

        res.status(200).json(result)

    } catch (error) {
        console.error(error)
        res.status(400).send({message: "Bad request"})
    }
})

router.route('/:id')
.get(async(req, res) => {
    try {
        const id = req.params.id;
        const registerDoc = await db.doc(id).get()
        if (registerDoc.exists) {
            const register:Register = registerDoc.data() as Register
            const ficheDoc = await fiches.doc(register.ficheId).get()
            const fiche:Fiche = ficheDoc.data() as Fiche

            const data = { 
                id,
                ...register,
                name: fiche.name,
                lastName: fiche.lastName,
                stk_b: fiche.stk_b,
            }
            res.status(200).json(data)
        } else {
            res.status(400).send({message: "Register doesn't exist"})
        }

    } catch (error) {
        console.error(error)
        res.status(400).send({message: "Bad request"})
    }
})
.put(async(req, res) => {
    try {
        const id = req.params.id;
        const data = await db.doc(id).get()
        if (data.exists) {
            const body = req.body;
            const fiche:Register = {
                ficheId: body.ficheId,
                amountSent: Number(body.amountSent),
                receivedAmount: Number(body.receivedAmount),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            } as Register;
            db.doc(id).update(fiche).then(result => {
                res.status(200).json({message: "Register edited"})
            })
            .catch(err => res.status(409).json({message: "Something wrong"}))
        } else {
            res.status(404).json({message: "Register doesn't exist"})
        }

    } catch (error) {
        console.error(error)
        res.status(400).send("Bad request")
    }
})

export const RegisterRouter:Router = router