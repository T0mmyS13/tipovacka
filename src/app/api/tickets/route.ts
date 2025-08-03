import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCombinedOdds } from '@/lib/betting-utils';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id },
      include: {
        ticketTips: {
          include: {
            tip: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tipIds, stake } = await request.json();

    if (!tipIds || !Array.isArray(tipIds) || tipIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tips are required' },
        { status: 400 }
      );
    }

    // Get tips to calculate odds
    const tips = await prisma.tip.findMany({
      where: {
        id: { in: tipIds },
        status: 'PENDING'
      }
    });

    if (tips.length !== tipIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some tips are invalid or no longer available' },
        { status: 400 }
      );
    }

    const totalOdds = calculateCombinedOdds(tips);
    const estimatedPayout = stake ? stake * totalOdds : null;

    // Check for authentication
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    const user = token ? verifyToken(token) : null;

    const ticket = await prisma.ticket.create({
      data: {
        userId: user?.id || null,
        totalOdds,
        stake: stake ? parseFloat(stake) : null,
        estimatedPayout,
        ticketTips: {
          create: tipIds.map((tipId: string) => ({
            tipId
          }))
        }
      },
      include: {
        ticketTips: {
          include: {
            tip: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
