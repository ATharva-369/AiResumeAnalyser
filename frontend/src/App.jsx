import { useState } from "react";
import './App.css';
import React from 'react';
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'

function App() {
  const [file, setFile] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [markdown, setMarkdown] = useState("# Analysis not generated")


  const handleAddFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddJobDescription = (e) => {
    setJobDescription(e.target.value);
  }

  const handleSubmit= async (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/uploadData";
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.message}`);
      }

    let markdown = await response.json();
    setMarkdown(markdown.result);
    console.log(markdown)

    } catch {
      console.log(e.message);
    }
  };

  return (
    <div className="app-container">
      <form>
        <div className="container-1">
          <input type="file" onChange={handleAddFile} />
        </div>
        <div className="container-2">
          <textarea onChange={handleAddJobDescription}/>
          <button type="submit" onClick={handleSubmit}>
            Analyze
          </button>
        </div>
        <div id="analysis">
        <Markdown>{markdown}</Markdown>
        </div>
      </form>
    </div>
  );
}

export default App;
