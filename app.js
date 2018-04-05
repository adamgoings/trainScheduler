// Initialize Firebase
var config = {
  apiKey: "AIzaSyB25_XwnjVkIPmhBfZdJoMskyt5LeVK7aE",
  authDomain: "train-scheduler-78695.firebaseapp.com",
  databaseURL: "https://train-scheduler-78695.firebaseio.com",
  projectId: "train-scheduler-78695",
  storageBucket: "train-scheduler-78695.appspot.com",
  messagingSenderId: "70018529689"
};
firebase.initializeApp(config);

//global variables
let database = firebase.database();
let newTrainName = "";
let newDestination = "";
let newFrequency = "";
let newfirstArrival = "";
// let newNextArrival = "";
let currentTime = "";

//clicking submit button to grab vals from the input fields
$("#submit-button").on("click", function (event) {

  event.preventDefault();

  //grabs values from the input form fields
  let name = $("#trainNameInput").val().trim();
  let destination = $("#destinationInput").val().trim();
  let frequency = $("#frequencyInput").val().trim();
  let firstTime = $("#firstTimeInput").val().trim();

  //testing to see all values coming into the console
  console.log(name);
  console.log(destination);
  console.log(frequency);
  console.log(firstTime);

  //calculates the Next Arrival and Minutes Away
  let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  //current time of inquiry
  currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  //difference in time between your first time and time of inquiry
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  //finding the remainder from different in minutes divided by frequency of arrival
  let trainRemainder = diffTime % frequency;
  console.log(trainRemainder);

  //finding the minutes until next arrival by subtracting the remainder from the frequency of arrival
  let minTilNextTrain = frequency - trainRemainder;
  console.log("MINUTES UNTIL TRAIN: " + minTilNextTrain);

  //takes the current time and adds the minutes until the next arrival to give us the arrival time
  let newNextArrival = moment().add(minTilNextTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(newNextArrival).format("hh:mm"));
  newNextArrival = moment(newNextArrival).format("hh:mm");


  //send data to firebase
  database.ref().push({
    newTrainName: name,
    newDestination: destination,
    newFrequency: frequency,
    firstArrival: firstTime,
    newNextArrival: newNextArrival,
    minTilNextTrain: minTilNextTrain
  });
});

database.ref().on("child_added", function (snapshot) {

  //stores the snapshot in a variable to call more easily later
  let sv = snapshot.val();
  // console.log(sv);

  //writes the data retrieved from firebase to the table in our html
  $("#tbody").append(
    `
      <tr>
       <td class="trainNameDisplay">${sv.newTrainName}</td>
       <td class="destinationDisplay">${sv.newDestination}</td>
       <td class="frequencyDisplay">${sv.newFrequency}</td>
       <td class="nextArrivalDisplay">${sv.newNextArrival}</td>
       <td class="minutesAwayDisplay">${sv.minTilNextTrain}</td> 
      `
  );

  //resets the form fields to prepare for the next entry
  $("#form").trigger("reset");

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


