import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { env } from './config'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)

    // speech recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // console.log(prompt)
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }



    // open ai module
    const configuration = new Configuration({
        apiKey: `${env.OPEN_AI_KEY}`,
    });
    const openai = new OpenAIApi(configuration);

    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: transcript,
                max_tokens: 550,
                temperature: 0.5,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            setResult(response.data.choices[0].text)
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <>

            <main className='main'>
                <div className='w-2/4 m-auto flex text'>
                    <p className='text-gray-200'>Microphone: {listening ? 'on' : 'off'}</p>
                    <br />
                    <br />
                    <br />
                    <button className=' w-auto m-auto btn' onClick={SpeechRecognition.startListening}>Start</button>
                    <button className=' w-auto m-auto btn' onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className='w-auto m-auto btn' onClick={resetTranscript}>Reset</button>
                    <p>{transcript}</p>
                </div>
                <div className='w-2/4 mx-auto'>
                    <textarea
                        type='text'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Write your prompt'
                        className='textarea'
                    ></textarea>

                    <button
                        onClick={handleClick}
                        // disabled={loading || prompt.length === 0}
                        className='btn'
                    >
                        {loading ? "Generating..." : 'Generate'}
                    </button>

                    <pre className='result'>{result}</pre>
                </div>
            </main>
        </>
    );
};
export default Dictaphone;




// const axios = require("axios");

// const options = {
//   method: 'GET',
//   url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/get',
//   params: {langpair: 'en|ta', q: 'Hello World!', mt: '1', onlyprivate: '0', de: 'a@b.c'},
//   headers: {
//     'X-RapidAPI-Key': '5ed7ce0175msh72d185fc816190cp170c9fjsnfbe71fdcacba',
//     'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
//   }
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });