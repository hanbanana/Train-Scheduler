var config = {
  apiKey: "AIzaSyBNFRmA0hRWHCzYIXy-6YclkYJ5eDmTiyI",
  authDomain: "my-train-scheduler-9c55a.firebaseapp.com",
  databaseURL: "https://my-train-scheduler-9c55a.firebaseio.com",
  projectId: "my-train-scheduler-9c55a",
  storageBucket: "",
  messagingSenderId: "829926253682"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var train = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();

$(document).ready(function () {
  var clockElement = document.getElementById("current-time");

  function updateClock(clock) {
    clock.innerHTML = new Date().toLocaleTimeString();
  }

  setInterval(function () {
    updateClock(clockElement);
  }, 1000);

  updateClock();
});

$("#btn-add").on("click", function (event) {

  event.preventDefault();

  trainName = $("#train-name").val().trim();

  train = $("#train-destination").val().trim();

  firstTrainTime = $("#train-time").val().trim();

  frequency = $("#time-freq").val().trim();

  if (trainName == "") {
    alert("Please fill in all required fields");
    return false;
  }
  if (train == "") {
    alert("Please fill in all required fields");
    return false;
  }
  if (firstTrainTime == "") {
    alert("Please fill in all required fields");
    return false;
  }
  if (frequency == "") {
    alert("Please fill in all required fields");
    return false;
  }

  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  var tRemainder = diffTime % frequency;

  var minutesAway = frequency - tRemainder;

  var nextTrain = moment().add(minutesAway, "minutes");

  var nextArrival = moment(nextTrain).format("hh:mm");

  var nextArrivalUpdate = function () {

    date = moment(new Date())

    datetime.html(date.format('hh:mm'));

  }

  database.ref().push({

    trainName: trainName,

    train: train,

    firstTrainTime: firstTrainTime,

    frequency: frequency,

    minutesAway: minutesAway,

    nextArrival: nextArrival,

    dateAdded: firebase.database.ServerValue.TIMESTAMP

  });

  alert("Form submitted!");


  $("#train-name").val("");

  $("#train-destination").val("");

  $("#train-time").val("");

  $("#time-freq").val("");


  return false;



});

database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {

  $("#table-data").append("<tr><td>" + snapshot.val().trainName + "</td>" +

    "<td>" + snapshot.val().train + "</td>" +

    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" +

    "<td>" + snapshot.val().nextArrival + "</td>" +

    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +

    "</td></tr>");

}, function (errorObject) {

  console.log("Errors handled: " + errorObject.code);

});