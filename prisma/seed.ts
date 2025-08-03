import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('Demo123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@betanalyst.com' },
    update: {},
    create: {
      email: 'admin@betanalyst.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create demo user
  const userPassword = await hashPassword('Demo123!');
  const user = await prisma.user.upsert({
    where: { email: 'demo@betanalyst.com' },
    update: {},
    create: {
      email: 'demo@betanalyst.com',
      password: userPassword,
      name: 'Demo User',
      role: 'USER'
    }
  });

  // Create sample tips
  const tips = [
    {
      matchInfo: 'Liverpool vs Arsenal',
      sport: 'SOCCER',
      league: 'Premier League',
      suggestedPick: 'Over 2.5 Goals',
      odds: 1.85,
      winProbability: 65.5,
      confidenceScore: 8,
      matchDate: new Date('2025-08-04T15:00:00Z'),
      analysis: 'Both teams have strong attacking records. Liverpool averages 2.3 goals per game at home, while Arsenal has conceded in 8 of their last 10 away matches. Weather conditions are perfect, and both teams need points.',
      currentOdds: 1.85,
      oddsMovement: 'STABLE'
    },
    {
      matchInfo: 'Manchester City vs Chelsea',
      sport: 'SOCCER',
      league: 'Premier League',
      suggestedPick: 'Manchester City Win',
      odds: 2.10,
      winProbability: 58.2,
      confidenceScore: 7,
      matchDate: new Date('2025-08-04T17:30:00Z'),
      analysis: 'Manchester City has won 7 of their last 10 home games against Chelsea. Key player Haaland is in excellent form with 12 goals in 8 games. Chelsea has injury concerns in defense.',
      currentOdds: 2.10,
      oddsMovement: 'UP'
    },
    {
      matchInfo: 'Barcelona vs Real Madrid',
      sport: 'SOCCER',
      league: 'La Liga',
      suggestedPick: 'Both Teams to Score',
      odds: 1.65,
      winProbability: 72.1,
      confidenceScore: 9,
      matchDate: new Date('2025-08-05T20:00:00Z'),
      analysis: 'El Clasico rarely disappoints in terms of goals. Both teams have scored in 15 of their last 20 meetings. Barcelona\'s attack is clicking with Lewandowski, while Real Madrid has Benzema back from injury.',
      currentOdds: 1.65,
      oddsMovement: 'DOWN'
    },
    {
      matchInfo: 'Lakers vs Warriors',
      sport: 'BASKETBALL',
      league: 'NBA',
      suggestedPick: 'Over 225.5 Points',
      odds: 1.90,
      winProbability: 61.8,
      confidenceScore: 6,
      matchDate: new Date('2025-08-04T22:00:00Z'),
      analysis: 'High-scoring affair expected. Both teams rank in top 10 for pace of play. Lakers average 118 PPG at home, Warriors average 115 PPG on road. Defensive injuries on both sides.',
      currentOdds: 1.92,
      oddsMovement: 'UP'
    },
    {
      matchInfo: 'Djokovic vs Alcaraz',
      sport: 'TENNIS',
      league: 'ATP Masters',
      suggestedPick: 'Over 2.5 Sets',
      odds: 1.75,
      winProbability: 68.3,
      confidenceScore: 8,
      matchDate: new Date('2025-08-05T14:00:00Z'),
      analysis: 'These two champions rarely have short matches. 8 of their last 10 meetings went to at least 3 sets. Both players are in peak form and this could be a classic.',
      currentOdds: 1.75,
      oddsMovement: 'STABLE'
    }
  ];

  for (const tipData of tips) {
    const valueScore = (tipData.winProbability / 100) * tipData.odds - 1;

    await prisma.tip.create({
      data: {
        ...tipData,
        valueScore,
        sport: tipData.sport as any,
        oddsMovement: tipData.oddsMovement as any
      }
    });
  }

  // Create sample settings
  await prisma.settings.upsert({
    where: { key: 'platform_name' },
    update: {},
    create: {
      key: 'platform_name',
      value: 'BetAnalyst Pro'
    }
  });

  await prisma.settings.upsert({
    where: { key: 'min_odds' },
    update: {},
    create: {
      key: 'min_odds',
      value: '1.20'
    }
  });

  console.log('Database seeded successfully!');
  console.log('Demo credentials:');
  console.log('Admin: admin@betanalyst.com / Demo123!');
  console.log('User: demo@betanalyst.com / Demo123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
