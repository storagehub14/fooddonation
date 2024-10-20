// Function to perform search
async function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
   let filteredResults= document.getElementById("searchResults");
    try {
      const response = await fetch(`http://localhost:8888/fetchdonations?foodname=${searchInput}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        filteredResults = await response.json();
        searchResults.innerHTML = "";
        if (filteredResults.length > 0) {
            filteredResults.forEach(result => {
                const listItem = document.createElement("div");
                listItem.textContent = result.Location;
                var marker = L.marker(result.Location).addTo(map);
                marker.on('click', function (){
                    window.location.href = 'of.html?param1=' + encodeURIComponent(result.Food_Type) + '&param2=' + encodeURIComponent(result.Quantity)+'&param3=' + encodeURIComponent(result.Fresh_Time)+'&param4=' + encodeURIComponent(result.Location)+'&param5=' + encodeURIComponent(result.Mobile_Numbe)+
                    '&param6=' + encodeURIComponent(result.Other_Details);
                });
                listItem.classList.add("searchResult");
                listItem.addEventListener("click", () => {
                    window.location.href = 'of.html?param1=' + encodeURIComponent(result.Food_Name) + '&param2=' + encodeURIComponent(result.Quantity)+'&param3=' + encodeURIComponent(result.Fresh_Time)+'&param4=' + encodeURIComponent(result.Location)+'&param5=' + encodeURIComponent(result.Mobile_Numbe)+
                    '&param6=' + encodeURIComponent(result.Other_Details);
       
                });
                searchResults.appendChild(listItem);
            });
        } else {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.textContent = "No results found.";
            searchResults.appendChild(noResultsMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// Initialize Leaflet map
var map = L.map('map').setView([17.4065,78.4772], 10);

// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);








//   var marker = L.marker(college.location).addTo(map).bindPopup(college.name);
//   marker.on('click', fetchdata); // Call fetchdata() when marker is clicked

 document.getElementById("searchButton").addEventListener("click", performSearch);