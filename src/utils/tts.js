import { fetch } from '@tauri-apps/plugin-http';
import { invoke } from '@tauri-apps/api/core';

export async function textToSpeech(text, voice, voice_prompt) {

    const token = await invoke('get_env', { name: 'OPENAI_API_KEY' });

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini-tts',//'tts-1',
            input: text,
            voice: voice,
            instructions: voice_prompt,
            response_format:'opus'
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const stream=new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    push();
                }).catch(error => {
                    console.error('Stream reading error:', error);
                    controller.error(error);
                });
            }
            push();
        }
    });

    const audioBlob = await new Response(stream).blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return audioUrl;

}