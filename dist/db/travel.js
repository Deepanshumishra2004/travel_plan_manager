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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTravelPlan = createTravelPlan;
exports.getTravelPlans = getTravelPlans;
exports.updateTravelPlan = updateTravelPlan;
const __1 = require("..");
function createTravelPlan(userId, title, destinationCity, destinationCountry, startDate, endDate, budget) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield __1.client.query(`INSERT INTO travel_plans (
      user_id, title, destination_city, destination_country, start_date, end_date, budget
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [userId, title, destinationCity, destinationCountry, startDate, endDate, budget]);
        return result;
    });
}
function getTravelPlans(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield __1.client.query(`SELECT * FROM travel_plans WHERE user_id = $1`, [userId]);
        return result;
    });
}
function updateTravelPlan(planId, userId, title, budget) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield __1.client.query(`UPDATE travel_plans SET title = $1, budget = $2 WHERE id = $3 AND user_id = $4 RETURNING *`, [title, budget, planId, userId]);
        return result;
    });
}
