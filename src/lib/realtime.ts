import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribe to new messages in a squad chat
 * @param squadId - The squad ID to listen to
 * @param onMessage - Callback when a new message arrives
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToMessages(
  squadId: string,
  onMessage: (message: any) => void
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`public:messages:squad=${squadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `squad_id=eq.${squadId}`,
      },
      (payload) => {
        onMessage(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to squad membership changes
 * @param squadId - The squad ID to listen to
 * @param onMembershipChange - Callback when membership changes
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToMemberships(
  squadId: string,
  onMembershipChange: (change: any) => void
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`public:memberships:squad=${squadId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'memberships',
        filter: `squad_id=eq.${squadId}`,
      },
      (payload) => {
        onMembershipChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
