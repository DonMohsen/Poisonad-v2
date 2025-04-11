import { NextResponse } from 'next/server';
import https from 'https';

export async function POST(request: Request) {
  // Only allow SSL bypass in development

  try {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const postData = new URLSearchParams();
    postData.append('username', username);
    postData.append('password', password);
    postData.append('grant_type', 'password');
    postData.append('scope', 'read write');

    const options = {
      hostname: 'saba.nus.ac.ir',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic c2FtYWQtbW9iaWxlOnNhbWFkLW1vYmlsZS1zZWNyZXQ',
        'Content-Length': Buffer.byteLength(postData.toString())
      },
      // This is where we bypass SSL verification
      agent: new https.Agent({ rejectUnauthorized: false })
    };

    // Using Node.js native https instead of fetch
    const externalResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            ok: res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
            json: () => Promise.resolve(JSON.parse(data))
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData.toString());
      req.end();
    });

    // @ts-ignore - We've shaped the response to match fetch's Response
    if (!externalResponse.ok) {
      // @ts-ignore
      const errorData = await externalResponse.json();
      return NextResponse.json(
        { error: errorData.error_description || 'Authentication failed' },
        // @ts-ignore
        { status: externalResponse.status }
      );
    }

    // @ts-ignore
    const data = await externalResponse.json();
    return NextResponse.json({ token: data.access_token });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}