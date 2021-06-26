import { firestore } from "firebase-functions";
// import { map, merfgeMap, take, tap, toArray } from 'rxjs/operators';

import * as admin from "firebase-admin";
import { Commercial, Member } from "../models/model";
const db = admin.firestore()

export const add = firestore
.document('commercials/{docId}')
.onCreate( async(snapshot, context) => {
    const commercial = snapshot.data() as Commercial
    console.log('commercial =>',commercial)

    const snap = await db.collection('members').doc(commercial.memberId).get()

    if(!snap.exists) return
    
    const member = snap.data() as Member

    return admin.auth().createUser(
        {
            password: commercial.password,
            phoneNumber: commercial.stk_a.e164Number,
            displayName: `${member.name} ${member.lastName}`,
            disabled: false,
        }
    ).then(res => {
        return db.collection('members').doc(commercial.memberId).update({...member, uid: res.uid} as Member)
    })

})