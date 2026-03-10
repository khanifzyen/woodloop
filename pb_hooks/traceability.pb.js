/// <reference path="../pb_data/types.d.ts" />

/**
 * WOODLOOP MVP 1 - TRACEABILITY HOOKS
 * 
 * Documentation Reference: docs/13-track_id-rule.md
 * This file contains business logic for automated operations related to Traceability and Tracking IDs.
 */

// Helper to generate random alphanumeric string (A-Z, 2-9) avoiding 0, O, 1, I
function generateRandomString(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ==========================================
// 1. USERS HOOKS
// ==========================================

onRecordBeforeCreateRequest((e) => {
    // Hook: Generate user_code for new users if not provided
    let userCode = e.record.get("user_code");

    if (!userCode || userCode.trim() === "") {
        const role = e.record.get("role");
        let prefix = "USR";

        if (role === "supplier") prefix = "SUP";
        else if (role === "generator") prefix = "GEN";
        else if (role === "aggregator") prefix = "AGG";
        else if (role === "converter") prefix = "CNV";
        else if (role === "buyer") prefix = "BYR";
        else if (role === "enabler") prefix = "ENB";

        // Generate a 5-character string: Prefix (3) + Random (2) -> Actually let's make it Prefix + 3 random to avoid collisions
        // e.g., SUP-A7X
        userCode = `${prefix}${generateRandomString(3)}`;
        e.record.set("user_code", userCode);
    }
}, "users");


// ==========================================
// 2. RAW TIMBER LISTINGS HOOKS
// ==========================================

onRecordBeforeCreateRequest((e) => {
    // Hook: Auto-generate tracking_id for raw timber
    try {
        let trackingId = e.record.get("tracking_id");

        // Generate only if empty
        if (!trackingId || trackingId.trim() === "") {
            // 1. Prefix Category
            const shape = e.record.get("shape");
            const prefix = shape === "log" ? "LOG" : (shape === "sawn" ? "SWN" : "RAW");

            // 2. User Code
            const supplierId = e.record.get("supplier");
            let userCode = "UNK"; // Unknown

            if (supplierId) {
                const userRecord = $app.findRecordById("users", supplierId);
                const code = userRecord.get("user_code");
                if (code) {
                    userCode = code;
                } else {
                    // Fallback to random if old user doesn't have it
                    userCode = `SUP${generateRandomString(3)}`;
                    userRecord.set("user_code", userCode);
                    $app.save(userRecord);
                }
            }

            // 3. Timestamp (YYMMDD)
            const date = new Date();
            const yy = String(date.getUTCFullYear()).slice(-2);
            const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(date.getUTCDate()).padStart(2, '0');
            const dateStr = `${yy}${mm}${dd}`;

            // 4. Random 3 chars
            const randomStr = generateRandomString(3);

            // Format: [KATEGORI]-[ID_PENGGUNA]-[YYMMDD]-[ACAK]
            trackingId = `${prefix}-${userCode}-${dateStr}-${randomStr}`;

            e.record.set("tracking_id", trackingId);
        }
    } catch (err) {
        console.error("Error generating tracking_id for raw timber:", err);
    }
}, "raw_timber_listings");
