// Initialize Firebase
var config = {
    apiKey: "AIzaSyCDbm5EXDkE_zS2rNvliaBSefARlDvVLr0",
    authDomain: "myexampleproj-a46aa.firebaseapp.com",
    databaseURL: "https://myexampleproj-a46aa.firebaseio.com",
    projectId: "myexampleproj-a46aa",
    storageBucket: "myexampleproj-a46aa.appspot.com",
    messagingSenderId: "169778421609"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//initial variables

var name = "";
var destination = "";
var frequency = 0;
var next = 0;
var minutes = 0;

// Add a new train click function
$('#btn-add').on('click', function(){
	console.log("Submit Clicked")
	var newName = $("#train-name").val().trim();
	var newDest = $("#train-destination").val().trim();
	var newTime = $("#train-time").val().trim();
	var newFreq = $("#time-freq").val().trim();
	//tests to see if input captured
	// console.log(newName);
	// console.log(newDest);
	// console.log(newTime);
	// console.log(newFreq);
	
	// Convert initial time
    // makes sure it comes before current time
    newTime = moment(moment(newTime,"hh:mm").subtract(1, "years"),"hh:mm").format("hh:mm");

	database.ref().push({
		name:  newName,
		dest: newDest,
		start: newTime,
		freq: newFreq,
})
	//test to see if added to database
	// console.log(newTrain.name);
	// console.log(newTrain.dest);
	// console.log(newTrain.start);
	// console.log(newTrain.freq);

	$("#train-name").val("");
	$("#train-destination").val("");
	$("#train-time").val("");
	$("#time-freq").val("");

	return false;
}); //close on click

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	//test output
	//console.log("childsnap" + childSnapshot.val().name); //console log shows names from Firebase

	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var start = childSnapshot.val().start;
	var freq = childSnapshot.val().freq;
	//console.log(name); //console log shows updated names

	// Calculate minutes away
    var timeDifference = moment().diff(moment(start,"hh:mm"),'m');
    var timeRemaining = timeDifference % freq;
    var timeMinsAway = freq - timeRemaining;
    //console.log("Time diff in minutes:" + timeDifference); 
    //console.log("Time remaining before the next train:" + timeRemaining);

    // Calculate next arrival
    var timeNext = moment().add(timeMinsAway,'m');
    //console.log("Minutes until the next train " + timeNext);

    // Set variables
    var next = moment(timeNext).format("hh:mm");
    console.log("Formatted minutes: " + next);
    var away = timeMinsAway;
    console.log("Minutes away: " + away);
  

	$("#table-data").append(
		"<tr><td>" + name + 
		"</td><td>" + dest + 
		"</td><td>" + freq + 
		"</td><td>" + next + 
		"</td><td>" + away + 
		"</td></tr>");

}, function(errorObject){
	console.log("oh bumpers!"+ errorObject.code)

}); //close child added