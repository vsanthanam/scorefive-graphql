import type { AnonymousParticipant } from '@/models/anonymousParticipant.model';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export type GameParticipant = User | SavedPlayer | AnonymousParticipant;
