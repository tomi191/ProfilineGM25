import webPush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Send a push notification to all subscribed users.
 * Silently removes stale/invalid subscriptions.
 */
export async function sendPushToAll(payload: {
  title: string;
  body: string;
  url?: string;
}): Promise<void> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.warn('Push: VAPID keys not configured, skipping.');
    return;
  }

  webPush.setVapidDetails(
    `mailto:${process.env.ADMIN_EMAIL || 'contact@profilinegm25.eu'}`,
    publicKey,
    privateKey,
  );

  const supabase = createAdminClient();
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, keys_p256dh, keys_auth');

  if (error || !subscriptions || subscriptions.length === 0) {
    return;
  }

  const message = JSON.stringify(payload);

  const staleIds: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys_p256dh,
          auth: sub.keys_auth,
        },
      };

      try {
        await webPush.sendNotification(pushSub, message);
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === 'object' && 'statusCode' in err
            ? (err as { statusCode: number }).statusCode
            : 0;
        // 404 or 410 means the subscription is no longer valid
        if (statusCode === 404 || statusCode === 410) {
          staleIds.push(sub.id);
        } else {
          console.error('Push send error:', err);
        }
      }
    }),
  );

  // Clean up stale subscriptions
  if (staleIds.length > 0) {
    await supabase.from('push_subscriptions').delete().in('id', staleIds);
  }
}
