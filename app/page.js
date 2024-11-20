'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
    const [file, setFile] = useState(null)
    const [transcription, setTranscription] = useState('')
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.type.startsWith('audio/')) {
            setFile(selectedFile)
            setTranscription('')
            setError('')
        } else {
            setError('Please select a valid audio file.')
            setFile(null)
        }
    }

    const handleTranscribe = async () => {
        if (!file) return

        setIsTranscribing(true)
        setError('')
        
        try {
            const formData = new FormData()
            formData.append('audio', file)

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Transcription failed')
            }

            const data = await response.json()
            if (!data.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
                throw new Error('Invalid response format')
            }

            setTranscription(data.results.channels[0].alternatives[0].transcript)
        } catch (error) {
            console.error('Transcription error:', error)
            setError(error.message || 'An error occurred during transcription.')
            setTranscription('')
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
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Audio Transcription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="audio-file">Upload Audio File</Label>
                    <Input 
                        id="audio-file" 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileChange}
                        className="mt-1"
                    />
                </div>
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
                {file && (
                    <div>
                        <Button 
                            onClick={handleTranscribe} 
                            disabled={isTranscribing}
                            className="w-full"
                        >
                            {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
                        </Button>
                    </div>
                )}
                {transcription && (
                    <div>
                        <Label htmlFor="transcription">Transcription</Label>
                        <Textarea 
                            id="transcription" 
                            value={transcription} 
                            readOnly 
                            rows={5}
                            className="mt-1"
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {transcription && (
                    <Button onClick={handleDownload} className="w-full">
                        Download Transcription
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
