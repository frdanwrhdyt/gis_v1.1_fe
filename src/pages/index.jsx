import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl, WMSTileLayer, useMap, ScaleControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Fetch from '../fetch/fetch'
import L from 'leaflet';
import '../components/ruler/ruler'
import '../components/ruler/ruler.css'

const {Overlay, BaseLayer} = LayersControl

function RenderOverlay({ layers }) {
    return (
        layers.map((layer, index) => (
            <Overlay key={index} name={layer.name}>
                <WMSTileLayer
                    key={index}  // Tambahkan key pada WMSTileLayer
                    url={import.meta.env.VITE_GEOSERVER_API + 'wms?'}
                    layers={layer.name} // Ubah layer menjadi layer.name
                    opacity={layer.name.toLowerCase().includes('desa') ? 0.8 : 1} // Ubah layer menjadi layer.name
                    transparent
                    format="image/png"
                />
            </Overlay>
        ))
    );
}

function Ruler(){
    const map = useMap()
    useEffect(() => {
        const ruler = L.control.ruler().addTo(map);

        return () => {
          map.removeControl(ruler);
        };
      }, [map]);
    return null
}

export default function Home(){
    const [layers, setLayers] = useState([])
    const position = [-0.7893, 113.9213]

    useEffect(()=>{
        const access = localStorage.getItem('access')
        const fetch = async() => {
            try{    
                const response = await Fetch({
                    endpoint:'shp/',
                    method:"GET",
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${access}`
                    },
                })
                const data = response.data.layers.layer
                setLayers(data)
            }
            catch{
                setLayers([])
            }
        }
        fetch()
    },[])
    

    return (
        <div className='w-full h-full'>
            <MapContainer center={position} zoom={5} scrollWheelZoom={false}>
                <LayersControl
                position="topright"
                className="leaflet-control-layers">
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                    </BaseLayer>
                    {layers&&<RenderOverlay layers={layers}/>}
                </LayersControl>
                <Ruler/>
                <ScaleControl position="bottomright" />
            </MapContainer>
        </div>
    )
}