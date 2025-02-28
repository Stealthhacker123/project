function search() {

  stopDafaultText();

  const query = document.getElementById('searchInput').value;
  localStorage.setItem("lastSearch", query);

  const apiKey = "AIzaSyBdfnotXFBqJ8jUEovYvvpPrGBb49fvyao";
  const searchEngineId = "73bb1182000184ef1";

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

  dictionaryAPI();

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const searchDiv = document.getElementById('resultDiv');
      searchDiv.innerHTML = "<h3>Search Results:</h3><hr><br>";
      const content = document.getElementById("content");
      if (!data.items || data.items.length === 0) {
        searchDiv.innerHTML += "<p><b>No results found. Here's what you can try:</b></p><p>Check if there's a typo.</p><p>Try to use different words for keywords";
        return;
      }

      data.items.forEach((item, index) => {
        
        const link = document.createElement("p");
        link.className = "search-result";
        link.textContent = item.link;
        link.href = item.link;
        link.target = "_blank";
        link.style.fontSize = "12px";
        link.style.color = "#555555";
        searchDiv.appendChild(link);
        
        const title = document.createElement("a");
        title.textContent = item.title;
        title.style.fontWeight = "bold";
        title.href = item.link;
        title.target = "_blank";
        title.className = "search-result";
        searchDiv.appendChild(title);

        title.addEventListener("click", function () {
          linkClickedOn(link.textContent);
        });


        const snippet = document.createElement("p");
        snippet.textContent = item.snippet;

        searchDiv.appendChild(snippet);

        spacer(searchDiv, 4);

        checkServer(searchDiv);
      });
    })

    .catch(error => {
      console.error("Error fetching search results:", error);
    });
}

function linkClickedOn(link) {
  const searchDiv = document.getElementById("searchDiv");
  content.innerHTML = "";
  
  const iframe = document.createElement("iframe");
  iframe.className = "iframe-content";
  iframe.src = link;
  searchDiv.appendChild(iframe);
}


function changeCity() {
  const query = document.getElementById('searchInputCity').value;
  localStorage.setItem("city", query);
  loadWeather(); 
}

// Weather API
document.addEventListener("DOMContentLoaded", function () {
  loadWeather(); 
});

function loadWeather() {
  let location;
  if (!localStorage.getItem("city")) {
    localStorage.setItem("city", "London"); 
    location = "London";
  } else {
    location = localStorage.getItem("city");
  }

  const key = "285297f0ce584e3ebef11935241202";
  const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Weather Data:", data);
      console.log(`Location: ${data.location.name}, ${data.location.country}`);
      console.log(`Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)`);
      console.log(`Condition: ${data.current.condition.text}`);
      console.log(`Humidity: ${data.current.humidity}%`);
      console.log(`Wind Speed: ${data.current.wind_kph} kph`);

      document.getElementById("subHeading").textContent = `${data.location.name}`;
      document.getElementById("localTime").textContent = `${data.location.localtime}`;
      document.getElementById("currentTemperature").textContent = `${data.current.temp_f}°`;
      document.getElementById("weatherText").textContent = `${data.current.condition.text}.`;
      document.getElementById("img").src = `${data.current.condition.icon}`;
      document.getElementById("lastUpdated").textContent = `Last updated: ${data.current.last_updated}`;

      document.getElementById("wind").textContent = `${data.current.wind_mph} mph`;
      document.getElementById("humidity").textContent = `${data.current.humidity}%`;
      document.getElementById("vis_miles").textContent = `${data.current.vis_miles} miles`;

    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}


//Dictionary API
function dictionaryAPI() {
  const version = 'v2';
  const language = 'en';
  const word = document.getElementById('searchInput').value;
  const url = `https://api.dictionaryapi.dev/api/${version}/entries/${language}/${word}`;
  
  const wikiDiv = document.getElementById('dictionaryDiv');

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Clear previous content
      wikiDiv.innerHTML = ""; // Clear previous content
      wikiDiv.style.visibility = "visible";

      
      if (!data[0]?.meanings?.length) {
        wikiDiv.textContent = "No meanings found for this word.";
        wikiDiv.style.visibility = "hidden";
        return;
      }

      const meanings = data[0].meanings;
      meanings.forEach(meaning => {
        const partOfSpeech = document.createElement("h4");
        partOfSpeech.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
        partOfSpeech.style.fontStyle = "italic";

        wikiDiv.appendChild(partOfSpeech);
        
        meaning.definitions.forEach((definition, index) => {
          const definitionText = document.createElement("p");
          definitionText.textContent = `${index + 1}: ${definition.definition}`;
          wikiDiv.appendChild(definitionText);
        });
        
        
      });
      
    })
    .catch(error => {
      console.error("Error fetching dictionary data:", error);
      const wikiDiv = document.getElementById('wikiDiv');
      wikiDiv.innerHTML = "An error occurred while fetching the data. Please Try Refreshing the page.";
      wikiDiv.style.visibility = "hidden";
      return;
    });
}

// Call the function

function checkEnter(event) {
  if (event.key === "Enter") {
    search();
  }
}
function checkEnterCity(event) {
  if(event.key === "Enter") {
    changeCity();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  divDefault = document.getElementById("default");
  divDefault.textContent = "What will you search today?";
});



function stopDafaultText() {
  const setUp = document.getElementById('default');
  setUp.textContent = "";
  setUp.style.display = "none";
  const content = document.getElementById('content');
  content.className = "flex-row";

  const footer = document.getElementById('footer');
  footer.style.visibility = "visible";
}



function show(id) {
  const sideBar = document.getElementById(id);
  if(sideBar.style.visibility == "hidden") {
    sideBar.style.visibility = "visible";
  } else {
    sideBar.style.visibility = "hidden";
  }
}

function overlay(id) {
  const div = document.getElementById(id);
  const overlay = document.getElementById('overLay');
  if(div.style.display == "none") {
    div.style.display = "flex";
    overlay.style.display = "flex";
  } else {
    div.style.display = "none";
    overlay.style.display = "none";
  } 
}


function spacer(parent, spacers) {
  for(let i = 0; i < spacers; i++) {
    const spacer = document.createElement("br");

    parent.appendChild(spacer);
  }
}

function checkServer(parent) {
  if(parent.innerHTML == "") {
    parent.innerHTML = "Something is worng with the servers, please try again later.";
  }
}


window.addEventListener("click", (event) => {
  const modal = document.getElementById('overLay');
  const div = document.getElementById('customizeDiv');
  if (event.target === modal) {
      div.style.display = "none";    
      modal.style.display = "none";
  }

  const sideBar = document.getElementById("sideBar");

});

let currentIndex = null;

document.addEventListener("DOMContentLoaded", function () {
const flexWrap_1 = document.getElementById('flexWrapCustom1');
const colors = ["skyblue", "#FFE0B2", "palegoldenrod", "lightgreen", "lightskyblue", "violet", "white", "lightpink", "lavender", "paleturquoise", "lightcyan", "lightsalmon"
  ,"#BBDEFB","#FFCCBC","#D1C4E9","#FFF3E0","#CFD8DC","#ECEFF1","#F3E5F5","#F9FBE7","#F1F8E9","#DCEDC8","#64B5F6","#fff400"
];

colors.forEach((color, index) => {
  const colorDiv = document.createElement("button");
  colorDiv.className = "customize-colors";
  colorDiv.style.backgroundColor = color;
  colorDiv.style.border = "2px solid grey";
  colorDiv.style.boxShadow = "none";
  colorDiv.textContent = "";

  colorDiv.addEventListener("click", function () {
    changeColor(color);
    localStorage.setItem("background", color);

    const allButtons = document.querySelectorAll(".customize-colors");
    allButtons.forEach((button, btnIndex) => {
      button.style.borderColor = "grey";
      button.style.boxShadow = "none";
    });

    colorDiv.style.borderColor = "darkred";
    colorDiv.style.boxShadow = "0px 4px 10px 1px rgb(83,83,83)";
    currentIndex = index;
    console.log(`Current Index: ${currentIndex}`);
  });

  flexWrap_1.appendChild(colorDiv);
});

const flexWrap_2 = document.getElementById("flexWrapCustom2");
const fontWeights = ["normal", "bold", "bolder"];

fontWeights.forEach((fontWeightType, index) => {

  const fontWeightButton = document.createElement("button");
  fontWeightButton.className = "font-weight-button";
  fontWeightButton.textContent = fontWeightType;
  fontWeightButton.style.fontSize = "18px";
  if (index == 1) {
    fontWeightButton.style.fontWeight = "bold";
  }
  else if(index == 2) {
    fontWeightButton.style.fontWeight = "bolder";
  }
  fontWeightButton.addEventListener("click", function () {
    fontWeight(fontWeightType);
    localStorage.setItem("fontWeight", fontWeightType);
  });
  flexWrap_2.appendChild(fontWeightButton);
});



});

function changeColor(colorName) {
  const objects = ["top", "body", "sideBar", "searchDiv", "moreButtons", "dictionaryDiv", "contentBrightness", "weatherDayBlock", "mainWeatherBlock", "subBoxesHeading"];

  objects.forEach((objectid, index) => {
    console.log(`${index}, ${objectid}`);
    const object = document.getElementById(objectid);

    if (object) {
      object.style.backgroundColor = colorName;
    } else {
      console.warn(`Element with ID '${objectid}' not found.`);
    }
  });


  const border = ["top", "body", "sideBar", "searchDiv", "moreButtons", "dictionaryDiv", "contentBrightness", "weatherDayBlock", "mainWeatherBlock", "subBoxesHeading"];

  border.forEach((borderid, index) => {
    const object_border = document.getElementById(borderid);

    if(object_border) {
      object_border.style.backgroundColor = colorName;
    } else {
      console.warn(`Element with ID '${borderid}' not found.`);
    }
  });

  // Accessing the body element
  const body = document.body; // or document.getElementById('body') if 'body' refers to a specific element
  const computedStyle = window.getComputedStyle(body);

  // Check if background color is not white
  if (computedStyle.backgroundColor !== "rgb(255, 255, 255)") {
    console.log("The body background is not white.");
    // Add further logic here if needed
  }
}

function fontWeight(fontWeightName) {
const body = document.getElementById("body");
body.style.fontWeight = fontWeightName;

}

document.addEventListener("DOMContentLoaded", function() {
if(localStorage.getItem("background")) {
  changeColor(localStorage.getItem("background"));
} else {
  changeColor("#FFFFFF");
}
if(localStorage.getItem("fontWeight")) {
  fontWeight(localStorage.getItem("fontWeight"));
} else {
  fontWeight("normal");
}
});



// JavaScript to handle form submission without page reload
const form = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting traditionally

    const formData = new FormData();
    formData.append('image', imageUpload.files[0]);

    // Send the image to the server using Fetch API
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            uploadedImage.src = data.imageUrl; // Display uploaded image
        } else {
            alert('Image upload failed!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});