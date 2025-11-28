export default function History({history, className,children, ...props}){


    return (
        <div className={`panel overflow-y-auto relative ${className||''}`} {...props}>
            {history.map((item, index) => {

                if(item.role==="user"){
                    return (
                        <div key={index} className="text-right m-2">
                            <span className="inline-block border bg-[#555555] p-2 max-w-[80%] rounded-bl-xl">
                                {item.content}
                            </span>
                        </div>
                    );
                }else if(item.role==="assistant"){
                    return (
                        <div key={index} className="text-left m-2">
                            <span className="inline-block border bg-[#555555] p-2 max-w-[80%] rounded-br-xl">
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
            {children}
        </div>
    )

}