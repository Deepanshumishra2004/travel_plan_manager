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
const __1 = require("../..");
const user_1 = require("../user");
const setup_1 = require("../setup");
const travel_1 = require("../travel");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.client.connect();
    yield (0, setup_1.dropTables)();
    yield (0, setup_1.createTables)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.client.end();
}));
describe('User Database Operations', () => {
    test('createUser inserts a new user into the database', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = 'testuser';
        const password = 'testpass';
        const name = 'Test User';
        yield (0, user_1.createUser)(username, password, name);
        const user = yield __1.client.query('SELECT * FROM users WHERE username = $1', [username]);
        expect(user.rows[0]).toHaveProperty('username', username);
        expect(user.rows[0]).toHaveProperty('name', name);
        expect(user.rows[0].password).toBe(password);
    }));
    test('getUser retrieves a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        const user = yield (0, user_1.getUser)(userId);
        expect(user).toHaveProperty('id', userId);
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
    }));
});
describe('Travel Plan Operations', () => {
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield __1.client.query('SELECT id FROM users WHERE username = $1', ['testuser']);
        userId = res.rows[0].id;
    }));
    test('createTravelPlan inserts a new travel plan for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'Test Travel Plan';
        const destinationCity = 'Paris';
        const destinationCountry = 'France';
        // Use the next day to avoid timezone issues
        const startDate = '2024-06-02';
        const endDate = '2024-06-11';
        const budget = 2500;
        const travelPlan = yield (0, travel_1.createTravelPlan)(userId, title, destinationCity, destinationCountry, startDate, endDate, budget);
        expect(travelPlan).toHaveProperty('id');
        expect(travelPlan.title).toEqual(title);
        expect(travelPlan.destination_city).toEqual(destinationCity);
        expect(travelPlan.destination_country).toEqual(destinationCountry);
        // Format the received date to match our input format
        const receivedStartDate = new Date(travelPlan.start_date);
        const receivedEndDate = new Date(travelPlan.end_date);
        const formatDate = (date) => {
            return date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
        };
        expect(formatDate(receivedStartDate)).toEqual(startDate);
        expect(formatDate(receivedEndDate)).toEqual(endDate);
        expect(Number(travelPlan.budget)).toEqual(budget);
    }));
    test('updateTravelPlan updates the title or budget for a travel plan', () => __awaiter(void 0, void 0, void 0, function* () {
        const { id: planId } = yield (0, travel_1.createTravelPlan)(userId, 'Original Title', 'Tokyo', 'Japan', '2024-09-02', '2024-09-11', 3000);
        const updatedPlan = yield (0, travel_1.updateTravelPlan)(planId, 'Updated Title', 3500);
        expect(updatedPlan === null || updatedPlan === void 0 ? void 0 : updatedPlan.title).toEqual('Updated Title');
        expect(Number(updatedPlan === null || updatedPlan === void 0 ? void 0 : updatedPlan.budget)).toEqual(3500);
    }));
    test('getTravelPlans retrieves all travel plans for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const travelPlans = yield (0, travel_1.getTravelPlans)(userId);
        expect(travelPlans.length).toBeGreaterThan(0);
        travelPlans.forEach(plan => {
            expect(plan).toHaveProperty('id');
            expect(plan.user_id).toEqual(userId);
        });
    }));
});
