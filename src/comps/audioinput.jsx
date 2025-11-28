import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Speech({callback, onInput, language='zh-TW'}) {


    const [autoSend, setAutoSend] = useState(false);
    const [audioInput, setAudioInput] = useState(false);

    const {
      transcript,
      finalTranscript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable,
    } = useSpeechRecognition();


    function setup(){
        if(!browserSupportsSpeechRecognition){
            console.error("Speech recognition not supported in this browser.");
            return;
        }
        if(!isMicrophoneAvailable){
            console.error("Microphone is not available.");
            return;
        }
        SpeechRecognition.startListening({ continuous: true, language: language });
        setAudioInput(true);
    }
    function stop(){
        SpeechRecognition.stopListening();
        setAudioInput(false);
    }

    function reset(){
        resetTranscript();
    }
    useEffect(()=>{
        
        console.log("Speech input received:", transcript);
        onInput(transcript);

    },[transcript]);

    useEffect(()=>{

        if(!finalTranscript) return;

        if(autoSend && finalTranscript){
            callback(finalTranscript);
            reset();
        }


    },[finalTranscript]);

    return (
        <>
            <button className={`${audioInput ? "selected" : ""} control_button`} 
                onClick={audioInput ? stop : setup}>
                    {audioInput ? "stop audio input" : "start audio input"}
            </button>
            <button className={`${autoSend? 'selected': ''} control_button`} onClick={()=>setAutoSend(pre=>!pre)}>
                {autoSend ? "disable" : "enable"} auto send
            </button>
        </>
    );

}