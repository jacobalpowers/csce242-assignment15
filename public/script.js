let src = "https://csce242-assignment15.onrender.com/";
let crafts = [];

class Craft {
    constructor(name, img, description, supplies) {
        this.name = name;
        this.img = img;
        this.description = description;
        this.supplies = supplies;
    }


    get details() {

        const expandedSection = document.createElement("section");
        expandedSection.id = "more-details";
        const text = document.createElement("div");
        text.id = "text";

        const picture = document.createElement("div");
        picture.id = "picture";

        const site_image = document.createElement("img");
        site_image.src = "crafts/" + this.img;

        const site_name = document.createElement("h2");
        site_name.innerText = this.name;

        const site_description = document.createElement("p");
        site_description.innerText = this.description;

        const site_supplies_title = document.createElement("h3");
        site_supplies_title.innerText = "Supplies:"
        const site_supplies = document.createElement("ul");
        for (let i = 0; i < this.supplies.length; i++) {
            const supply_item = document.createElement("li");
            supply_item.innerText = this.supplies[i];
            site_supplies.append(supply_item);
        }

        picture.append(site_image);
        expandedSection.append(picture);
        
        text.append(site_name);
        text.append(site_description);
        text.append(site_supplies_title);
        text.append(site_supplies);
        expandedSection.append(text);

        return expandedSection;
    }

    get getCraftItem() {
        return this;
    }
}

const showCrafts = async () => {
    let craftJSON = await getJSON();
    if (craftJSON == "") {
        return;
    }

    let craftDiv = document.getElementById("crafts-list");
    craftDiv.innerHTML = "";

    let craftCol1 = document.createElement("div");
    craftCol1.classList.add("column");
    craftDiv.append(craftCol1);

    let craftCol2 = document.createElement("div");
    craftCol2.classList.add("column");
    craftDiv.append(craftCol2);

    let craftCol3 = document.createElement("div");
    craftCol3.classList.add("column");
    craftDiv.append(craftCol3);

    let craftCol4 = document.createElement("div");
    craftCol4.classList.add("column");
    craftDiv.append(craftCol4);

    let a = 0;
    craftJSON.forEach(craft => {
        let craftImg = document.createElement("img");
        craftImg.classList.add("craft-item");
        let val = crafts.length;
        crafts.push(new Craft(craft.name, craft.image, craft.description, craft.supplies));

        craftImg.src = "crafts/" + crafts[val].img;
        craftImg.onclick = () => changeModal(crafts[val]);
        if (a == 0) {
            craftCol1.append(craftImg);
            a++;
        } else if (a == 1) {
            craftCol2.append(craftImg);
            a++;
        } else if (a == 2) {
            craftCol3.append(craftImg);
            a++;
        } else if (a == 3) {
            craftCol4.append(craftImg);
            a = 0;
        }
        
    });

};

const getJSON = async () => {
    try {
        let response = await fetch(src + "api/crafts");
        return await response.json();
    } catch(error) {
        console.log("error retrieving JSON");
        return "";
    }
};

const changeModal = (craft)  => {
    const modal = document.getElementById("id01");
    const site_section = document.getElementById("more-details");
    site_section.replaceWith(craft.details);
    modal.style.display = "block";
    return;
}

const resetNewCraft = () => {
    const form = document.getElementById("make-changes");
    form.reset();
    const suppliesList = document.getElementById("supplies-list");
    suppliesList.innerHTML = "";
    const addBox = document.getElementById("id02");
    addBox.style.display = "none";
}

const addNewCraft = async (craft) => {
    craft.preventDefault();
    const form = document.getElementById("make-changes");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());

    console.log(formData);

    let response;

    response = await fetch("/api/crafts", {
        method: "POST",
        body: formData
    });

    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    
    showCrafts();
    resetNewCraft();
    return;
}

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supplies-list input");
    const supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    });

    return supplies;
}

const addSupplies = (supply) => {
    supply.preventDefault();
    const suppliesList = document.getElementById("supplies-list");
    const input = document.createElement("input");
    input.type = "text";
    suppliesList.append(input);
}

const uploadImage = (e) => {
    const image = document.getElementById("upload_image");
    image.src = URL.createObjectURL(e.target.files[0]);
}

window.onload = () => {
    showCrafts();

    let craftItems = document.getElementsByClassName("craft-item");
    craftItems.onclick = changeModal;
    document.getElementById("make-changes").onsubmit = addNewCraft;
    document.getElementById("make-changes").onreset = resetNewCraft;
    document.getElementById("add-supplies").onclick = addSupplies;
    document.getElementById("image").onchange = uploadImage;
};