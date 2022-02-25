import { firestore } from "firebase-functions";
// import { map, merfgeMap, take, tap, toArray } from 'rxjs/operators';

import * as admin from "firebase-admin";
import { Commercial, Member } from "../models/model";
const db = admin.firestore()

export const add = firestore
.document('commercials/{docId}')
.onCreate( async(snapshot, context) => {
    const commercial = snapshot.data() as Commercial
    const memberSnapshot = await db.collection('members').doc(commercial.memberId).get()

    if(!memberSnapshot.exists) return
    
    const member = memberSnapshot.data() as Member
    return admin.auth().createUser(
        {
            password: commercial.password,
            phoneNumber: commercial.stk_a.e164Number,
            displayName: `${member.name} ${member.lastName}`,
            disabled: false,
        }
    )
    .then(res => db.collection('members').doc(commercial.memberId).update({...member, uid: res.uid} as Member))
})

export const update = firestore
.document('commercials/{docId}')
.onUpdate( async(snapshot, context) => {
    const commercial = snapshot.before.data() as Commercial
    const memberSnapshot = await db.collection('members').doc(commercial.memberId).get()

    if(!memberSnapshot.exists) return
    
    const member = memberSnapshot.data() as Member
    return admin.auth().updateUser(member.uid!, {
        password: member.password
    }).then(() => admin.auth().revokeRefreshTokens(member.uid!))
})

export const del = firestore
.document('commercials/{docId}')
.onDelete( async(snapshot, context) => {
    const commercial = snapshot.data() as Commercial
    const memberSnapshot = await db.collection('members').doc(commercial.memberId).get()

    if(!memberSnapshot.exists) return
    
    const member = memberSnapshot.data() as Member
    return admin.auth().deleteUser(member.uid!)
    .then(() => admin.auth().revokeRefreshTokens(member.uid!))
})