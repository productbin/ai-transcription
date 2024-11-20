'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Simulated transcription function
const transcribeAudio = async file => {
  // In a real-world scenario, you would send the file to a transcription API
  // and wait for the response. Here, we're simulating the process.
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
  return `This is a simulated transcription of the file "${file.name}". 
In a real application, this would be the actual transcribed text from the audio file.`
}

export function AudioTranscriptionComponent() {
  const [file, setFile] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile)
      setTranscription('')
    } else {
      alert('Please select a valid audio file.')
    }
  }

  const handleTranscribe = async () => {
    if (!file) return

    setIsTranscribing(true)
    try {
      const result = await transcribeAudio(file)
      setTranscription(result)
    } catch (error) {
      console.error('Transcription error:', error)
      setTranscription('An error occurred during transcription.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleDownload = () => {
    if (!transcription) return

    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcription.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    (<Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Audio Transcription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="audio-file">Upload Audio File</Label>
          <Input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} />
        </div>
        {file && (
          <div>
            <Button onClick={handleTranscribe} disabled={isTranscribing}>
              {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
            </Button>
          </div>
        )}
        {transcription && (
          <div>
            <Label htmlFor="transcription">Transcription</Label>
            <Textarea id="transcription" value={transcription} readOnly rows={5} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {transcription && (
          <Button onClick={handleDownload}>Download Transcription</Button>
        )}
      </CardFooter>
    </Card>)
  );
}