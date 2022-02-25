import { firestore } from "firebase-functions";
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
    )
    .then(res => db.collection('members').doc(docId).update({...member, uid: res.uid} as Member))
})

export const supAndAdminUpdate = firestore
.document('members/{docId}')
.onUpdate( async(snapshot, context) => {
    const member = snapshot.after.data() as Member

    if (member.role !== "ADMINISTRATOR" && member.role !== "SUPERVISOR" && member.uid) { return }

    return admin.auth().updateUser(member.uid!, {
        password: member.password
    })
    .then(() => admin.auth().revokeRefreshTokens(member.uid!))
})

export const supAndAdminDelete = firestore
.document('members/{docId}')
.onDelete( async(snapshot, context) => {
    const member = snapshot.data() as Member

    if (member.role !== "ADMINISTRATOR" && member.role !== "SUPERVISOR" && member.uid) { return }

    return admin.auth().deleteUser(member.uid!)
    .then(() => admin.auth().revokeRefreshTokens(member.uid!))
})