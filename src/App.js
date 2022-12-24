
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import './App.css'
import GaugeChart from 'react-gauge-chart'

function App() {
  const [datas, setData] = useState(null);
  const [aqi, setAqi] = useState(0);

  const chartStyle = {
    height: 150,
    width: 250,
  };

  function Change() {
    var airQuality = localStorage.getItem("aqi")
    var airIndex = airQuality / 500;
    setAqi(airIndex);
  }

  return (
    <div >
      <div className='main'>
        <h1 className="heading">Air Quality Index</h1>
        <GaugeChart id="gauge-chart1" style={chartStyle}
          nrOfLevels={20}
          percent={aqi}
          formatTextValue={value => (value / 2) * 10 + " AQI"}
        />
        <Formik
          initialValues={{ city: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            const response = await fetch(`https://api.waqi.info/search/?token=47df21ac5b04ead803dc2d531a81e9e5d3acee34&keyword=${values.city}`);
            const json = await response.json();
            localStorage.setItem("aqi", json.data[0].aqi)
            Change();
            console.log(response)
            setData(json);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className='frm'>
              <label className="lab" htmlFor="city">City:</label>
              <Field className="fld" type="text" name="city" id="city" required />
              <button className='btn' type="submit" disabled={isSubmitting}>
                Search
              </button>
            </Form>
          )}
        </Formik>
        {datas ? (

          <table className='tab' border={2}>
            <tr className='tr'>
              <th className='th'>Place</th>
              <th className='th'>Country</th>
              <th className='th'>Longitude</th>
              <th className='th'>Latitude</th>
              <th className='th'>AQI</th>
            </tr>
            {datas.data.map(result => (
              <tr>
                <td>{result.station.name}</td>
                <td>{result.station.country}</td>
                <td>{result.station.geo[0]}</td>
                <td>{result.station.geo[1]}</td>
                <td>{result.aqi}</td>
              </tr>
            ))}
          </table>

        ) : (
          'Enter a city name and click "Search" to view air quality data.'
        )}



      </div>
    </div>
  );
}

export default App;