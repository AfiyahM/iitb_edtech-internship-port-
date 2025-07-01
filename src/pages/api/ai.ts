import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBteQox6mq96AEC5ehSEXefMItWDdq2szA';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, userId, resume } = req.body;

    const prompt = `
You are a job assistant AI. The user has the following resume: ${resume || 'No resume provided'}.
Their question: "${query}"
Give a brief, concise answer (2-3 sentences) unless the user asks for a detailed or long explanation.
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await geminiRes.json();

    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    let answer = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      answer = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.content?.text) {
      answer = data.candidates[0].content.text;
    } else if (data?.candidates?.[0]?.output) {
      answer = data.candidates[0].output;
    }

    if (!answer) {
      return res.status(200).json({ answer: 'Sorry, Gemini did not return a valid response.' });
    }

    return res.status(200).json({ answer });
  } catch (e) {
    console.error('Gemini API error:', e);
    return res.status(500).json({ error: 'AI service error.' });
  }
}