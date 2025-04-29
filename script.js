let l_layout = 0;
let b_layout = 0;
let c_spacing = 0;
let n_rods = 0;
let l_rods = 0;
let d_burial = 0;
let soil_res = 0;
let df = 0;
let grid_current = 0;
let grid_resistance = 0;
let gpr = 0;
let m_gridcurrent = 0;
let t_current = 0;

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

document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners for auto-calculation of Voltage Touch 70
    document.getElementById("Cs").addEventListener("input", calculateVoltageTouch70);
    document.getElementById("Ps").addEventListener("input", calculateVoltageTouch70);
    document.getElementById("t_current").addEventListener("input", calculateVoltageTouch70);

    document.getElementById('d_burial').addEventListener("input", calculateVoltageStep);
});

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
    } else {
        alert("Please Input The Valid Values");
        return;
    }
}

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function calculateResistance() {
    let l_layout = parseFloat(document.getElementById("l_layout").value);
    let b_layout = parseFloat(document.getElementById("b_layout").value);
    let c_spacing = parseFloat(document.getElementById("c_spacing").value);
    let n_rods = parseFloat(document.getElementById("n_rods").value);
    let l_rods = parseFloat(document.getElementById("l_rods").value);
    let d_burial = parseFloat(document.getElementById("d_burial").value);
    let soil_res = parseFloat(document.getElementById("soil_res").value);

    if (l_layout > 0 && b_layout > 0 && c_spacing > 0 && l_rods > 0 && n_rods > 0 && d_burial > 0) {
        let n_conductor = Math.ceil(l_layout / c_spacing);
        document.getElementById("n_conductor").value = n_conductor.toFixed(2);
        let total_rods = Math.ceil(n_rods * l_rods);
        document.getElementById("total_rods").value = total_rods.toFixed(2);
        let total_burried_conductor = Math.ceil((((l_layout / c_spacing) + 1) * b_layout) + (((b_layout / c_spacing) + 1) * l_layout));
        document.getElementById("total_buried_conductor").value = total_burried_conductor.toFixed(2);
        let total_buried_Con_rod = Math.ceil(total_rods + total_burried_conductor);
        document.getElementById("total_buried_con_rod").value = total_buried_Con_rod.toFixed(2);
        let c_length_x = l_layout;
        document.getElementById("c_length_x").value = c_length_x.toFixed(2);
        let c_length_y = b_layout;
        document.getElementById("c_length_y").value = c_length_y.toFixed(2);
        let l_perimeter = Math.ceil(l_layout * 4);
        document.getElementById("l_perimeter").value = l_perimeter.toFixed(2);
        let a_grid = (l_layout * b_layout);
        document.getElementById("a_grid").value = a_grid.toFixed(2);
        let grid_resistance = soil_res * ((1 / total_buried_Con_rod) + (1 / (Math.sqrt(20 * a_grid))) * (1 + (1 / (1 + (d_burial * (Math.sqrt(20 / a_grid)))))));
        document.getElementById("grid_resistance").value = grid_resistance.toFixed(2);
    } else {
        alert("Please Input The Valid Values");
        return;
    }
}

function calculateGridcurrent() {
    let rms_current = parseFloat(document.getElementById("rms_current").value);
    let grid_current = rms_current;
    document.getElementById("grid_current").value = grid_current.toFixed(2);

    let df = parseFloat(document.getElementById("df").value);

    if (df > 0) {
        let m_gridcurrent = grid_current * df;
        document.getElementById("m_gridcurrent").value = m_gridcurrent.toFixed(2);
    } else {
        alert("Please Input The Valid Values");
        return;
    }
}

function calculateGPR() {
    let grid_resistance = parseFloat(document.getElementById("grid_resistance").value);
    let m_gridcurrent = parseFloat(document.getElementById("m_gridcurrent").value);

    document.getElementById("grid_resistance_output").value = grid_resistance.toFixed(2);
    document.getElementById("max_grid_current").value = m_gridcurrent.toFixed(2);

    if (m_gridcurrent > 0 && grid_resistance > 0) {
        let gpr = m_gridcurrent * grid_resistance;
        document.getElementById("gpr").value = gpr.toFixed(2);
    } else {
        alert("Please Input The Valid Values");
        return;
    }
}

function calculateMesh() {
    let l_perimeter = parseFloat(document.getElementById("l_perimeter").value);
    let total_buried_conductor = parseFloat(document.getElementById("total_buried_conductor").value);
    let nb = parseFloat(document.getElementById("nb").value);
    let nc = parseFloat(document.getElementById("nc").value);
    let nd = parseFloat(document.getElementById("nd").value);
    let l_layout = parseFloat(document.getElementById("l_layout").value);
    let c_spacing = parseFloat(document.getElementById("c_spacing").value);
    let h = parseFloat(document.getElementById("h").value);
    let dia = parseFloat(document.getElementById("dia").value);
    let ho = parseFloat(document.getElementById("ho").value);
    let n_conductor = parseFloat(document.getElementById("n_conductor").value);
    let soil_res = parseFloat(document.getElementById("soil_res").value);
    let m_gridcurrent = parseFloat(document.getElementById("m_gridcurrent").value);
    let l_rods = parseFloat(document.getElementById("l_rods").value);
    let c_length_x = parseFloat(document.getElementById("c_length_x").value);

    if (nb > 0 && nc > 0 && nd > 0 && h > 0 && ho > 0) {
        let na = 2 * l_perimeter / total_buried_conductor;
        document.getElementById("na").value = na.toFixed(2);

        let n = na * nb * nc * nd;
        document.getElementById("n").value = n.toFixed(2);

        let ki = 0.644 + 0.148 * n;
        document.getElementById("ki").value = ki.toFixed(2);

        let kii = 1 / Math.pow(2 * l_layout, 2 / l_layout);
        document.getElementById("kii").value = kii.toFixed(2);

        let kh = Math.sqrt(1 + (h / ho));
        document.getElementById("kh").value = kh.toFixed(2);

        let km = (1 / (2 * Math.PI)) * ((
            Math.log(
                (Math.pow(c_spacing, 2) / (16 * h * dia)) +
                (Math.pow(c_spacing + (2 * h), 2) / (8 * c_spacing * dia)) -
                (h / (4 * dia))
            )
        ) + (kii / kh) * (
            Math.log(8 / (Math.PI * (2 * n_conductor - 1)))
        ));
        document.getElementById("km").value = km.toFixed(2);

        let e_mesh = soil_res * m_gridcurrent * km * ki / (
            total_buried_conductor + (1.55 + 1.22 * (
                l_rods / Math.sqrt(Math.pow(c_length_x, 2))
            )) * l_rods);
        document.getElementById("e_mesh").value = e_mesh.toFixed(2);
    } else {
        alert("Please Input The Valid Values");
        return;
    }
}

function calculateVoltageTouch70() {
    const Cs = parseFloat(document.getElementById("Cs").value) || 0;
    const Ps = parseFloat(document.getElementById("Ps").value) || 0;
    const t = parseFloat(document.getElementById("t_current").value) || 0;

    document.getElementById("t").value = t.toFixed(2);

    // Replace this with your actual calculation logic if different
    const etouch70 = (1000 + (1.5 * Cs * Ps) * 0.157) / Math.sqrt(t);;

    if (!isNaN(etouch70)) {
        document.getElementById("etouch70").value = etouch70.toFixed(2);

        // Ambil nilai mesh voltage dari input
        const e_mesh = parseFloat(document.getElementById("e_mesh")?.value) || 0;

        // Hasil perbandingan dan pesan
        let message = "";
        if (e_mesh < etouch70) {
            message = "The mesh voltage is safely below the touch voltage threshold — therefore, it's safe";
        } else {
            message = "The calculated mesh voltage exceeds the tolerable touch voltage — design modifications are required";
        }

        // Tampilkan pesan ke elemen hasil jika ada
        const resultElement = document.getElementById("etouch70_result");
        if (resultElement) {
            resultElement.textContent = message;
        }
    }
}

function calculateVoltageStep() {
    const h = parseFloat(document.getElementById("d_burial").value) || 0;
    const parallel_conductor = parseFloat(document.getElementById("parallel_conductor").value) || 0;
    const c_spacing = parseFloat(document.getElementById("c_spacing").value) || 0;
    
}