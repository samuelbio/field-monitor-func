import * as admin from "firebase-admin";
admin.initializeApp();

import * as functions from 'firebase-functions';
import * as express from "express";
import * as cors from "cors";
import { ficheRouter } from './routers/fiche.route';
import { authRouter } from "./routers/auth.route";
import { RegisterRouter } from "./routers/registre.route";

const app = express();

// here we are adding middleware to parse all incoming requests as JSON 

app.use(
  express.urlencoded({
    extended: true
  })
)
  
app.use(express.json())

app.use(cors({ origin: true}))

app.use('/fiches', ficheRouter)
app.use('/registers', RegisterRouter)
app.use('/auth', authRouter)

export const api = functions.https.onRequest(app)


import * as comFunc from  "./functions/commercial.function";
export const ADD_COMMERCIAL = comFunc.add

import * as memberFunc from  "./functions/userCreation.function";
export const CREATE_SUPERVISOR_ADMINISTRATOR = memberFunc.supAndAdminCreation
