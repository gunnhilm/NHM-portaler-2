const map = L.map('map-search', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([59.91799446176107, 10.770464001754743],15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = L.markerClusterGroup();

const drawMap = (parsedData) => {  
    if (markers) {
        markers.removeLayer(markers);
    }
    try {
        
       let url_variable = ''
        const markersArray = []
        const headers = parsedData[0]
        const decimalLatitude = headers.indexOf('decimalLatitude')
        const decimalLongitude = headers.indexOf('decimalLongitude')
        const catalogNumber = headers.indexOf('catalogNumber')
        const lineNumber = headers.indexOf('lineNumber')

        parsedData.forEach((item) => {
            const latitude = Number(item[decimalLatitude]);
            const longitude = Number(item[decimalLongitude]);
            const catalogNum = item[catalogNumber];
            const lineNum = item[lineNumber]  
        
            // Guard clause for filtering out zero coordinates
            if (latitude === 0 && longitude === 0) {
                return;
            }
        
            // Validate latitude and longitude range
            const isLatitudeValid = latitude < 90 && latitude > -90;
            const isLongitudeValid = longitude < 180 && longitude > -180;
            
            if (isLatitudeValid && isLongitudeValid) {
                const urlTemplate = `<a href='/museum/nhm/object/?id=${catalogNum}&samling=${collection.value}&museum=${museum}&lang=${language}&linjeNummer=${lineNum}&isNew=yes' target='_blank'>${catalogNum}</a>`;
                const marker = L.marker([latitude, longitude]).bindPopup(urlTemplate);
                
                markers.addLayer(marker);
                markersArray.push([latitude, longitude]);
            }
        });
        
        if(markersArray){ 
            const mapSearchElement = document.getElementById('map-search');
            mapSearchElement.removeAttribute("hidden");
            mapSearchElement.style.height = '400px';
            mapSearchElement.style.width = '500px';
            map.invalidateSize();
            map.addLayer(markers);
            map.fitBounds(markersArray, {padding: [30,30]})
        }
        markersArray.length = 0;
        
    } catch (error){
        console.log('her kommer feil i visning av kart på søkesiden');
        console.log(error);
    }
}


