import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { env } from './config'
import { useSpeechRecognition } from 'react-speech-kit';

function Example() {
    const [value, setValue] = useState('');
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)

    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (response) => {
            setValue(response);
        },
    });

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

    const textToSpeech = () => {
        const val = new SpeechSynthesisUtterance(result);
        window.speechSynthesis.speak(val)
    }

    return (
        <div className='main'>
            <textarea
                value={value}
                className='textarea '
                onChange={(event) => setValue(event.target.value)}
            />
            <button onMouseDown={listen} onMouseUp={stop} className='btn w-2/4 mx-auto'>
                🎤 Hold to talk
            </button> 
            {listening && <div className='text-gray-200'>Go ahead I'm listening</div>}

            <button
                onClick={handleClick}
                disabled={loading || value.length === 0}
                className='btn'
            >
                {loading ? "Generating..." : 'Generate'}
            </button>
            <button
                onClick={textToSpeech}
                className='btn '
                disabled={loading}
            >Result in Voice</button>
            <pre className='result '>{result}</pre>
        </div>
    );
}

export default Example