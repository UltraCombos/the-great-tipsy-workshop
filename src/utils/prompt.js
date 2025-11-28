import { fetch } from '@tauri-apps/plugin-http';

// send to python fastapi
export async function updatePrompt(prompt) {
    console.log(`Updating prompt: ${prompt}`);
    
    try{
        await fetch('http://localhost:34800/api/update/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
    }catch(error){
        console.error('Error updating prompt:', error);        
    }
}
