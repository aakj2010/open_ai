import './App.css';
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react';
import { env } from "./config"

function App() {

  const configuration = new Configuration({
    apiKey: `${env.OPEN_AI_KEY}`,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2047,
        temperature: 0.7,
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
    <main className='main'>
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
          disabled={loading || prompt.length === 0}
          className='btn'
        >
          {loading ? "Generating..." : 'Generate'}
        </button>

        <pre className='result'>{result}</pre>
      </div>
    </main>
  );
}

export default App;
