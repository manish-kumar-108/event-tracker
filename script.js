let eventsArray = [];

window.onload = function() {
    console.log("page loaded yesss"); 
    let savedEvents = localStorage.getItem("myEvents");
    
    if (savedEvents != null) {
        eventsArray = JSON.parse(savedEvents); 
    }
    renderEvents();
};

// function to show the other box
function checkIfOther() {
    let selectBox = document.getElementById("eventType");
    let otherBox = document.getElementById("otherBox");
    
    if (selectBox.value == "other") {
        otherBox.style.display = "block";
    } else {
        otherBox.style.display = "none";
    }
}

document.getElementById("addEventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let nameInput = document.getElementById("eventName").value;
    let dateInput = document.getElementById("eventDate").value;
    let timeInput = document.getElementById("eventTime").value;
    let typeInput = document.getElementById("eventType").value;

    // if other is chosen, grab what they typed instead
    if (typeInput == "other") {
        typeInput = document.getElementById("otherBox").value;
    }

    let newEvent = {
        id: Date.now(),
        name: nameInput,
        date: dateInput,
        time: timeInput,
        type: typeInput
    };

    eventsArray.push(newEvent);
    localStorage.setItem("myEvents", JSON.stringify(eventsArray));

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("otherBox").value = "";
    
    // hide box again just in case
    document.getElementById("otherBox").style.display = "none";
    document.getElementById("eventType").value = "hackathon";

    renderEvents();
});

function renderEvents() {
    let container = document.getElementById("eventsContainer");
    container.innerHTML = ""; 
    
    // check if no events
    if (eventsArray.length == 0) {
        container.innerHTML = "<center><h3 style='color: gray;'>No upcoming events. You are free!</h3></center>";
        return; // stops the function here
    }

    eventsArray.sort(function(a, b) {
        let d1 = new Date(a.date).getTime();
        let d2 = new Date(b.date).getTime();
        return d1 - d2;
    });

    for (let i = 0; i < eventsArray.length; i++) {
        let current = eventsArray[i];

        let now = new Date().getTime();
        let eventDate = new Date(current.date).getTime();
        
        let timeDiff = eventDate - now;
        let msInDay = 1000 * 60 * 60 * 24; 
        let daysLeft = Math.ceil(timeDiff / msInDay); 

        let badgeColor = "";
        if (current.type == "hackathon") {
            badgeColor = "bg-hackathon";
        } else if (current.type == "deadline") {
            badgeColor = "bg-deadline";
        } else if (current.type == "exam") {
            badgeColor = "bg-exam";
        } else if (current.type == "event") {
            badgeColor = "bg-event";
        } else {
            badgeColor = "bg-other"; // fallback color for custom types
        }

        let cardClass = "";
        let textToShow = daysLeft + " Days Left";

        if (daysLeft < 0) {
            cardClass = "overdue";
            textToShow = "OVERDUE!!!";
        } else if (daysLeft <= 3 && daysLeft >= 0) {
            cardClass = "urgent";
        } else if (daysLeft == 0) {
            textToShow = "TODAY";
        }

        // Add time to display if they typed one
        let timeDisplay = "";
        if (current.time != "") {
            timeDisplay = " @ " + current.time;
        }

        let htmlString = "<div class='event-card " + cardClass + "'>";
        htmlString += "<h3>" + current.name + "</h3>";
        htmlString += "<span class='badge " + badgeColor + "'>" + current.type + "</span>";
        htmlString += "<p>Date: " + current.date + timeDisplay + "</p>";
        htmlString += "<h2>" + textToShow + "</h2>";
        htmlString += "<button class='delete-btn' onclick='deleteEvent(" + current.id + ")'>Delete</button>";
        htmlString += "</div>";

        container.innerHTML += htmlString;
    }
}

function deleteEvent(id) {
    console.log("deleting id: " + id);
    
    let newArr = [];
    for (let i = 0; i < eventsArray.length; i++) {
        if (eventsArray[i].id != id) {
            newArr.push(eventsArray[i]);
        }
    }
    
    eventsArray = newArr;
    localStorage.setItem("myEvents", JSON.stringify(eventsArray));
    renderEvents();
}