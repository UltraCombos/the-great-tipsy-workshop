import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

export const OSC_ADDRESS={
    STATUS: '/status',
    INPUT: '/input',
    HINT:'/hint',
    SPEECH:'/speech',
    
}


export async function sendOsc(key, message, port='9000') {

    if(message === undefined || message === null) {
        console.warn('sendOsc: message is empty, skipping');
        return;
    }
    try{
        if(key!=OSC_ADDRESS.AMPLITUDE) console.log(`Sending OSC message: ${key} -> ${message}`);
        await invoke('send_osc_message', {
            key: key,
            message: message.toString(),
            host:`0.0.0.0:0`,
            target: `127.0.0.1:${port}`,
        });
    }catch (error){
        console.error('Error sending OSC message:', error);        
    }
}




export function onOscMessageReceived(callback) {
    try{
        listen('osc_message', (event) => {
            console.log(`Received OSC message: ${event.payload}`);
            callback(event.payload);
        });
    }catch(error){
        console.error('Error setting up OSC message listener:', error);
    }
}

export async function sendOscStatus(key, message) {
    
     if(message === undefined || message === null) {
        console.warn('sendOscStatus: message is empty, skipping');
        return;
    }

    try{
        // console.log(`Sending OSC Status:${message}`);
        await invoke('send_osc_message', {
            key: key,
            message: message.toString(),
            host:`0.0.0.0:0`,
            target: '192.168.51.255:7000',
        });
    }catch (error){
        console.error('Error sending OSC message:', error);        
    }
}