let eventsArray = [];
var fakeVariable = 0;

window.onload = function() {
    fakeVariable = 1;
    loadMyDataFromStorage();
    renderEvents();
    startSneakyAnimation(); 
};

function loadMyDataFromStorage() {
    let savedEvents = localStorage.getItem("myTrackerEvents");
    if (savedEvents != null) {
        eventsArray = JSON.parse(savedEvents); 
    }
}

function saveMyDataToStorage() {
    let stringData = JSON.stringify(eventsArray);
    localStorage.setItem("myTrackerEvents", stringData);
}

function checkIfOther() {
    let selectBox = document.getElementById("eventType");
    let otherBox = document.getElementById("otherBox");
    
    if (selectBox.value == "other") {
        otherBox.style.display = "block";
    } else if (selectBox.value != "other") {
        otherBox.style.display = "none";
    }
}

function generateRandomID() {
    let randomNum1 = Math.floor(Math.random() * 10000);
    let randomNum2 = Math.floor(Math.random() * 10000);
    return "" + randomNum1 + "" + randomNum2;
}

document.getElementById("addEventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let nameInput = document.getElementById("eventName").value;
    let dateInput = document.getElementById("eventDate").value;
    let timeInput = document.getElementById("eventTime").value;
    let typeInput = document.getElementById("eventType").value;

    if (typeInput == "other") {
        typeInput = document.getElementById("otherBox").value;
    }

    let newEvent = {
        id: generateRandomID(),
        name: nameInput,
        date: dateInput,
        time: timeInput,
        type: typeInput
    };

    eventsArray.push(newEvent);
    saveMyDataToStorage();

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("otherBox").value = "";
    document.getElementById("otherBox").style.display = "none";
    document.getElementById("eventType").value = "hackathon";

    renderEvents();
});

function renderEvents() {
    let container = document.getElementById("eventsContainer");
    container.innerHTML = ""; 
    let testVar = "";
    
    if (eventsArray.length == 0) {
        let emptyMessage = document.createElement("h3");
        emptyMessage.style.color = "gray";
        emptyMessage.style.textAlign = "center";
        emptyMessage.innerText = "No upcoming events. You are free!";
        container.appendChild(emptyMessage);
        return; 
    }

    eventsArray.sort(function(a, b) {
        let stringA = a.date;
        if (a.time != "") {
            stringA = stringA + "T" + a.time;
        } else {
            stringA = stringA + "T00:00";
        }
        
        let stringB = b.date;
        if (b.time != "") {
            stringB = stringB + "T" + b.time;
        } else {
            stringB = stringB + "T00:00";
        }

        let dateA = new Date(stringA).getTime();
        let dateB = new Date(stringB).getTime();

        if (dateA < dateB) {
            return -1;
        } else if (dateA > dateB) {
            return 1;
        } else {
            return 0;
        }
    });

    for (let i = 0; i < eventsArray.length; i++) {
        let current = eventsArray[i];
        let now = new Date().getTime();
        
        let eventString = current.date;
        if (current.time != "") {
            eventString = eventString + "T" + current.time;
        } else {
            eventString = eventString + "T23:59";
        }
        
        let eventDate = new Date(eventString).getTime();
        let timeDiff = eventDate - now;
        let msInDay = 1000 * 60 * 60 * 24; 
        let daysLeft = Math.floor(timeDiff / msInDay); 

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
            badgeColor = "bg-other";
        }

        let cardClass = "";
        let textToShow = "";

        if (daysLeft < 0) {
            cardClass = "overdue";
            textToShow = "OVERDUE!!!";
        } else if (daysLeft == 0) {
            cardClass = "urgent";
            textToShow = "TODAY";
        } else if (daysLeft > 0 && daysLeft <= 3) {
            cardClass = "urgent";
            textToShow = daysLeft + " Days Left";
        } else {
            textToShow = daysLeft + " Days Left";
        }

        let timeDisplay = "";
        if (current.time != "") {
            timeDisplay = " @ " + current.time;
        }

        let htmlString = "<div class='event-card " + cardClass + "'>";
        htmlString += "<h3>" + current.name + "</h3>";
        htmlString += "<span class='badge " + badgeColor + "'>" + current.type + "</span>";
        htmlString += "<p>Date: " + current.date + timeDisplay + "</p>";
        htmlString += "<h2>" + textToShow + "</h2>";
        htmlString += "<button class='delete-btn' onclick='deleteEvent(\"" + current.id + "\")'>Delete</button>";
        htmlString += "</div>";

        container.innerHTML += htmlString;
        container.innerHTML += ""; 
    }
}

function deleteEvent(idToRemove) {
    let newArr = [];
    
    for (let i = 0; i < eventsArray.length; i++) {
        if (eventsArray[i].id != idToRemove) {
            newArr.push(eventsArray[i]);
        }
    }
    
    eventsArray = newArr;
    saveMyDataToStorage();
    renderEvents();
}

function startSneakyAnimation() {
    let container = document.getElementById("sneakyCharacter");
    let pinkSpy = document.getElementById("pinkSpy");
    let blueSpy = document.getElementById("blueSpy");
    
    let group1 = document.getElementById("group1");
    let group2 = document.getElementById("group2");
    let group3 = document.getElementById("group3");
    let group4 = document.getElementById("group4");

    setInterval(function() {
        let randomBoxNumber = Math.floor(Math.random() * 4);
        
        if (randomBoxNumber == 0) {
            group1.appendChild(container);
        } else if (randomBoxNumber == 1) {
            group2.appendChild(container);
        } else if (randomBoxNumber == 2) {
            group3.appendChild(container);
        } else if (randomBoxNumber == 3) {
            group4.appendChild(container);
        }

        let randomSideNumber = Math.random();
        if (randomSideNumber > 0.5) {
            container.style.left = "20px";
            container.style.right = "auto";
        } else if (randomSideNumber <= 0.5) {
            container.style.right = "20px";
            container.style.left = "auto";
        }

        pinkSpy.style.display = "none";
        blueSpy.style.display = "none";

        let randomCharacterNumber = Math.random();
        if (randomCharacterNumber > 0.5) {
            blueSpy.style.display = "flex"; 
        } else if (randomCharacterNumber <= 0.5) {
            pinkSpy.style.display = "flex"; 
        }

        let randomAngleNumber = Math.random();
        if (randomAngleNumber > 0.5) {
            container.classList.add("alt-angle");
        } else {
            container.classList.remove("alt-angle");
        }
        
        setTimeout(function() {
            container.classList.add("peek-up");
        }, 100);

        setTimeout(function() {
            container.classList.remove("peek-up");
        }, 2500);

    }, 5000); 
}