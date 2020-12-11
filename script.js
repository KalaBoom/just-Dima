import 'ol/ol.css';
import {Map, View} from 'ol';
import Point from 'ol/geom/Point.js'
import Feature from 'ol/Feature';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {OSM, Vector as VectorSource} from 'ol/source'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { fromLonLat,transform } from 'ol/proj.js'

const testLat = "55.75368277638995"
const testLon = "37.621304348597604"
const startCoordinate = transformCoords([testLon, testLat])

const source = new VectorSource()
const layer = new VectorLayer({source})

addPoint(startCoordinate)

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
            preload: 3,
            crossOrigin: null
        })
    ],
    view: new View({
        center: fromLonLat([testLon, testLat]),
        zoom: 9
    })
})

const testLatLon = [
    ["37.621304348597604", "55.75368277638995"],
    ["37.721304348597604", "55.85368277638995"],
    ["37.821304348597604", "55.95368277638995"],
    ["37.921304348597604", "56.06368277638995"],
    ["38.131304348597604", "56.121304348597604"]
]

testLatLon.forEach(latLon => {
    addPoint(transformCoords(latLon))
})

map.addLayer(layer)

map.on('click', function(event) {
    clickPoint(event)
})

function clickPoint(event) {
    addPoint(event.coordinate)
}

function transformCoords(arr) {
    // transform([testLon, testLat]
    return transform([arr[0], arr[1]], 'EPSG:4326', 'EPSG:3857')
}

function addPoint(coordinate) {
    const featureToAdd = new Feature({
        geometry: new Point(coordinate)
    })
    const style = new Style({
        image: new CircleStyle({
            radius: 5,
            fill: new Fill({color: 'red'}),
            stroke: new Stroke({color: 'black', width: 1}),
        })
    })
    featureToAdd.setStyle(style)
    source.addFeatures([featureToAdd])
}