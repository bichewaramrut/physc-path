import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to proxy file uploads to the backend
 * This allows us to bypass CORS issues and handle authentication in one place
 */
export async function POST(request: NextRequest) {
  try {
    // Get the formData from the request
    const formData = await request.formData();
    
    // Extract file type from the request (profile, document, etc.)
    const fileType = formData.get('type') as string;
    
    if (!fileType) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const uploadUrl = `${apiUrl}/api/files/upload/${fileType}`;

    // Get the authorization header from the original request
    const authHeader = request.headers.get('authorization');

    // Forward the request to our backend API
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        // Forward the authorization header if it exists
        ...(authHeader && { Authorization: authHeader }),
      },
      // Forward the formData as is
      body: formData,
    });

    // Parse the response from the backend
    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * Handler for OPTIONS requests (CORS preflight)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
