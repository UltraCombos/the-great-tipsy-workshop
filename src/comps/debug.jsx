import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { updatePrompt } from "../utils/prompt";


export default function Debug({className, ...props}){

    const [collapse, setCollapse]=useState(true);

    function sendOscMessage(){
        const address=document.getElementById("oscAddress").value;
        const message=document.getElementById("oscMessage").value;

        if(!address || address.trim()==="") return;
        invoke("send_osc_message", {address: address, message: message});

    }

    function sendPrompt(){
        const prompt=document.getElementById("promptMessage").value;
        if(!prompt || prompt.trim()==="") return;
        updatePrompt(prompt);
    }   

    return  (
        <section className="text-sm flex flex-col bg-green-100 p-2 items-stretch gap-2">
            <button className="font-bold text-left" onClick={()=>setCollapse(!collapse)}>
                Utils {collapse ? "⏬" : "⏫"}
            </button>
            {collapse ? null : (<>
                <div className="grid grid-cols-7 items-center gap-2">
                    <label>address</label>
                    <input type="text" id="oscAddress" defaultValue="/test" className="col-span-2"/>
                
                    <label>message</label>
                    <input type="text" id="oscMessage" defaultValue="Hello" className="col-span-2"/>
                    <button onClick={sendOscMessage} className="util_button">Send OSC</button>
                </div>
                <div className="grid grid-cols-7 gap-2 items-center">
                    <input type="text" id="promptMessage" defaultValue="test scene" className="col-span-6 "/>
                    <button onClick={sendPrompt} className="util_button">Send Prompt</button>
                </div>
            </>)}
        </section>
    )
    
}