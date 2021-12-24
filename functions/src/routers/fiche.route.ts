import { Router} from "express";
import * as admin from "firebase-admin";
import { Fiche, GMSPlace } from "../models/model"

const db = admin.firestore().collection('fiches');

const router = Router();

router
.post('/all', async (req, res) => {
    try {
        const wholeSalerId = req.body.wholeSalerId;
        const commercialId = req.body.commercialId;

        const fiches = await db.where('wholeSalerId','==',wholeSalerId).where('commercialId','==',commercialId).get();
        const data:Fiche[] = []
        fiches.forEach(elt => data.push({...elt.data(), id: elt.id} as Fiche))
        res.status(200).json(data)

    } catch (error) {
        res.status(400).send({message: "Bad request"})
    }
})

router
.post('/', async(req, res) => {
    try {
        const body = req.body

        const place:GMSPlace = {
            formatted_address: body.place.formatted_address,
            name: body.place.name,
            placeId: body.place.placeId,
            url: body.place.url,
            coordinate: new admin.firestore.GeoPoint(body.place.coordinate.latitude, body.place.coordinate.longitude)
        }

        const data:Fiche = {
            wholeSalerId: body.wholeSalerId,
            commercialId: body.commercialId,
            name: body.name,
            lastName: body.lastName,
            type: body.type,
            stk_b: body.stk_b,
            phones: body.phones,
            dayOfWork: body.dayOfWork,
            hourOfWork: body.hourOfWork,
            placeDescription: body.placeDescription,
            photo: body.photo,
            place: place,
            isDualWallet: body.isDualWallet,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        } as Fiche;

        const result = await db.add(data)
        res.status(200).json({...data,id: result.id})
    } catch (error) {
        console.error(error)
        res.status(400).send({message: "Bad request"})
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
            res.status(400).send({message: "Fiche doesn't exist"})
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

            const place:GMSPlace = {
                formatted_address: body.place.formatted_address,
                name: body.place.name,
                placeId: body.place.placeId,
                url: body.place.url,
                coordinate: new admin.firestore.GeoPoint(body.place.coordinate.latitude, body.place.coordinate.longitude)
            }
            const fiche:Fiche = {
                name: body.name,
                lastName: body.lastName,
                type: body.type,
                stk_b: body.stk_b,
                phones: body.phones,
                dayOfWork: body.dayOfWork,
                hourOfWork: body.hourOfWork,
                placeDescription: body.placeDescription,
                photo: body.photo,
                place: place,
                isDualWallet: body.isDualWallet,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            } as Fiche;
            db.doc(id).update(fiche).then(result => {
                res.status(200).send({message: "Fiche edited"})
            })
            .catch(err => res.status(409).send({message: "Something wrong"}))
        } else {
            res.status(400).send({message: "Fiche doesn't exist"})
        }

    } catch (error) {
        console.error(error)
        res.status(400).send({message:"Bad request", error: JSON.parse(error)})
    }
})

export const ficheRouter:Router = router