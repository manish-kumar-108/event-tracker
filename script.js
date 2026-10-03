let eventsArray = [];

window.onload = function() {
    console.log("page loaded"); 
    let savedEvents = localStorage.getItem("myEvents");
    
    if (savedEvents != null) {
        eventsArray = JSON.parse(savedEvents); 
    }
    renderEvents();
};

document.getElementById("addEventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let nameInput = document.getElementById("eventName").value;
    let dateInput = document.getElementById("eventDate").value;
    let typeInput = document.getElementById("eventType").value;

    // console.log(nameInput); 

    let newEvent = {
        id: Date.now(),
        name: nameInput,
        date: dateInput,
        type: typeInput
    };

    eventsArray.push(newEvent);
    localStorage.setItem("myEvents", JSON.stringify(eventsArray));

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";

    renderEvents();
});

function renderEvents() {
    let container = document.getElementById("eventsContainer");
    container.innerHTML = ""; 
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

        let htmlString = "<div class='event-card " + cardClass + "'>";
        htmlString += "<h3>" + current.name + "</h3>";
        htmlString += "<span class='badge " + badgeColor + "'>" + current.type + "</span>";
        htmlString += "<p>Date: " + current.date + "</p>";
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