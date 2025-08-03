import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const oddsApiKey = process.env.ODDS_API_KEY;
    const footballApiKey = process.env.FOOTBALL_API_KEY;

    const results = {
      oddsApi: null,
      footballApi: null
    };

    // Test The Odds API
    if (oddsApiKey) {
      console.log('Testing The Odds API...');
      try {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${oddsApiKey}&regions=us&markets=h2h&oddsFormat=decimal&dateFormat=iso`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        if (response.ok) {
          const data = await response.json();
          results.oddsApi = {
            success: true,
            matchesFound: data.length,
            remainingRequests: response.headers.get('x-requests-remaining'),
            sampleMatch: data[0]?.home_team + ' vs ' + data[0]?.away_team || 'No matches'
          };
        } else {
          results.oddsApi = {
            success: false,
            error: `HTTP ${response.status}: ${await response.text()}`
          };
        }
      } catch (error) {
        results.oddsApi = {
          success: false,
          error: error.message
        };
      }
    }

    // Test API-Football (Real API with your key!)
    if (footballApiKey) {
      console.log('Testing API-Football with your key...');
      try {
        const response = await fetch(
          'https://v3.football.api-sports.io/fixtures?league=39&season=2024&next=10',
          {
            headers: {
              'X-RapidAPI-Key': footballApiKey,
              'X-RapidAPI-Host': 'v3.football.api-sports.io'
            }
          }
        );

        console.log('API-Football Response Status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('API-Football Response:', data);

          results.footballApi = {
            success: true,
            matchesFound: data.response?.length || 0,
            requestsRemaining: response.headers.get('x-ratelimit-requests-remaining'),
            sampleMatch: data.response?.[0] ?
              `${data.response[0].teams.home.name} vs ${data.response[0].teams.away.name}` :
              'No upcoming matches',
            league: 'Premier League 2024/25'
          };
        } else {
          const errorText = await response.text();
          console.log('API-Football Error:', errorText);
          results.footballApi = {
            success: false,
            error: `HTTP ${response.status}: ${errorText}`
          };
        }
      } catch (error) {
        console.error('API-Football Error:', error);
        results.footballApi = {
          success: false,
          error: error.message
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API Connection Tests',
      apis: results,
      keys: {
        oddsApi: oddsApiKey ? oddsApiKey.substring(0, 8) + '...' : 'Not configured',
        footballApi: footballApiKey ? footballApiKey.substring(0, 8) + '...' : 'Not configured'
      }
    });

  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Connection test failed: ' + error.message
    });
  }
}
