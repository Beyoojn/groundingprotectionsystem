const materialData = {
    "Copper annealed soft-drawn": [0.00393, 234, 1083, 1.72, 3.42],
    "Copper, commercial hard-drawn": [0.00381, 242, 1084, 1.78, 3.42],
    "Copper-clad steel wire (40%)": [0.00378, 245, 1084, 4.4, 3.85],
    "Copper-clad steel wire (30%)": [0.00378, 245, 700, 5.86, 3.85],
    "Copper-clad steel rod": [0.00378, 245, 1084, 8.62, 3.85],
    "Aluminium EC Grade": [0.00403, 228, 657, 2.86, 2.56],
    "Aluminium 5005 alloy": [0.00353, 263, 652, 3.22, 2.6],
    "Aluminium 6201 alloy": [0.00347, 268, 654, 3.28, 2.6],
    "Aluminium-clad steel wire": [0.0036, 258, 657, 8.48, 3.58],
    "Steel, 1020": [0.0016, 605, 1510, 15.9, 3.28],
    "Stainless-clad steel rod": [0.0016, 605, 1400, 17.5, 4.44],
    "Zinc-coated steel rod": [0.0032, 293, 419, 20.1, 3.93],
    "Stainless steel, 304": [0.0013, 749, 1400, 72, 4.03]
};

function updateInputs() {
    let material = document.getElementById("material").value;
    let inputs = document.querySelectorAll(".property-input");
    
    if (material in materialData) {
        let values = materialData[material];
        inputs.forEach((input, index) => {
            input.value = values[index];
        });
    } else {
        inputs.forEach(input => input.value = "");
    }
}

function calculateSize() {
    let material = document.getElementById("material").value;
    let rms_current = parseFloat(document.getElementById("rms_current").value);
    let tcap = materialData[material] ? materialData[material][4] : 0;
    let t_current = parseFloat(document.getElementById("t_current").value);
    let ar = materialData[material] ? materialData[material][0] : 0;
    let pr = materialData[material] ? materialData[material][3] : 0;
    let ko = materialData[material] ? materialData[material][1] : 0;
    let tm = materialData[material] ? materialData[material][2] : 0;
    let ta = parseFloat(document.getElementById("ta").value);

    if (rms_current > 0 && t_current > 0 && ta > 0 && material !== "") {
        let dia = ((rms_current * 197.4) / (Math.sqrt((tcap / (t_current * pr * ar)) * (Math.log((ko + tm) / (ko + ta)))))) / 1.974;
        document.getElementById("dia").value = dia.toFixed(2);
        let diam = Math.sqrt(dia*4/3.14/1000);
        document.getElementById("diam").value = diam.toFixed(2);
    }else {
        alert("Please Input The Valid Values")
    }
}