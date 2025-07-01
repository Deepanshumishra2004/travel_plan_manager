import { client } from "..";
import { QueryResult } from "pg";

export async function createTravelPlan(
  userId: number,
  title: string,
  destinationCity: string,
  destinationCountry: string,
  startDate: string,
  endDate: string,
  budget: number
): Promise<QueryResult> {
  const result = await client.query(
    `INSERT INTO travel_plans (
      user_id, title, destination_city, destination_country, start_date, end_date, budget
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, title, destinationCity, destinationCountry, startDate, endDate, budget]
  );
  return result;
}

export async function getTravelPlans(userId: number): Promise<QueryResult> {
  const result = await client.query(
    `SELECT * FROM travel_plans WHERE user_id = $1`,
    [userId]
  );
  return result; 
}

export async function updateTravelPlan(
  planId: number,
  userId: number,
  title?: string,
  budget?: number
): Promise<QueryResult> {
  const result = await client.query(
    `UPDATE travel_plans SET title = $1, budget = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
    [title, budget, planId, userId]
  );
  return result;
}
