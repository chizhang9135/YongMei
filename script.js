const internalPassword = "zhym!8823393@2024";

async function loadComponentsFromJSON() {
    try {
        const response = await fetch('components.json');
        const components = await response.json();

        for (let category in components) {
            components[category].forEach(component => {
                let publicOption = document.createElement("option");
                publicOption.textContent = `${component.style} - $${component.sellingPrice}`;
                publicOption.value = component.sellingPrice;
                document.getElementById(`public-${category}`).appendChild(publicOption);

                let internalOption = document.createElement("option");
                internalOption.textContent = `${component.style} - Cost: $${component.costPrice}, Sell: $${component.sellingPrice}`;
                internalOption.dataset.costPrice = component.costPrice;
                internalOption.value = component.sellingPrice;
                document.getElementById(`internal-${category}`).appendChild(internalOption);
            });
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function calculateTotalPrice(version) {
    const allSelected = Array.from(document.querySelectorAll(`#${version} .component-select`)).every(select => select.value);
    if (!allSelected) {
        alert("Please make a selection for all fields.");
        return;
    }

    let totalPrice = 0;
    let totalCost = 0;
    document.querySelectorAll(`#${version} .component-select`).forEach(select => {
        if (select.value) {
            totalPrice += parseFloat(select.value);
            if (version === 'internal') {
                totalCost += parseFloat(select.selectedOptions[0].dataset.costPrice);
            }
        }
    });
    if (version === 'internal') {
        document.getElementById('internal-total-price').textContent = `Total Internal Cost: $${totalCost.toFixed(2)} | Total Internal Price: $${totalPrice.toFixed(2)}`;
    } else {
        document.getElementById('public-total-price').textContent = `Total Public Price: $${totalPrice.toFixed(2)}`;
    }
}

function resetForm(version) {
    document.querySelectorAll(`#${version} .component-select`).forEach(select => {
        select.selectedIndex = 0;
    });
    if (version === 'internal') {
        document.getElementById('internal-total-price').textContent = 'Total Internal Cost: | Total Internal Price:';
    } else {
        document.getElementById('public-total-price').textContent = 'Total Public Price:';
    }
}

function toggleVersion() {
    let internalVersion = document.getElementById("internal");
    let publicVersion = document.getElementById("public");

    if (internalVersion.style.display === "none") {
        let password = prompt("Enter password for internal version:");
        if (password === null) {
            return;
        } else if (password === internalPassword) {
            internalVersion.style.display = "block";
            publicVersion.style.display = "none";
        } else {
            alert("Incorrect password!");
        }
    } else {
        internalVersion.style.display = "none";
        publicVersion.style.display = "block";
    }
}

document.getElementById("toggle-version").addEventListener("click", toggleVersion);

window.onload = loadComponentsFromJSON;
