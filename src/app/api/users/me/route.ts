import { NextResponse } from 'next/server';
import https from 'https';

// Create agent based on environment
const getAgent = () => {

  // In production, use system certs or add specific certs
  return new https.Agent({ 
    rejectUnauthorized: true,
    // Optionally add specific certs for production:
    // ca: fs.readFileSync('/path/to/cert.pem')
  });
};

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const options = {
      hostname: 'saba.nus.ac.ir',
      path: '/rest/users/me',
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      agent: getAgent() // Use the appropriate agent
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          status: res.statusCode,
          ok: (res.statusCode && res.statusCode >= 200 && res.statusCode < 300),
          json: () => Promise.resolve(JSON.parse(data))
        }));
      });
      req.on('error', reject);
      req.end();
    });

    // @ts-ignore - Custom response shape
    if (!response.ok) {
      // @ts-ignore
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Request failed' },
        // @ts-ignore
        { status: response.status }
      );
    }

    // @ts-ignore
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}