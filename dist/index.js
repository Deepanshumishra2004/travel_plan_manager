"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("./db/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("./config");
const middleware_1 = require("./middleware");
const travel_1 = require("./db/travel");
const app = (0, express_1.default)();
app.use(express_1.default.json());
exports.client = new pg_1.Client({
    connectionString: config_1.DB_URL
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const name = req.body.username;
    const userpassword = req.body.password;
    const password = yield bcrypt_1.default.hash(userpassword, 5);
    console.log("hash password :", password);
    yield (0, user_1.createUser)(email, password, name);
    res.json({
        message: "you have signed up"
    });
}));
// @ts-ignore
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const query1 = `SELECT * FROM users WHERE email=$1;`;
        const result = yield exports.client.query(query1, [email]);
        if (result.rows.length === 0) {
            return res.status(403).json({ message: "incorrect credentials" });
        }
        const users = result.rows[0];
        const isMatch = yield bcrypt_1.default.compare(password, users.password);
        if (!isMatch) {
            return res.status(403).json({ message: "invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: users.id, email: users.email }, config_2.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ message: "successfully signed in", token });
    }
    catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({ message: "Internal system error" });
    }
}));
// @ts-ignore
app.post("/travelplan", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, destinationCity, destinationCountry, startDate, endDate, budget } = req.body;
    const userId = req.user.id;
    try {
        const result = yield (0, travel_1.createTravelPlan)(userId, title, destinationCity, destinationCountry, startDate, endDate, budget);
        return res.json({ message: "Travel Plan created", data: result.rows[0] });
    }
    catch (err) {
        console.error("Error creating travel plan:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// @ts-ignore
app.get("/travelplan", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const result = yield (0, travel_1.getTravelPlans)(userId);
        return res.json({ message: "All Travel Plans", data: result.rows });
    }
    catch (err) {
        console.error("Error fetching travel plans:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
// @ts-ignore
app.put("/travelplan/:id", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const planId = req.params.id;
    const { title, budget } = req.body;
    try {
        const result = yield (0, travel_1.updateTravelPlan)(planId, userId, title, budget);
        return res.json({ message: "travel plan is updated", data: result.rows[0] });
    }
    catch (err) {
        console.error("Error updating travel plan:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.client.connect();
app.listen("3000");
