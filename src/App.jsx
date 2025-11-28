import { useRef, useState } from "react";
import "./App.css";
import Setting from "./comps/setting.jsx";
import { sendChatMessage } from "./utils/chat.js";
import History from "./comps/history.jsx";
import Speech from "./comps/audioinput.jsx";
import { updatePrompt } from "./utils/prompt.js";
import { textToSpeech } from "./utils/tts.js";
import Debug from "./comps/debug.jsx";


function App() {
  
  const [history, setHistory] = useState([]);
  const [TTS, setTTS] = useState(true);

  const refInput=useRef();
  const refSetting=useRef();

  function onSend(){
    const value = refInput.current.value;
    if(!value || value.trim()==="") return;


    const settings=refSetting.current.get();
    if(!settings) {
        console.error("Settings not loaded yet.");
        return;
    }

    const message={
      role: "user",
      content: value
    };

    setHistory([...history, message]);
    refInput.current.value = "";

    sendChatMessage([...history, message], settings).then((response)=>{
        console.log("Chat response:", response)
        setHistory(pre=>[...pre, {role:"assistant", content:response.output_text, prompt: response.prompt}]);



        if(TTS){
          textToSpeech(response.output_text, settings.voice, settings.voice_prompt).then((audioUrl)=>{
            if(audioUrl){
              console.log("Playing audio from URL:", audioUrl);
              const audio=new Audio(audioUrl);
              audio.play();
            }
          }).catch((error)=>{
              console.error("Error in text-to-speech:", error);
          });
        }

          
        if(response.prompt){
          updatePrompt(response.prompt);
        }
        
        

    }).catch((error)=>{
        console.error("Error sending chat message:", error);
    });

  }


  return (
    <main className="flex flex-col p-4 h-screen gap-2">
      <Setting ref={refSetting} />
      <Debug/>
      <section className="flex-1 flex flex-col p-2 gap-2 items-stretch justify-end overflow-hidden">
        <History history={history} className="flex-1 overflow-y-auto mb-2"/>
        <div className="flex flex-row gap-2">
          <textarea ref={refInput} className="border border-gray-300 p-2 flex-1"/>
          <button className="bg-blue-500 control_button" onClick={onSend}>send</button>
          <Speech callback={onSend} onInput={(transcript) => { refInput.current.value = transcript; }}/>
          <button className={`bg-gray-400 control_button ${TTS ? 'border-5' : ''}`} onClick={()=>setTTS(!TTS)}>TTS</button>
        </div>
      </section>
    </main>
  );
}

export default App;
