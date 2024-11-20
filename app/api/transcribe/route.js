export async function POST(request) {
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY; // No NEXT_PUBLIC_ prefix

    if (!DEEPGRAM_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio');

        if (!audioFile) {
            return new Response(JSON.stringify({ error: 'No audio file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                'Content-Type': audioFile.type,
            },
            body: audioFile,
        });

        if (!response.ok) {
            throw new Error(`Deepgram API error: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Transcription error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
