export default function Histroy({history, className, ...props}){


    return (
        <div className={`flex flex-col gap-1 overflow-y-auto text-sm ${className||''}`} {...props}>
            {history.map((item, index) => {

                if(item.role==="user"){
                    return (
                        <div key={index} className="text-right">
                            <span className="inline-block bg-slate-200 p-2 max-w-[80%] rounded-bl-xl">
                                {item.content}
                            </span>
                        </div>
                    );
                }else if(item.role==="assistant"){
                    return (
                        <div key={index} className="text-left">
                            <span className="inline-block bg-slate-200 p-2 max-w-[80%] rounded-br-xl">
                                {item.content}
                            </span>
                            {item.prompt && (
                                <div className="mt-1 text-xs">
                                    {item.prompt}
                                </div>
                            )}
                        </div>
                    );
                }
            })}
        </div>
    )

}