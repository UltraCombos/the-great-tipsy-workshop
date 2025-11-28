import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const SettingsPath='/settings.json';
const SettingOptions=[
    {key: 'system_prompt', description: 'System Prompt'},
    {key: 'voice', description: 'Voice'},
    {key: 'voice_prompt', description: 'Voice Prompt'},
    {key: 'sd_prompt_prefix', description: 'SD Prompt Prefix'},
    {key: 'sd_prompt_suffix', description: 'SD Prompt Suffix'}
];



const Setting=forwardRef((props,ref)=>{

    const [data, setData]=useState(null);    
    const [collapse, setCollapse]=useState(true);

    useEffect(()=>{

        fetch(SettingsPath)
        .then(response=>response.json())
        .then(data=>setData(data))
        .catch(error=>console.error("Error fetching settings:",error));

    },[]);

    useImperativeHandle(ref,()=>({
        get:(key)=>{
            if(!key) return data;
            return data ? data[key] : null;
        }
    }));

    return (
        <div className="panel">
            <button className="font-bold text-left" onClick={()=>setCollapse(!collapse)}>
                Settings {collapse ? "⏬" : "⏫"}
            </button>
            {collapse ? null : (
                <div className="flex flex-col gap-2 p-2">
                {SettingOptions.map(({key, description})=>(
                <div key={key} className="grid grid-cols-8 gap-2 items-center">
                    <label className="text-sm font-bold">{description}</label>
                    <div className="col-span-7">
                        {key=='voice'?(<input
                            type="text"
                            value={data ? data[key] : ""}
                            onChange={(e)=>setData({...data,[key]:e.target.value})}
                        />):(<textarea
                            value={data ? data[key] : ""}
                            onChange={(e)=>setData({...data,[key]:e.target.value})}
                        />)}
                    </div>
                </div>
                ))}
                </div>
            )}
        </div>
    );

});

export default Setting;