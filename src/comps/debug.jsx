import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { updatePrompt } from "../utils/prompt";


export default function Debug({ className, ...props }) {

    const [collapse, setCollapse] = useState(true);

    function sendOscMessage() {
        const address = document.getElementById("oscAddress").value;
        const message = document.getElementById("oscMessage").value;

        if (!address || address.trim() === "") return;
        invoke("send_osc_message", { address: address, message: message });

    }

    function sendPrompt() {
        const prompt = document.getElementById("promptMessage").value;
        if (!prompt || prompt.trim() === "") return;
        updatePrompt(prompt);
    }

    return (
        <section className="panel">
            <button className="font-bold text-left" onClick={() => setCollapse(!collapse)}>
                Debug Utils {collapse ? "⏬" : "⏫"}
            </button>
            {collapse ? null : (
                <div className="flex flex-col gap-2 p-2">
                    {/* <div className="grid grid-cols-7 items-center gap-2">
                        <label>Osc Address</label>
                        <input type="text" id="oscAddress" defaultValue="/test" className="col-span-2" />

                        <label>Message</label>
                        <input type="text" id="oscMessage" defaultValue="Hello" className="col-span-2" />
                        <button onClick={sendOscMessage} className="util_button">Send OSC</button>
                    </div> */}
                    <div className="grid grid-cols-7 gap-2 items-stretch">
                        <input type="text" id="promptMessage" defaultValue="test scene" className="col-span-6 " />
                        <button onClick={sendPrompt} className="util_button">Send Prompt</button>
                    </div>
                </div>)}
        </section>
    )

}