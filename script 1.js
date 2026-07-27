const tubeDatabase = {
    A: {
        "1/4\"": 0.04,
        "3/8\"": 0.12,
        "1/2\"": 0.19,
        "3/4\"": 0.41,
        "1\"": 0.67,
        "1-1/4\"": 0.98,
        "1-1/2\"": 1.50
    },

    B: {
        "1/4\"": 0.067,
        "3/8\"": 0.10,
        "1/2\"": 0.148,
        "3/4\"": 0.25,
        "1\"": 0.424,
        "1-1/4\"": 0.70
    }
};

const tubeType = document.getElementById("tubeType");
const tubeSize = document.getElementById("tubeSize");

const calculateButton = document.getElementById("calculateButton");
const resetButton = document.getElementById("resetButton");

const errorMessage = document.getElementById("errorMessage");

function fillTubeSize(type){

    tubeSize.innerHTML = "";

    const firstOption = document.createElement("option");

    firstOption.value = "";
    firstOption.textContent = "관경 선택";
    firstOption.disabled = true;
    firstOption.selected = true;

    tubeSize.appendChild(firstOption);

    Object.keys(tubeDatabase[type]).forEach(size =>{

        const option = document.createElement("option");

        option.value = size;
        option.textContent = size;

        tubeSize.appendChild(option);

    });

    tubeSize.disabled = false;

}

tubeType.addEventListener("change", function(){

    fillTubeSize(this.value);

});

function toMass(volume, density){

    return volume * density / 1000;

}

function oneDecimal(value){

    return value.toFixed(1);

}
calculateButton.addEventListener("click", function () {

    errorMessage.textContent = "";

    const density = parseFloat(document.getElementById("coolantDensity").value);

    const managementVolume = parseFloat(document.getElementById("managementLevelVolume").value);

    const heaterVolume = parseFloat(document.getElementById("heaterBoxVolume").value);

    const chillerVolume = parseFloat(document.getElementById("chillerVolume").value);

    const customerVolume = parseFloat(document.getElementById("customerEquipmentVolume").value);

    const length = parseFloat(document.getElementById("tubeLength").value);

    const type = tubeType.value;

    const size = tubeSize.value;

    if (
        isNaN(density) ||
        isNaN(managementVolume) ||
        isNaN(heaterVolume) ||
        isNaN(chillerVolume) ||
        isNaN(customerVolume) ||
        isNaN(length) ||
        !type ||
        !size
    ) {

        errorMessage.textContent = "모든 항목을 입력해주세요.";

        return;
    }

    if (
        density < 0 ||
        managementVolume < 0 ||
        heaterVolume < 0 ||
        chillerVolume < 0 ||
        customerVolume < 0 ||
        length < 0
    ) {

        errorMessage.textContent = "음수는 입력할 수 없습니다.";

        return;
    }

    const volumePerMeter = tubeDatabase[type][size];

    const setupTubeVolume = length * volumePerMeter;

    const managementMass = toMass(managementVolume, density);

    const heaterMass = toMass(heaterVolume, density);

    const chillerMass = toMass(chillerVolume, density);

    const customerMass = toMass(customerVolume, density);

    const setupTubeMass = toMass(setupTubeVolume, density);

    const totalMass =
        managementMass +
        heaterMass +
        chillerMass +
        customerMass +
        setupTubeMass;

    const requiredReservoir =
        managementVolume +
        customerVolume +
        setupTubeVolume;
            document.getElementById("tubeVolumePerMeter").textContent =
        volumePerMeter.toFixed(3);

    document.getElementById("setupTubeVolume").textContent =
        oneDecimal(setupTubeVolume);

    document.getElementById("managementLevelMass").textContent =
        oneDecimal(managementMass);

    document.getElementById("heaterBoxMass").textContent =
        oneDecimal(heaterMass);

    document.getElementById("chillerMass").textContent =
        oneDecimal(chillerMass);

    document.getElementById("customerEquipmentMass").textContent =
        oneDecimal(customerMass);

    document.getElementById("setupTubeMass").textContent =
        oneDecimal(setupTubeMass);

    document.getElementById("totalCoolantMass").textContent =
        oneDecimal(totalMass);

    document.getElementById("requiredReservoirVolume").textContent =
        oneDecimal(requiredReservoir);

});
resetButton.addEventListener("click", function () {

    document.querySelectorAll("input").forEach(input => {

        input.value = "";

    });

    tubeType.selectedIndex = 0;

    tubeSize.innerHTML =
        '<option value="" selected disabled>배관 종류를 먼저 선택</option>';

    tubeSize.disabled = true;

    errorMessage.textContent = "";

    const resultIds = [
        "tubeVolumePerMeter",
        "setupTubeVolume",
        "managementLevelMass",
        "heaterBoxMass",
        "chillerMass",
        "customerEquipmentMass",
        "setupTubeMass",
        "totalCoolantMass",
        "requiredReservoirVolume"
    ];

    resultIds.forEach(id => {

        document.getElementById(id).textContent = "-";

    });

});