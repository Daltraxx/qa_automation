//get correct table and query records with necessary fields
let table = base.getTable("QA Testing");
let query = await table.selectRecordsAsync({
    fields: ["Daily Sanity", "Sanity Tester"]
});

let recordDetails = query.records;

//get and assign values for fields in query
recordDetails.forEach((record) => {
    record["Daily Sanity"] = record.getCellValueAsString("Daily Sanity");
    record["Sanity Tester"] = record.getCellValueAsString("Sanity Tester");
});

//create empty array and then store record ids which have Daily Sanity checked, i.e. the ones that need a Tester
let recordsToBeUpdated = [];

recordDetails.forEach((record) => {
    if (record["Daily Sanity"]) {
        recordsToBeUpdated.push(record.id);
    }
});

//get all available collaborators
let allCollaborators = base.activeCollaborators;

//get array of only applicable QA collaborators
const qaCollaboratorNames = ["Douglas Bewernick", "Lawrence Duan", "Charles Mack"];
let qaCollaborators = [];

allCollaborators.forEach((collaborator) => {
    if (qaCollaboratorNames.includes(collaborator.name)) {
        qaCollaborators.push(collaborator);
    }
});

//get today's date
const date = new Date();
const day = date.getDate();
const dayName = date.getDay();


//create arrays of dates for which people will be responsible for sanity check
const lawrenceDates = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];
const charlesDates = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];
const dougDates = [3, 6 ,9, 12, 15, 18, 21, 24, 27, 30];

//get "today's tester" based on date, but not on weekends
let todaysTester;
if (dayName !== 6 && dayName !== 0) {
    if (lawrenceDates.includes(day)) {
        todaysTester = qaCollaborators[1];
    } else if (charlesDates.includes(day)) {
        todaysTester = qaCollaborators[2];
    } else {
        todaysTester = qaCollaborators[0];
    }
};



//update records with assigned tester
if (todaysTester) {
    for (let i = 0; i < recordsToBeUpdated.length; i++) {
        await table.updateRecordAsync(recordsToBeUpdated[i], {
            "Sanity Tester": todaysTester,
        })
    }
};

