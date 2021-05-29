import { Router} from "express";
import * as admin from "firebase-admin";
import { Commercial } from "../models/model";

const db = admin.firestore();
// admin.firestore().settings({ ignoreUndefinedProperties: true })

const router = Router();

router.post('/checkmember', async(req, res) => {
    try {
        if (!!req.body.password && !!req.body.stk_a) {
            const body = req.body
            const commercials = await db.collection('commercials').where("password","==",body.password).get()
            if (commercials.empty) {
                res.status(404).send({message: "Phone or password is not valid"})
            }else {
                const data:Commercial[] = []
                commercials.forEach(elt => data.push({...elt.data(), id: elt.id} as Commercial) )

                const result = data.find(elt => elt.stk_a?.e164Number === `+225${body.stk_a}`)
                if (!!result) {
                    res.status(200).send({message: "User exist", data: {
                        commercialId: result.id,
                        wholeSalerId: result.wholeSalerId
                    }})
                } else {
                    res.status(404).send({message: "User is not exisit"})
                }
            }
        } else {
            res.status(400).send({message: "Params not valid"})
        }
    } catch (error) {
        
    }
})

export const authRouter:Router = router