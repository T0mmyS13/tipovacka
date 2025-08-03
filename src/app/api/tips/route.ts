import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateValueScore } from '@/lib/betting-utils';
import { Sport } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') as Sport | null;
    const dateRange = searchParams.get('dateRange');
    const valueOnly = searchParams.get('valueOnly') === 'true';
    const minOdds = searchParams.get('minOdds');
    const maxOdds = searchParams.get('maxOdds');
    const minConfidence = searchParams.get('minConfidence');

    // Build filter conditions
    const where: any = {
      status: 'PENDING'
    };

    if (sport) {
      where.sport = sport;
    }

    // Modified date filtering to be more permissive
    if (dateRange === 'today') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      where.matchDate = {
        gte: today,
        lt: tomorrow
      };
    } else if (dateRange === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      where.matchDate = {
        gte: tomorrow,
        lt: dayAfter
      };
    } else if (dateRange === 'week') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      where.matchDate = {
        gte: today,
        lt: nextWeek
      };
    }
    // If no dateRange or dateRange is not recognized, show all tips

    if (minOdds || maxOdds) {
      where.odds = {};
      if (minOdds) where.odds.gte = parseFloat(minOdds);
      if (maxOdds) where.odds.lte = parseFloat(maxOdds);
    }

    if (minConfidence) {
      where.confidenceScore = {
        gte: parseInt(minConfidence)
      };
    }

    if (valueOnly) {
      where.valueScore = {
        gt: 0
      };
    }

    console.log('Tips query filters:', where); // Debug log

    const tips = await prisma.tip.findMany({
      where,
      orderBy: [
        { valueScore: 'desc' },
        { matchDate: 'asc' }
      ],
      include: {
        _count: {
          select: {
            comments: true,
            ticketTips: true
          }
        }
      }
    });

    console.log(`Found ${tips.length} tips`); // Debug log

    return NextResponse.json({
      success: true,
      data: tips
    });

  } catch (error) {
    console.error('Tips fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      matchInfo,
      sport,
      league,
      suggestedPick,
      odds,
      winProbability,
      confidenceScore,
      matchDate,
      analysis
    } = await request.json();

    // Validation
    if (!matchInfo || !sport || !suggestedPick || !odds || !winProbability || !confidenceScore || !matchDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate value score
    const valueScore = calculateValueScore(winProbability, odds);

    const tip = await prisma.tip.create({
      data: {
        matchInfo,
        sport,
        league: league || '',
        suggestedPick,
        odds: parseFloat(odds),
        winProbability: parseFloat(winProbability),
        confidenceScore: parseInt(confidenceScore),
        valueScore,
        matchDate: new Date(matchDate),
        analysis: analysis || null,
        currentOdds: parseFloat(odds)
      }
    });

    return NextResponse.json({
      success: true,
      data: tip
    });

  } catch (error) {
    console.error('Tip creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tip' },
      { status: 500 }
    );
  }
}
