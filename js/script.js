loadStates();

document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data === false) {
        document.querySelector("#city").textContent = "";
        document.querySelector("#latitude").textContent = "";
        document.querySelector("#longitude").textContent = "";
        document.querySelector("#zipError").textContent = "Zip code not found";
        document.querySelector("#zipError").style.color = "red";
        return;
    }

    document.querySelector("#zipError").textContent = "";
    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;
}

async function loadStates() {
    let stateMenu = document.querySelector("#state");
    stateMenu.textContent = "";
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);

    try {
        let url = "https://csumb.space/api/allStatesAPI.php";
        let response = await fetch(url);
        let data = await response.json();

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.usps;
            option.textContent = item.state;
            stateMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadCounties() {
    let state = document.querySelector("#state").value;
    let countyMenu = document.querySelector("#county");
    countyMenu.textContent = "";

    if (state === "") {
        let option = document.createElement("option");
        option.textContent = "Select a state first";
        countyMenu.appendChild(option);
        return;
    }

    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let county of data) {
        let option = document.createElement("option");
        option.value = county.county;
        option.textContent = county.county;
        countyMenu.appendChild(option);
    }
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");
    if (username.length === 0) {
        usernameError.textContent = "";
        return false;
    }

    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

    let response = await fetch(url);
    let data = await response.json();

    if (data.available) {
        usernameError.textContent = "Username available!";
        usernameError.style.color = "green";
        return true;
    } else {
        usernameError.textContent = "Username taken";
        usernameError.style.color = "red";
        return false;
    }
}

function suggestPassword() {
    let suggestions = [
        "BlueSky123",
        "Computer456",
        "Welcome789",
        "Coding2026"
    ];

    let randomPassword = suggestions[Math.floor(Math.random() * suggestions.length)];

    document.querySelector("#suggestedPassword").textContent =
        "Suggested password: " + randomPassword;

    document.querySelector("#suggestedPassword").style.color = "blue";
}

async function validateForm(event) {
    event.preventDefault();

    let isValid = true;
    let usernameAvailable = await checkUsername();

    if (usernameAvailable === false) {
        isValid = false;
    }

    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");

    passwordError.textContent = "";

    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    } else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}
