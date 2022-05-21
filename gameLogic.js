let startTime;
let selectedField;
let numberOfTries;
let bestResult;
let recentResult;
let worstResult;
let average;
let resultTable = [];
const fieldsIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function startNewGame() {
    numberOfTries = 3;
    bestResult = "0";
    recentResult = "0";
    worstResult = "0";
    average = "0";
    getDomElementById("result").innerHTML = getResults(recentResult, worstResult, bestResult, average);
    getDomElementById("numberOfTries").innerHTML = getNumberOfTries(numberOfTries);
    getDomElementById("startBtn").classList.add("move-btn");
    getDomElementById("grid").classList.add("showFields");
    getDomElementById("result").classList.add("showFields");
    getDomElementById("numberOfTries").classList.add("showFields");
    getDomElementById("stopGameBtn").classList.add("showFields");
    alert("Click orange field as fastest you can!");
    setTimeout(() => startRound(), 3000);
}

function startRound() {
    selectedField = getDomElementById(fieldsIds[drawNumber()]);
    selectedField.style.backgroundColor = "orange";
    startTime = getCurrentTimeInMilis();
}

function drawNumber() {
    return Math.floor(Math.random() * 9);
}

function fieldClick(id) {
    let localTimeDiffrence = getCurrentTimeInMilis();
    timeDiffrenceResult = localTimeDiffrence - startTime;
    if(id === selectedField.id) {
        proceedGoodMatch(timeDiffrenceResult);
    } else {
        proceedBadMatch(id);
    }
}

function proceedGoodMatch(timeDiffrenceResult) {
    addResult(timeDiffrenceResult);
    bestResult = bestResult === "0" ? `${timeDiffrenceResult}ms` : evaluateBestResult();
    worstResult = worstResult === "0" ? `${timeDiffrenceResult}ms` : evaluateWorstResult();
    average = average === "0" ? `${timeDiffrenceResult}ms` : evaluateAverageResult();
    recentResult = `${timeDiffrenceResult}ms`;
    getDomElementById("result").innerHTML = getResults(recentResult, worstResult, bestResult, average);
    selectedField.style.backgroundColor = "green";
    setTimeout(() => {
        selectedField.style.backgroundColor = "rgb(219, 218, 218)";
        startRound();
    }, 100);
}

function proceedBadMatch(id) {
    getDomElementById(id).style.backgroundColor = "red";
    numberOfTries--;
    getDomElementById("numberOfTries").innerHTML = getNumberOfTries(numberOfTries);
    if (numberOfTries === 0) {
        stopGame();
    } else {
        setTimeout(() => {
            selectedField.style.backgroundColor = "rgb(219, 218, 218)";
            getDomElementById(id).style.backgroundColor = "rgb(219, 218, 218)";
            startRound();
        }, 100);
    }
}

function addResult(timeDiffrenceResult) {
    resultTable.push(timeDiffrenceResult);
    resultTable.sort(compareNumbers);
}

function stopGame() {
    disableAllGameFields();
    getDomElementById("gameOver").style.opacity = "1";
    getDomElementById("stopGameBtn").disabled = true;
    getDomElementById("startNextGame").style.opacity = "1";
}

function startNextGame() {
    getDomElementById("gameOver").style.opacity = "0";
    getDomElementById("startNextGame").style.opacity = "0";
    getDomElementById("stopGameBtn").disabled = false;
    numberOfTries = 3;
    resultTable = [];
    bestResult = "0";
    recentResult = "0";
    worstResult = "0";
    average = "0";
    getDomElementById("result").innerHTML = getResults(recentResult, worstResult, bestResult, average);
    getDomElementById("numberOfTries").innerHTML = getNumberOfTries(numberOfTries);
    resetAllGameFields();
    setTimeout(startRound, 1000);
}

function resetAllGameFields() {
    fieldsIds.forEach(fieldId => {
        let element = getDomElementById(fieldId);
        element.setAttribute("onclick", "fieldClick(this.id)");
        element.style.backgroundColor = "rgb(219, 218, 218)";
        
    });
}

function disableAllGameFields() {
    fieldsIds.forEach(fieldId => {
        getDomElementById(fieldId).removeAttribute("onclick");
    });
}

function getCurrentTimeInMilis() {
    return new Date().getTime();
}

function evaluateBestResult() {
    return `${resultTable[0]}ms`;
}

function evaluateWorstResult() {
    let tableLength = resultTable.length - 1;
    return `${resultTable[tableLength]}ms`
}

function evaluateAverageResult() {
    let sum = 0;
    resultTable.forEach(result => {
        sum += result;
    });
    return `${(Math.round(((sum / resultTable.length) * 100) / 100))}ms`;
}

function compareNumbers(a, b) {
    return a - b;
}

function getDomElementById(id) {
    return document.getElementById(id);
}

function getResults(currentResult, worstResult, bestResult, average) {
    return `<p><strong>Recent time: ${currentResult}</strong></p><br><p><strong>Worst time: ${worstResult}
        </strong></p><br><p><strong>Best time: ${bestResult}</strong></p><br><p><strong>Average: ${average}</strong></p>`;
}

function getNumberOfTries(numberOfTries) {
    return `<p><strong>Chances: ${numberOfTries}</strong></p>`;
}