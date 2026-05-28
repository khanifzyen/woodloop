import { useEffect, useRef } from "react";
import { getPB } from "@/lib/pocketbase/client";
import type { RecordSubscription } from "pocketbase";

/**
 * Subscribe to realtime changes on a PocketBase collection.
 * Automatically cleans up on unmount.
 *
 * @param collection - Collection name (e.g. "bids", "notifications")
 * @param topic - Usually "*" for all records, or a record ID for a specific record
 * @param callback - Called on every realtime event with RecordSubscription
 * @param filter - Optional PocketBase filter string (e.g. 'user="abc123"')
 * @param enabled - If false, subscription won't be created (default: true)
 */
export function useRealtimeSubscription<T>(
  collection: string,
  topic: string,
  callback: (event: RecordSubscription<T>) => void,
  filter?: string,
  enabled = true,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const pb = getPB();

    const handler = (event: RecordSubscription<T>) => {
      callbackRef.current(event);
    };

    const options = filter ? { filter } : undefined;

    pb.collection(collection).subscribe(topic, handler, options);

    return () => {
      pb.collection(collection).unsubscribe(topic);
    };
  }, [collection, topic, filter, enabled]);
}
