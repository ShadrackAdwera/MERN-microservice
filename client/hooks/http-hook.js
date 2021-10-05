import { useState, useEffect, useCallback, useRef } from 'react';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef([]);

    const sendRequest = useCallback(async(url, method='GET', body=null, headers={})=>{
        setIsLoading(true);
        const AbortController = window.AbortController;
        const abortion = new AbortController();
        abortRef.current.push(abortion);
        try {
            const response = await fetch(url, {
                method, body, headers, signal: abortion.signal
            });
            const resData = await response.json();
            abortRef.current = abortRef.current.filter(abn=>abn!==abortion);
            if(!response.ok) {
                throw new Error(resData.message);
            }
            setIsLoading(false);
            return resData;
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
            throw error;
        }
    },[]);
    const clearError = () => {
        setError(null);
    }
    useEffect(()=>{
        return () => abortRef.current.forEach(abt=>abt.abort());
    },[])
    return { isLoading, sendRequest, error, clearError }
}

export default useHttp;