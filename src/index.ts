import { Client } from 'pg'
import { DB_URL } from './config';
import express from 'express';
import bcrypt from "bcrypt";
import pg from "pg";
import { createUser } from './db/user';
import Jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import { userMiddleWare } from './middleware';
import { createTravelPlan, getTravelPlans, updateTravelPlan } from './db/travel';


const app = express()
app.use(express.json())

export const client = new Client({
    connectionString: DB_URL
});

app.post("/signup",async (req,res)=>{
    const email = req.body.email;
    const name = req.body.username;
    const userpassword = req.body.password;

    const password = await bcrypt.hash(userpassword,5);
    console.log("hash password :",password);

    await createUser(email, password ,name);

    res.json({
        message : "you have signed up"
    })
})
// @ts-ignore
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const query1 = `SELECT * FROM users WHERE email=$1;`;
        const result = await client.query(query1, [email]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "incorrect credentials" });
        }

        const users = result.rows[0];

        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.status(403).json({ message: "invalid email or password" });
        }

        const token = Jwt.sign({ id: users.id, email: users.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.json({ message: "successfully signed in", token });
    } catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({ message: "Internal system error" });
    }
});

// @ts-ignore
app.post("/travelplan",userMiddleWare,async(req,res)=>{
    const {title,destinationCity,destinationCountry,startDate,endDate,budget}=req.body;
    const userId = (req as any).user.id;

    try{
        const result = await createTravelPlan(userId,title,destinationCity,destinationCountry,startDate,endDate,budget)
        return res.json({message:"Travel Plan created", data:result.rows[0]})
    }catch (err) {
        console.error("Error creating travel plan:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

})

// @ts-ignore
app.get("/travelplan",userMiddleWare, async(req,res)=>{
    const userId = (req as any).user.id;
    try{
        const result = await getTravelPlans(userId);
        return res.json({message : "All Travel Plans", data: result.rows})
    }catch (err) {
        console.error("Error fetching travel plans:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

})

// @ts-ignore
app.put("/travelplan/:id",userMiddleWare,async (req,res)=>{
    const userId = (req as any).user.id;
    const planId = (req as any).params.id;

    const {title,budget}=req.body;

    try{
        const result = await updateTravelPlan(planId, userId, title, budget);
        return res.json({message : "travel plan is updated", data: result.rows[0]})
    }catch (err) {
        console.error("Error updating travel plan:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
})


client.connect()
app.listen("3000")