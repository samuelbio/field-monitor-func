import * as admin from "firebase-admin";
admin.initializeApp();

import * as comFunc from  "./functions/commercial.function";
export const COMMERCIAL_CREATE = comFunc.add
export const COMMERCIAL_UPDATE = comFunc.update
export const COMMERCIAL_DELETE = comFunc.del

import * as memberFunc from  "./functions/userCreation.function";
export const SUPERVISOR_ADMINISTRATOR_CREATE = memberFunc.supAndAdminCreation
export const SUPERVISOR_ADMINISTRATOR_UPDATE = memberFunc.supAndAdminUpdate
export const SUPERVISOR_ADMINISTRATOR_DETELE = memberFunc.supAndAdminDelete


// import * as functions from 'firebase-functions';
// import * as express from "express";
// import * as cors from "cors";
// import { ficheRouter } from './routers/fiche.route';
// import { authRouter } from "./routers/auth.route";
// import { RegisterRouter } from "./routers/registre.route";

// const app = express();

// here we are adding middleware to parse all incoming requests as JSON 

// app.use(
//   express.urlencoded({
//     extended: true
//   })
// )
  
// app.use(express.json())

// app.use(cors({ origin: true}))

// app.use('/fiches', ficheRouter)
// app.use('/registers', RegisterRouter)
// app.use('/auth', authRouter)

// export const api = functions.https.onRequest(app)