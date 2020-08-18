import React, { Component, useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox'
import "@reach/combobox/styles.css";

const containerStyle = {
  width: '800px',
  height: '375px'
};
const center = {
  lat: 42.867695,
  lng: 74.610897
};
const libraries = ["places"];


export default function SixthAddRental({nextStep, prevStep, handleSubmit}, props) {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries
  })

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const onMapCLick = useCallback((event) => {
    setMarkers(current => [
      ...current, 
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const prev = e => {
    e.preventDefault();
    prevStep();
  }

  return(
    <div className="rental__form__content">

      <Search panTo={panTo}/>        

      <GoogleMap
        id="add-rental-map"
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={onMapCLick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker 
            key={`${marker.lat}-${marker.lng}`} 
            position={{ lat: marker.lat, lng: marker.lng }} 
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow 
            position={{lat: selected.lat, lng: selected.lng}}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <p>lat: {selected.lat}</p>
              <p>lng: {selected.lng}</p>
            </div>
          </InfoWindow>) : null
        }

      </GoogleMap>

      <Locate panTo={panTo} />

      <div className="rental__form__btns">
        <button onClick={prev}>Назад</button>
        <button onClick={props.handleSubmit}>Готово</button>
      </div>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img id="image-compass-button" src={require(`../../../content/images/addRental/compass.svg`)} alt="compass" />
    </button>
  );
}

function Search({ panTo }) {
  const { ready, value, suggestions: {status, data}, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 42.867695, lng: () => 74.610897 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="sixth-search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput 
          value={value} 
          onChange={handleInput}
          disabled={!ready}
          placeholder="Укажите адрес" 
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" && 
              data.map(({id, description}) => (
                <ComboboxOption key={id} value={description} />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}

// const containerStyle = {
//   width: '800px',
//   height: '300px'
// };

// const center = {
//   lat: 42.867695,
//   lng: 74.610897
// };

// class SixthAddRental extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {

//     }
//   }

//   continue = e =>{
//     e.preventDefault();
//     this.props.nextStep();
//   }
//   prev = e =>{
//       e.preventDefault();
//       this.props.prevStep();
//   }

//   render() {



//     return(
    //   <div className="rental__form__content">
    //     <input placeholder="Укажите адрес"></input>

    //     <LoadScript
    //       googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
    //     >
    //       <GoogleMap
    //         mapContainerStyle={containerStyle}
    //         center={center}
    //         zoom={15}
    //       >
    //         { /* Child components, such as markers, info windows, etc. */ }
    //         <></>
    //       </GoogleMap>
    //     </LoadScript>

    //     <div className="rental__form__btns">
    //       <button onClick={this.props.prevStep}>Назад</button>
    //       <button onClick={this.props.handleSubmit}>Готово</button>
    //     </div>
    //  </div>
//     )
//   }
// }