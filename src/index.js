require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app =  express();
const cors = require('cors') ;
const port = process.env.PORT || 3000;

app.use(cors());
app.get('/AvailableCountries', async (req, resp) => {
    try {
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
        resp.json(response.data)
    } catch (error) {
        resp.status(500).json({error:'error on country search'})
    }
})

app.get('/country-info/:code', async (req, resp) => {
    const countryCode = req.params.code;
    try {
        const countryInfo = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);

        const countryPopulation = await axios.get('https://countriesnow.space/api/v0.1/countries/population', {
            country: countryInfo.data.commonName
        })

        const countryFlag = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
            country: countryInfo.data.commonName
        })
        
        resp.json(({
            country: countryInfo.data,
            population: countryPopulation.data.data,
            flagUrl: countryFlag.data.data.flag
        }))

    } catch (error) {
        resp.status(500).json({error:'error on country search'})
    }
})

app.listen(port, ()=>{
    console.log(`server open on port ${port}`);
})