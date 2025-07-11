const input = document.querySelector(".custom-search");
const dropdown = document.querySelector(".input-dropdown");
const inputHiddenLongitude = document.querySelector("#longitude");
const inputHiddenLatitude = document.querySelector("#latitude");
let debounceTimer;

// prevent submission until lat and lot is is filled
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  if (!inputHiddenLongitude.value || !inputHiddenLatitude.value) {
    e.preventDefault();
    alert("Please select a city from the dropdown. and enter a valid location");
  }
});

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const trimmedInput = input.value.trim();

    if (trimmedInput.length === 0) {
      console.log("Input is empty. Skipping request.");
      dropdown.style.display = "none";
      return;
    }

    try {
      const response = await axios.post("/place", {
        inputValue: trimmedInput,
      });

      const { place1, place2, place3 } = response.data;

      if (
        typeof place1 == "undefined" ||
        typeof place2 == "undefined" ||
        typeof place3 == "undefined"
      ) {
        dropdown.style.display = "none";
      } else {
        dropdown.innerHTML = `
        <div class="item item-1" data-place="${place1[0]}" data-longitude="${place1[2]}" data-latitude="${place1[1]}">${place1[0]}</div>
        <div class="item item-2" data-place="${place2[0]}" data-longitude="${place2[2]}" data-latitude="${place2[1]}">${place2[0]}</div>
        <div class="item item-3" data-place="${place3[0]}" data-longitude="${place3[2]}" data-latitude="${place3[1]}">${place3[0]}</div>
      `;

        dropdown.style.display = "block";

        // Attach click listeners AFTER dropdown is rendered
        document.querySelectorAll(".item").forEach((item) => {
          item.addEventListener("click", () => {
            input.value = item.dataset.place;
            inputHiddenLongitude.value = item.dataset.longitude;
            inputHiddenLatitude.value = item.dataset.latitude;
            dropdown.style.display = "none";
          });
        });
      }
    } catch (error) {
      const myerror = error.response?.data?.error;
      alert(myerror || "An error occurred");
    }
  }, 1000);
});
