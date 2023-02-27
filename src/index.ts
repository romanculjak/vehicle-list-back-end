import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'
import { Request, Response } from "express";


const express = require('express');
const cors = require('cors');

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors({origin:true}));

const db = admin.firestore();

//routes

// app.get("/api/createmake", (req: Request, res: Response)=>{
//     return res.status(200).send("Hello, cloud functions are working as expected!");
// })

// app.get("/api/makes",async (req: Request, res: Response) => {
//     try{
//         const result = await (await db.collection('vehiclemake').get()).docs;
//         // const data = result.map((item)=> item.data());
//         const data = result.map(item=>{

//             return (
//                 {id:item.id, ...item.data()}
//             )
//         })
        

//         res.status(200).send({status:'success', msg:'data saved', docs:data})
//     } catch{
//         res.status(500).send({status:'failed', msg:'something failed'})
//     }
// })


app.post("/api/createmake",async (req: Request, res: Response) => {
    
    try{

        const result = await db.collection('vehiclemake').add({
            name: req.body.name,
            country: req.body.country
        })

        res.status(200).send({status:'success', msg:'make was created', data:{id: result.id, ...result.get()}})

    } catch{
        res.status(500).send({status:'failed', msg:'something failed'})
    }
})

app.put("/api/updatemake",async (req: Request, res: Response) => {

    try{

        await db.collection('vehiclemake').doc(req.body.id).set({
            name: req.body.name,
            country: req.body.country
        })

        res.status(200).send({status:'success', msg:'make data updated'})

    } catch{
        res.status(500).send({status:'failed', msg:'something failed'})
    }
})


app.post("/api/createmodel",async (req: Request, res: Response) => {

    try{

        const result = await db.collection('vehiclemodel').add({
            name: req.body.name,
            makeId: req.body.makeId
        })

        res.status(200).send({status:'success', msg:'model created', data:{id: result.id, ...result.get()}})

    } catch{
        res.status(500).send({status:'failed', msg:'something failed'})
    }
})

app.get("/api/models",async (req: Request, res: Response) => {

    try{

        const result = await (await db.collection('vehiclemodel').get()).docs;
        
        const data = result.map(item=>{

            return (
                {id:item.id, ...item.data()}
            )
        })
        
        res.status(200).send({status:'success', msg:'models fetched', docs:data})

    } catch{
        res.status(500).send({status:'failed', msg:'something failed'})
    }
})


app.put("/api/updatemodel",async (req: Request, res: Response) => {

    try{

        await db.collection('vehiclemodel').doc(req.body.id).set({
            name: req.body.name,
            makeId: req.body.makeId
        })

        res.status(200).send({status:'success', msg:'model data updated'})

    } catch{
        res.status(500).send({status:'failed', msg:'something failed'})
    }
})

// app.get("/api/makes/sort", async (req : Request, res: Response) => {
    
    

//     try{
//     const result = await (await db.collection('vehiclemake').where('country', '==', req.query.country).limit(parseInt(req.query.limit?.toString()!)).get()).docs;

//     const data = result.map(item=>{

//         return (
//             {id:item.id, ...item.data()}
//         )
//     })
    

//     res.status(200).send({status:'success', msg:'data saved', docs:data})
// }catch(e){
//     res.status(500).send({status:'failed', msg:'i dont know', e})
// }

// })

app.get("/api/makes/", async (req : Request, res: Response) => {
    
    
    const country = req.query.country;
    const limit = req.query.limit;

    let data;

    try{

        if(country){

            const result = await (await db.collection('vehiclemake').where('country', '==', req.query.country).limit(limit ? parseInt(req.query.limit?.toString()!) : 6).get()).docs;

            const length = await db.collection('vehiclemake').count().get();

            data = result.map(item=>{

                return (
                    {id:item.id,itemsLength:length.data().count, ...item.data()}
                )
            })
            
        }
        else{

            const result = await (await db.collection('vehiclemake').limit(limit ? parseInt(req.query.limit?.toString()!) : 6).get()).docs;

            const length = await db.collection('vehiclemake').count().get();


            data = result.map(item=>{

                return (
                    {id:item.id,itemsLength:length.data().count, ...item.data()}
                )
            })

        }

    

    res.status(200).send({status:'success', msg:'makes data has been fetched successfully', docs:data})
    
}catch(e){
    res.status(500).send({status:'failed', msg:'makes data has been FAILED to be retreived successfully', e})
}

})



exports.app = functions.https.onRequest(app);

