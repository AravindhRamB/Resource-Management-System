/**
 * ==========================================================
 * File        : claimService.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Service for handling claims and expenses
 * ==========================================================
 */
const pool = require("../database/pg_conn");

exports.createClaimWithExpenses = async (payload) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insert into reimb_claims
        const claimQuery = `
            INSERT INTO reimb_claims (project, claim_number, place_of_visit)
            VALUES ($1, $2, $3)
            RETURNING id, claim_number
        `;

        const claimValues = [payload.project, payload.claim_number, payload.place_of_visit];
        const claimResult = await client.query(claimQuery, claimValues);
        const claimId = claimResult.rows[0].id;

        // Insert related expenses
        const expenses = payload.expenses || [];
        for (const exp of expenses) {
            const expenseQuery = `
                INSERT INTO claim_expenses 
                    (claim_id, category, currency, bill_raised_date, bill_date, paid_to, vendor, advance_paid, amount)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `;
            const expenseValues = [
                claimId,
                exp.category,
                exp.currency,
                payload.bill_raised_date,
                exp.bill_date,
                exp.paid_to,
                exp.vendor,
                payload.advance_paid || 0,
                exp.amount
            ];
            await client.query(expenseQuery, expenseValues);
        }

        await client.query("COMMIT");

        return { claim_id: claimId, claim_number: claimResult.rows[0].claim_number };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
