import { useEffect, useState } from "react";
import L from 'leaflet';
import { useMap, useMapEvents } from "react-leaflet";
import axios from "axios";

export default function FeatureInfo({ layers }) {
    const [data, setData] = useState([]);
    const map = useMap();

    useMapEvents({
        async click(e) {
            const w = map.getSize().x;
            const h = map.getSize().y;
            const { x, y } = e.containerPoint;

            const bbox = map.getBounds().toBBoxString();

            const fetchPromises = layers.map(async (layer) => {
                const params = {
                    service: 'WMS',
                    version: '1.1.1',
                    request: 'GetFeatureInfo',
                    layers: layer,
                    info_format: 'application/json',
                    query_layers: layer,
                    width: w,
                    height: h,
                    x: parseInt(x),
                    y: parseInt(y),
                    bbox,
                };

                const url = `${import.meta.env.VITE_GEOSERVER_API}wms?${new URLSearchParams(params)}`;

                const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
                return response.data;
            });

            try {
                const results = await Promise.all(fetchPromises);
                setData(results);
            } catch (error) {
                console.log(error);
            }
        },
    });
    useEffect(() => {
        let info; // Deklarasikan variabel legend di luar blok if
    
        if (map) {
            info = L.control({ position: "topleft" });
    
            info.onAdd = () => {
                const container = L.DomUtil.create("div", "feature-info");
                container.classList.add('space-y-5')
                const heading = document.createElement('h1', '');
                heading.textContent = "Keterangan";
                heading.classList.add('font-semibold'); //stylenya pake tailwind
                heading.classList.add('text-base'); //stylenya pake tailwind
                container.appendChild(heading);

                    data.forEach((item, index) => {
                        if(item.features[0]){

                            const divTable = L.DomUtil.create("div", "feature-info-table");
                            const tabHeader = document.createElement('h3')
                            tabHeader.textContent = layers[index]
                            tabHeader.classList.add('font-semibold')
                            tabHeader.classList.add('underline')
                            divTable.appendChild(tabHeader)
    
                            const table = document.createElement('table')
                            table.classList.add('table-fix')
                            const tbody = document.createElement('tbody');
                            const thead = document.createElement('thead');
                            const tr = document.createElement('tr');
                        
                            const thKey = document.createElement('th');
                            const thValue = document.createElement('th');
                            tr.appendChild(thKey);
                            tr.appendChild(thValue);
                            thead.appendChild(tr);
                        
                            table.appendChild(thead);
                            table.appendChild(tbody);
                            const keys = Object.keys(item.features[0].properties);
                            keys.forEach((key) => {
                                const tr = document.createElement('tr');
                                const tdKey = document.createElement('td');
                                const tdValue = document.createElement('td');
                                tdKey.textContent = key;
                                tdKey.classList.add('font-semibold')
                                tdKey.classList.add('text-xs')
                                tdValue.classList.add('text-xs')
                                tdValue.textContent = item.features[0].properties[key];
                                tr.appendChild(tdKey);
                                tr.appendChild(tdValue);
                                tbody.appendChild(tr);
                            });
                            // tambahin space disini
    
                            divTable.appendChild(table)
                            container.appendChild(divTable);
                        }

                    });

                return container;
            };
            info.addTo(map);
        }
    
        // Kembalikan fungsi untuk menghapus kontrol legenda dari peta
        return () => {
            if (map && info) {
                info.remove();
            }
        };
    }, [map, data]);
    return null;
}

// const map = useMap();
// useEffect(() => {
//     let info; // Deklarasikan variabel legend di luar blok if

//     if (map) {
//         info = L.control({ position: "topleft" });

//         info.onAdd = () => {
//             const div = L.DomUtil.create("div", "feature-info");
//             div.innerHTML =
//             "<h2 class='text-lg font-semibold'>Feature Info</h2>" +
//             `<img class="h-32" src="${import.meta.env.VITE_GEOSERVER_API}wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=50&HEIGHT=50&LAYER=${layer}"/>`;
//             return div;
//         };

//         info.addTo(map);
//     }

//     // Kembalikan fungsi untuk menghapus kontrol legenda dari peta
//     return () => {
//         if (map && info) {
//             map.removeControl(info);
//         }
//     };
// }, [map]);