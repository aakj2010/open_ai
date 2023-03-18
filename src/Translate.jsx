import React from 'react'
import axios from "axios";
import { env } from './config'


const Translate = ({ result, translate, setTranslate }) => {
    // Translate Api 
    const options = {
        method: 'GET',
        url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/get',
        params: { langpair: 'en|ta', q: result, mt: '1', onlyprivate: '0', de: 'a@b.c' },
        headers: {
            'X-RapidAPI-Key': `${env.X_RapidAPI_Key}`,
            'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        // console.log(response.data);
        setTranslate(response.data)
        console.log(translate)
    }).catch(function (error) {
        console.error(error);
    });
    return (
        <div>Translate</div>
    )
}

export default Translate