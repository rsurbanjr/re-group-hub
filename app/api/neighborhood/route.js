import { NextResponse } from 'next/server';

// This endpoint fetches neighborhood data using Claude to synthesize information
export async function POST(request) {
  try {
    const { neighborhood, location = 'Miami, FL' } = await request.json();
    
    if (!neighborhood) {
      return NextResponse.json({ error: 'Neighborhood name required' }, { status: 400 });
    }

    // Use Claude API to research and synthesize neighborhood data
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Return mock data structure if no API key
      return NextResponse.json({
        success: true,
        data: getDefaultNeighborhoodData(neighborhood)
      });
    }

    const prompt = `Research the luxury real estate neighborhood "${neighborhood}" in ${location}. 
    
Provide accurate, current data in this exact JSON format (no markdown, just JSON):
{
  "name": "${neighborhood}",
  "inventory": <number of current active listings, estimate if unknown>,
  "avgPrice": <average home price in millions, e.g. 5.5 for $5.5M>,
  "pricePerSqFt": <average price per square foot>,
  "avgDom": <average days on market>,
  "avgLotSize": "<typical lot size, e.g. '0.5 acres' or '10,000 sqft'>",
  "keyBuilders": ["<3 notable builders/developers in the area>"],
  "keyArchitects": ["<3 notable architects who have designed homes here>"],
  "characteristics": ["<4-5 key features like security, amenities, schools, location>"],
  "schoolDistrict": "<primary school district>",
  "securityType": "<e.g. 'Guard-gated 24/7', 'Patrol', 'None'>",
  "mainAccess": "<primary road or entry point>",
  "jurisdiction": "<city or county jurisdiction>",
  "quiz": [
    {"question": "<question about price per sqft>", "options": ["<4 options>"], "correct": <0-3 index>},
    {"question": "<question about a key architect or builder>", "options": ["<4 options>"], "correct": <0-3 index>},
    {"question": "<question about lot size>", "options": ["<4 options>"], "correct": <0-3 index>},
    {"question": "<question about main access road or location>", "options": ["<4 options>"], "correct": <0-3 index>},
    {"question": "<question about days on market or inventory>", "options": ["<4 options>"], "correct": <0-3 index>},
    {"question": "<question about security, schools, or amenities>", "options": ["<4 options>"], "correct": <0-3 index>}
  ]
}

Be accurate with real data when possible. For quiz questions, make sure the correct answer index matches the position of the correct option (0-indexed).`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('Claude API error:', result.error);
      return NextResponse.json({
        success: true,
        data: getDefaultNeighborhoodData(neighborhood)
      });
    }

    // Parse the JSON from Claude's response
    const text = result.content?.[0]?.text || '';
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, data });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Return default data if parsing fails
    return NextResponse.json({
      success: true,
      data: getDefaultNeighborhoodData(neighborhood)
    });

  } catch (error) {
    console.error('Neighborhood API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getDefaultNeighborhoodData(neighborhood) {
  return {
    name: neighborhood,
    inventory: 15,
    avgPrice: 5.0,
    pricePerSqFt: 1500,
    avgDom: 90,
    avgLotSize: '0.5 acres',
    keyBuilders: ['Local Builder 1', 'Local Builder 2', 'Local Builder 3'],
    keyArchitects: ['Local Architect 1', 'Local Architect 2', 'Local Architect 3'],
    characteristics: ['Residential neighborhood', 'Good schools', 'Family-friendly', 'Convenient location'],
    schoolDistrict: 'Local District',
    securityType: 'Varies',
    mainAccess: 'Main Road',
    jurisdiction: 'Local',
    quiz: [
      { question: `What type of neighborhood is ${neighborhood}?`, options: ['Commercial', 'Residential', 'Industrial', 'Mixed-use'], correct: 1 },
      { question: `What is important when researching ${neighborhood}?`, options: ['Weather', 'Market data', 'Traffic', 'Restaurants'], correct: 1 },
      { question: 'What should you know about any neighborhood?', options: ['Celebrity residents', 'School districts', 'Fast food options', 'Mall locations'], correct: 1 },
      { question: 'What affects home values?', options: ['Paint color', 'Location & amenities', 'Mailbox style', 'Lawn ornaments'], correct: 1 },
      { question: 'What is Days on Market (DOM)?', options: ['Delivery time', 'Average time to sell', 'Open house count', 'Inspection period'], correct: 1 },
      { question: 'What indicates a luxury neighborhood?', options: ['Fast food nearby', 'Higher price points', 'More traffic', 'Smaller lots'], correct: 1 }
    ]
  };
}
