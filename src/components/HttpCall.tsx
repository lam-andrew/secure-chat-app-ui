import { useEffect, useState } from "react";

const HttpCall = () => {
    const [data, setData] = useState<string>("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/http-call`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData.data);
            });
    });

    return (
        <>
            <div className="flex items-center justify-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">HTTP Communication: </h2>
                <h2 className="text-lg text-gray-600">{data}</h2>
            </div>
        </>
    );
}

export default HttpCall;
