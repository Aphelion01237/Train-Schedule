const firebaseConfig = {
    apiKey: "AIzaSyCQ-lTWEWH4X-46uOgYNzhYRCuAQNujQaA",
    authDomain: "trainnnnn-f257b.firebaseapp.com",
    databaseURL: "https://trainnnnn-f257b.firebaseio.com",
    projectId: "trainnnnn-f257b",
    storageBucket: "trainnnnn-f257b.appspot.com",
    messagingSenderId: "1034229438695",
    appId: "1:1034229438695:web:e531f0bb1d20cc8f5cea42"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var dataRef = firebase.database();

var trainObject = {name:"",
destination:"",
frequency:"",
nextArrival:"",
minutesAway:"", 
initialize:function(name, destination, frequency, nextArrival, minutesAway){
    this.name=name;
    this.destination=destination;
    this.frequency=frequency;
    this.nextArrival=nextArrival;
    this.minutesAway=minutesAway;
}}
function updateDisplay(trainObject){
    var addedRow = $("<tr>")
    for(key in trainObject){
        var addedEntry = $("<td>");
        addedEntry.text(trainObject[key]);
        addedRow.append(addedEntry);
    }
    $("#trains").append(addedRow);
}
$('#submit').on("click",function(event){
    event.preventDefault();
    var name = $("#addedTrainName").val().trim();
    var destination = $("#addedDestination").val().trim();
    var frequency = $("#addedFrequency").val().trim();
    var time = $("#addedTime").val().trim(); 
    dataRef.ref().push({
        
        name: name,
        destination: destination,
        frequency: frequency,
        time: time,        
    });
    $("#addedTrainName").val("");
    $("#addedDestination").val("");
    $("#addedFrequency").val("");
    $("#addedTime").val("");
    
    var newTrain = timeConverter(name,destination,frequency,time);
})
function timeConverter(name,destination,frequency,time){
    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = currentTime.diff(firstTimeConverted, "minutes");
    var minutesAway = diffTime % frequency;
    var minutesToNext = frequency - minutesAway;
    var nextArrival = moment().add(minutesToNext, "minutes");
    var newTrain = new trainObject.initialize(name,destination,frequency,nextArrival.format("hh:mm","a"),minutesToNext);
    return newTrain;
}
dataRef.ref().on("child_added", function(snapshot) {
    var storedTrain = timeConverter(snapshot.val().name,snapshot.val().destination,snapshot.val().frequency,snapshot.val().time);
   updateDisplay(storedTrain);
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  setInterval( function(){
    $("#trains").empty();
    dataRef.ref().on("child_added", function(snapshot) {
        var storedTrain = timeConverter(snapshot.val().name,snapshot.val().destination,snapshot.val().frequency,snapshot.val().time);
       updateDisplay(storedTrain);
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });  

  },60000)