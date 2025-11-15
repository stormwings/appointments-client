import { NextRequest, NextResponse } from 'next/server';
import type { Appointment } from '@/lib/appointments';
import type { ErrorResponse, RouteContext, UpdateStatusPayload } from '@/lib/types';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function PATCH(
  request: NextRequest,
  context: RouteContext<{ id: string }>
): Promise<NextResponse<Appointment | ErrorResponse>> {
  try {
    const { id } = await context.params;
    const body: UpdateStatusPayload = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error updating status' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/appointments/[id]/status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
