import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }

  create(dto: any) {
    return this.prisma.event.create({
      data: {
        club_id: dto.club_id,
        event_name: dto.event_name,
        event_date: dto.event_date ? new Date(dto.event_date) : undefined,
        location: dto.location,
        event_type: dto.event_type,
      },
    });
  }

  async sync(dto: any) {
    const {
      event_id,
      club_id,
      event_name,
      event_type,
      event_date,
      location,
      field,
      notes,
      file_start_ts,
      file_end_ts,
      trim_start_ts,
      trim_end_ts,
      recorded_at,
      exercises
    } = dto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Upsert based on session_id (from mobile)
        const event = await tx.event.upsert({
          where: {
            sessionId: event_id,
          },
          update: {
            event_name,
            event_type: event_type || 'training',
            event_date: event_date ? new Date(event_date) : null,
            location,
            file_start_ts: file_start_ts ? BigInt(Math.floor(Number(file_start_ts))) : null,
            file_end_ts: file_end_ts ? BigInt(Math.floor(Number(file_end_ts))) : null,
            trim_start_ts: trim_start_ts ? BigInt(Math.floor(Number(trim_start_ts))) : null,
            trim_end_ts: trim_end_ts ? BigInt(Math.floor(Number(trim_end_ts))) : null,
          },
          create: {
            sessionId: event_id,
            club_id,
            event_name,
            event_type: event_type || 'training',
            event_date: event_date ? new Date(event_date) : null,
            location,
            file_start_ts: file_start_ts ? BigInt(Math.floor(Number(file_start_ts))) : null,
            file_end_ts: file_end_ts ? BigInt(Math.floor(Number(file_end_ts))) : null,
            trim_start_ts: trim_start_ts ? BigInt(Math.floor(Number(trim_start_ts))) : null,
            trim_end_ts: trim_end_ts ? BigInt(Math.floor(Number(trim_end_ts))) : null,
          },
        });

        // Handle Exercises sync
        if (exercises && Array.isArray(exercises)) {
          // Clear existing exercises for this event to avoid duplicates/orphans during re-sync
          await tx.exercise.deleteMany({
            where: { event_id: event.event_id }
          });

          for (const ex of exercises) {
            const newEx = await tx.exercise.create({
              data: {
                event_id: event.event_id,
                type: ex.type,
                start_ts: BigInt(Math.floor(Number(ex.start))),
                end_ts: BigInt(Math.floor(Number(ex.end))),
                color: ex.color,
              }
            });

            if (ex.players && Array.isArray(ex.players)) {
              // Note: player_id must be a valid UUID in the DB
              await tx.exercisePlayer.createMany({
                data: ex.players.map((pId: string) => ({
                  exercise_id: newEx.exercise_id,
                  player_id: pId
                }))
              });
            }
          }
        }

        // Handle Participants sync
        if (dto.participants && Array.isArray(dto.participants)) {
          await tx.eventParticipant.deleteMany({
            where: { event_id: event.event_id }
          });
          await tx.eventParticipant.createMany({
            data: dto.participants.map((pId: string) => ({
              event_id: event.event_id,
              player_id: pId
            }))
          });
        }

        return event;
      });
    } catch (err: any) {
      console.error('❌ [EventsService] Error syncing event:', err);
      throw err;
    }
  }

  findAll() {
    return this.prisma.event.findMany({
      include: {
        event_participants: {
          include: {
            player: {
              select: {
                player_id: true,
                player_name: true,
              },
            },
          },
        },
        exercises: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findBySessionId(sessionId: string) {
    return this.prisma.event.findUnique({
      where: { sessionId },
      include: {
        event_participants: {
          include: {
            player: true,
          },
        },
      },
    });
  }
}
