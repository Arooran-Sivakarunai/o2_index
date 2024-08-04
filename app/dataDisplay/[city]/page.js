// app/info/[city]/page.js
async function fetchData( city ) {
    const YOUR_API_KEY = '115098cf98dbee410e5e68d01fc92c5c';
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${YOUR_API_KEY}`;
    
    let response = await fetch(url);
    let data = await response.json();
    let lat = data[0].lat;
    let lon = data[0].lon;
    
    url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${YOUR_API_KEY}`;
    response = await fetch(url);
    data = await response.json();
  
    return data.list[0];
  }

  async function getLLM(city, aqi, quality, co, no2, o3, so2, pm25, pm10) {
    let prompt = `City: ${city}\nAir Quality: ${aqi} - ${quality}\nCarbon Monoxide: ${co}\nNitrogen Dioxide: ${no2}\nGround Level Ozone: ${o3}\nSulfur Dioxide: ${so2}\nParticulate Matter (PM2.5): ${pm25}\nParticulate Matter (PM10): ${pm10}.`;
    let preamble = "You are an expert on Air Pollution and Air Quality. You are trained to give a general analysis of some data on air quality, and then some advice on how to improve the situation. You must provide one easy, small lifestyle change, one way to advocate by supporting a local group, and one large lifestyle change. List these three in order of effectiveness.Include \\n linebreaks in your answer to help break up the text. Do Not use any form of markdown formatting, only plain text that will be put in a string";
    let response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer Oh1es31Wp6IsJsprjOEpu5vpAy7upTQytwLyLaST',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: prompt,
        preamble: preamble,
        temperature: 0.3,
        chat_history: [],
        prompt_truncation: 'OFF',
        stream: false,
        connectors: []
      })
    });
  
    // Check the response text
    const text = await response.text();
  
    // Try parsing the JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw error; // Rethrow the error to be handled appropriately
    }
    return data;
  }

export default async function InfoPage({ params }){
  const data = await fetchData(params.city);

  let city = params.city
  city = city.replace(city[0], city[0].toUpperCase());
  let quality;
  switch (data.main.aqi) {
    case 1:
      quality = "Good";
      break;
    case 2:
      quality = "Fair";
      break;
    case 3:
      quality = "Moderate";
      break;
    case 4:
      quality = "Poor";
      break;
    default:
      quality = "Very Poor";
  }
  const m = await getLLM(city, data.main.aqi, quality, data.components.co, data.components.no2, data.components.o3, data.components.so2, data.components.pm2_5, data.components.pm10);
  
  // // Return JSX with the data
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Air Quality Information</h1>
        <p className="text-lg text-gray-700 mb-2">City: <span className="font-semibold text-blue-600">{city}</span></p>
        <p className="text-lg text-gray-700 mb-2">Air Quality Index: <span className={`font-semibold ${data.main.aqi === 1 ? 'text-green-500' : data.main.aqi === 2 ? 'text-yellow-500' : 'text-red-500'}`}>{data.main.aqi} - {quality}</span></p>
        <p className="text-lg text-gray-700 mb-2">Carbon Monoxide: <span className="font-semibold text-gray-800">{data.components.co} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-2">Nitrogen Dioxide: <span className="font-semibold text-gray-800">{data.components.no2} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-2">Ozone: <span className="font-semibold text-gray-800">{data.components.o3} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-2">Sulfur Dioxide: <span className="font-semibold text-gray-800">{data.components.so2} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-2">Particulate Matter (PM2.5): <span className="font-semibold text-gray-800">{data.components.pm2_5} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-2">Particulate Matter (PM10): <span className="font-semibold text-gray-800">{data.components.pm10} µg/m³</span></p>
        <p className="text-lg text-gray-700 mb-4">Date: <span className="font-semibold text-gray-800">{new Date(data.dt * 1000).toLocaleString()}</span></p>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">{m.text}</p>
        </div>
      </div>
    </div>
  );
}
