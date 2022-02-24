import { firestore } from "firebase-functions";
// import { map, merfgeMap, take, tap, toArray } from 'rxjs/operators';

import * as admin from "firebase-admin";
import { Member } from "../models/model";
const db = admin.firestore()

export const supAndAdminCreation = firestore
.document('members/{docId}')
.onCreate( async(snapshot, context) => {
    const docId = snapshot.id
    const member = snapshot.data() as Member

    if (member.role !== "ADMINISTRATOR" && member.role !== "SUPERVISOR") { return }

    return admin.auth().createUser(
        {
            password: member.password,
            email: member.email,
            displayName: `${member.name} ${member.lastName}`,
            disabled: false,
        }
    ).then(res => {
        return db.collection('members').doc(docId).update({...member, uid: res.uid} as Member)
    })

})

export const supAndAdminDelete = firestore
.document('members/{docId}')
.onDelete( async(snapshot, context) => {
    const member = snapshot.data() as Member

    if (member.role !== "ADMINISTRATOR" && member.role !== "SUPERVISOR" && member.uid) { return }

    return admin.auth().deleteUser(member.uid!)

})