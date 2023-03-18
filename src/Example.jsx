import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { env } from './config'
// import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from "axios";
// import Translate from './Translate';



function Example() {
    const [value, setValue] = useState('');
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [translate, setTranslate] = useState("")

    // const { speak } = useSpeechSynthesis();

    // const { listen, listening, stop } = useSpeechRecognition({
    //     onResult: (response) => {
    //         setValue(response);
    //     },
    // });



    // speech recognition
    const {
        transcript,
        listening,
        // resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    const startListening = () => SpeechRecognition.startListening({ continuous: true });


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
                prompt: value,
                max_tokens: 150,
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

    const textToSpeech = () => {
        const text = `${value}`
        const val = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(val)
    }

    // Translate Api 
    const handleTranslate = () => {
        setLoading(true);
        try {
            const options = {
                method: 'GET',
                url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/get',
                params: { langpair: 'en|ta', q: `${result}`, mt: '1', onlyprivate: '0', de: 'a@b.c' },
                headers: {
                    'X-RapidAPI-Key': `${env.X_RapidAPI_Key}`,
                    'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                setTranslate(response.data)
                console.log(translate)
            })
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <div className='main'>
            <textarea
                value={value}
                className='textarea'
                onChange={(event) => setValue(event.target.value)}
            />
            <div>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button
                    onTouchStart={startListening}
                    onMouseDown={startListening}
                    onTouchEnd={SpeechRecognition.stopListening}
                    onMouseUp={SpeechRecognition.stopListening}
                >🎤 Hold to talk</button>
                <p>{transcript}</p>
            </div>
            {/* <button onMouseDown={listen} onMouseUp={stop} className='btn w-2/4 mx-auto'>
                🎤 Hold to talk
            </button> */}
            {listening && <div className='text-gray-200'>Go ahead I'm listening</div>}

            <button
                onClick={handleClick}
                disabled={loading || value.length === 0}
                className='btn'
            >
                {loading ? "Generating..." : 'Generate'}
            </button>
            <button
                onClick={handleTranslate}
                disabled={loading || value.length === 0}
                className='btn'
            >
                {loading ? "Translating..." : 'Translate'}
            </button>

            {/* <button
                onClick={() => speak({ text: result})}
                className='btn '
                disabled={loading || value.length === 0}
            >Speaker </button> */}
            <button
                onClick={textToSpeech}
                className='btn '
            // disabled={loading || value.length === 0}
            > Speaker </button>

            <pre className='result '>{result}</pre>
            {/* <Translate result={result} translate={translate} setTranslate={setTranslate} /> */}
        </div>
    );
}

export default Example