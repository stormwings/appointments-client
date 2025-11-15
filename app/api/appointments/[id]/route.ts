import { NextRequest, NextResponse } from 'next/server';
import type { Appointment } from '@/lib/appointments';
import type { ErrorResponse, RouteContext } from '@/lib/types';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: RouteContext<{ id: string }>
): Promise<NextResponse<Appointment | ErrorResponse>> {
  try {
    const { id } = await context.params;

    const response = await fetch(`${BACKEND_API_URL}/appointments/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Appointment not found' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/appointments/[id]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<{ id: string }>
): Promise<NextResponse<null | ErrorResponse>> {
  try {
    const { id } = await context.params;

    const response = await fetch(`${BACKEND_API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error deleting appointment' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/appointments/[id]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
