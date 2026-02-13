import React, {useEffect , useState } from "react";

const API = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export default function Drive() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    async function fetchFiles() {
        try{
            const res = await fetch(`${API}/api/files`);
            const data = await res.json();
            setFiles(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.log("Fetch files err: " , err);
            setFiles([]);

        }
    }

    async function handleUpload(e){
        e.preventDefault();
        if (!file) return alert("Please select a file first!");
        setLoading(true);
        try{
            const fd = new FormData();
            fd.append("file" , file);

            const res = await fetch(`${API}/api/files/upload` , {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if(data.success) {
                setFile(null);
            }
        }

    }
}