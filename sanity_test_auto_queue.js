//get correct table and query records with necessary fields
let table = base.getTable("QA Testing");
let query = await table.selectRecordsAsync({
    fields: ["Test Frequency", "Daily Sanity", "Days Since Last Test"]
});

//save query results in recordDetails variable
let recordDetails = query.records;

/*give records from query results their usable field values and a "Daily Sanity" value of true
if their # of days since the last test is greater than the # of days indicated by the "Test Frequency"*/
recordDetails.forEach((record) => {
    record["Test Frequency"] = record.getCellValueAsString("Test Frequency");
    record["Daily Sanity"] = record.getCellValueAsString("Daily Sanity");
    record["Days Since Last Test"] = Number(record.getCellValueAsString("Days Since Last Test"));

    switch (record["Test Frequency"]) {
        case "Daily":
            record["Daily Sanity"] = true;
        break;
        case "3 Days":
            if (record["Days Since Last Test"] >= 3) {
                record["Daily Sanity"] = true;
            };
        break;
        case "Weekly":
            if (record["Days Since Last Test"] >= 7) {
                record["Daily Sanity"] = true;
            };
        break;
        case "Bi-weekly":
            if (record["Days Since Last Test"] >= 14) {
                record["Daily Sanity"] = true;
            };
        break;
        case "Monthly":
            if (record["Days Since Last Test"] >= 30) {
                record["Daily Sanity"] = true;
            };
    };
});

//get array of record ids for records whose "Daily Sanity" have been set to true
let recordsToBeUpdated = [];

recordDetails.forEach((record) => {
    if (record["Daily Sanity"]) {
        recordsToBeUpdated.push(record.id);
    }
});

//loop through recordsToBeUpdated array to update "Daily Sanity" checkboxes on Airtable
for (let i = 0; i < recordsToBeUpdated.length; i++) {
    await table.updateRecordAsync(recordsToBeUpdated[i], {
    "Daily Sanity": true,
    })
};