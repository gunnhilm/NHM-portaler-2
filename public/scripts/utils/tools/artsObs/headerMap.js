
function headerMap(headerArray, samling) {
    const transelateKeyMap = new Map();
    transelateKeyMap.set('Museum', 'museumCollection');
    transelateKeyMap.set('Løpenummer', 'dbNumbers');
    transelateKeyMap.set('Artsobservasjon nr.', 'catalogNumber');
    transelateKeyMap.set('Vitenskapelig navn', 'acceptedScientificName');
    transelateKeyMap.set('Administrativt sted/kommune', 'municipality');
    transelateKeyMap.set('Lokalitet', 'locality');
    transelateKeyMap.set('Datum', 'geodeticDatum');
    transelateKeyMap.set('Koordinater', 'latLongCoords');
    transelateKeyMap.set('Koordinat-presisjon (m)', 'coordinateUncertaintyInMeters');
    transelateKeyMap.set('Økologi', 'habitat');
    transelateKeyMap.set('Innsamlere', 'recordedBy');
    transelateKeyMap.set('Innsamlingsdato', 'eventDate');
    transelateKeyMap.set('Bestemmere', 'identifiedBy');
    transelateKeyMap.set('Prosjektnavn', 'datasetName');
    transelateKeyMap.set('Kommentar fra innsamler', 'fieldNotes');

    const soppHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const karplanteHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const moseHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const lavHeaders = ['Museum','Løpenummer','UUID','Artsobservasjon nr.','Navn_Usikkerhet','Vitenskapelig navn','Vert','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Økologi','Kartblad','Høyde over havet (m)','Høyde - usikker','Innsamlere','Innsamlingsdato','Innsamlingsnummer','Bestemmere','Bestemmelsesdato','Kommentar fra innsamler','Dubletter','Prosjektnavn','Litteratur (objekt)','Datasett','Litteratur (bestemmelse)','Kommentar (adm)','Voucher']
    const insektHeaders = ['Museum','Løpenummer','UUID','SubCollection','Barcode','Navn_Usikkerhet','Vitenskapelig navn','Bestemmere','Bestemmelsesdato','Kjønn','Antall','Estimert','Livsstadium','Kommentar (bestemmelse)','Administrativt sted/kommune','Lokalitet','Datum','Koordinater ','Koordinat - usikker','Koordinater bestemt i ettertid','Koordinat-presisjon (m)','Koordinatkilde','Høyde over havet (m)','Innsamlingsdato 1','Innsamlingsdato 2','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Habitat','Prosjektnavn','Tilhørende preparat','Original etikettekst','Kasse','Godkjent','Voucher','Datasett','Prepareringsmetode','EIS','RegionKode','Kommentar (adm)','Owner','Registrert av','Undernummer']
    const marineInvertebraterHeaders = ['Museum','Løpenummer','UUID','SubCollection','Navn_Usikkerhet','Barcode','Vitenskapelig navn','Kasse','Kjønn','Livsstadium','Antall','Estimert','Vert','Aksesjonsnummer vert','Preparattype','Administrativt sted/kommune','Lokalitet','Økologi','Prøvenummer','Datum','Koordinater','Koordinatkilde','Høyde over havet (m)','Dyp','Habitat','Prosjektnavn','Stasjon','Fartøy','Innsamlingsdato 1','Innsamlingsdato 2','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Bestemmelsesdato','Bestemmere','Kommentar (bestemmelse)','Typestatus','Datasett','Litteratur (objekt)','Godkjent','Registrert av','Registreringsdato','Kommentar (adm)','Voucher','Original etikettekst','Prepareringsmetode','infraspecificEpithet','scientificNameAuthorship','SedimenthDepth','Koordinat-presisjon (m)','Water temperature','Salinity','pH','Kingdom','Phylum','Class','Order','Family','Genus','specificEpithet','Undernummer']
    const algerHeaders =['Museum','Løpenummer','UUID','Aksesjonsnummer','Navn_Usikkerhet','Barcode','Vitenskapelig navn','Kasse','Kjønn','Livsstadium','Antall','Vert','Aksesjonsnummer vert','Preparattype','Administrativt sted/kommune','Lokalitet','Datum','Koordinater','Koordinat - usikker','Koordinater bestemt i ettertid','Høyde over havet (m)','Dyp','Habitat','Prosjektnavn','Innsamlingsdato','Innsamlere','Innsamlings-metode','Kommentar fra innsamler','Bestemmelsesdato','Bestemmere','Kommentar (bestemmelse)','Typestatus','Litteratur (objekt)','Registrert av','Registreringsdato','Kommentar (adm)','Original etikettekst','Prepareringsmetode','Datasett']
    const headerMap = new Map();
    try {
        headerArray = insektHeaders
        for (let i = 0; i < headerArray.length; i++) {
            if(transelateKeyMap.get(headerArray[i])){
                headerMap.set(transelateKeyMap.get(headerArray[i]), headerArray[i]);
            } else {
                headerMap.set(`Dummy${i}` , headerArray[i]);
            }
        }
        return headerMap
    } catch (error) {
        console.log(error);
        return  maketranselateKeyMap
    }
}
console.log(headerMap());
