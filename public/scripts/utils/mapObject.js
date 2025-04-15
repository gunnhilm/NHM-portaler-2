
const drawMapObject = (object) => {   
    try {
        const coordinatesView = [ Number(object.decimalLatitude), Number(object.decimalLongitude)]
        if ((object.decimalLatitude && object.decimalLongitude) && (object.decimalLongitude !== '0' && object.decimalLatitude !== '0' )) {
            const objectMap = L.map('map-object', {
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                }
            }).setView([coordinatesView[0],coordinatesView[1] ],11);
        
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(objectMap);
            const marker = L.marker([coordinatesView[0],coordinatesView[1] ]).addTo(objectMap)
            if(object.hasOwnProperty('coordinateUncertaintyInMeters') && object.coordinateUncertaintyInMeters > 0) {
                const circle = L.circle([coordinatesView[0],coordinatesView[1] ], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.3,
                    radius: object.coordinateUncertaintyInMeters
                }).addTo(objectMap);
                objectMap.addLayer(marker);
                }
        }
    } catch (error) {
        console.log('object page map error');
        console.log(error);
    }
}
