# Offline Sync System

A comprehensive offline-first sync system for React Native/Expo apps with automatic queue management and network status monitoring.

## Features

✅ **Automatic Network Detection** - Real-time network status monitoring
✅ **Offline Queue Management** - Operations queued when offline, auto-sync when online
✅ **Visual Indicators** - Sync status indicator on home screen
✅ **Retry Logic** - Failed operations retry up to 3 times
✅ **AsyncStorage Persistence** - Queue survives app restarts
✅ **Manual Sync Control** - Force sync or clear queue from settings

## Components & Hooks

### Hooks

#### `useNetworkStatus()`
Monitors network connectivity status.

```tsx
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const { isConnected, isInternetReachable, type } = useNetworkStatus();
```

#### `useIsOnline()`
Simple boolean hook to check if online.

```tsx
import { useIsOnline } from "@/hooks/useNetworkStatus";

const isOnline = useIsOnline();
```

#### `useSyncQueue()`
Manages the offline sync queue.

```tsx
import { useSyncQueue } from "@/hooks/useSyncQueue";

const {
  queue,           // Array of sync items
  isSyncing,       // Boolean sync status
  addToQueue,      // Add item to queue
  syncQueue,       // Manual sync trigger
  clearQueue,      // Clear all items
  removeItem,      // Remove specific item
  pendingCount,    // Count of pending items
  failedCount      // Count of failed items
} = useSyncQueue();
```

### Components

#### `<SyncStatusIndicator />`
Visual sync status card with click-to-view details.

```tsx
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";

<SyncStatusIndicator />
```

## Usage Example

### Add Item to Sync Queue

```tsx
import { useSyncQueue } from "@/hooks/useSyncQueue";
import { useIsOnline } from "@/hooks/useNetworkStatus";

export function CreateCustomer() {
  const { addToQueue } = useSyncQueue();
  const isOnline = useIsOnline();

  const handleCreate = async (data) => {
    // Add to sync queue
    await addToQueue({
      type: "create",        // "create" | "update" | "delete"
      entity: "customer",    // Entity name (matches tRPC router)
      data: data,           // Payload to sync
    });

    // Show appropriate message
    const message = isOnline
      ? "Customer created and synced!"
      : "Customer saved offline. Will sync when online.";

    Alert.alert("Success", message);
  };

  return (
    <Button onPress={handleCreate}>
      {isOnline ? "Save & Sync" : "Save Offline"}
    </Button>
  );
}
```

### Display Network Status

```tsx
import { useIsOnline } from "@/hooks/useNetworkStatus";

export function NetworkIndicator() {
  const isOnline = useIsOnline();

  return (
    <View className={isOnline ? "bg-green-500" : "bg-amber-500"}>
      <Text>{isOnline ? "🌐 Online" : "📡 Offline"}</Text>
    </View>
  );
}
```

## Sync Queue Flow

1. **User Action** → Operation added to queue
2. **Queue Persistence** → Saved to AsyncStorage
3. **Network Check** → If online, sync immediately
4. **Retry Logic** → Failed items retry up to 3 times
5. **Cleanup** → Synced items removed after 5 seconds

## Sync Status States

| State | Icon | Description |
|-------|------|-------------|
| **Offline** | 📡 | No internet connection, operations queued |
| **Syncing** | 🔄 | Currently syncing operations |
| **Failed** | ⚠️ | Some operations failed to sync |
| **Pending** | ⏸️ | Online but operations waiting in queue |
| **Synced** | ✓ | All operations synced successfully |

## Screens

### Sync Status Screen (`/sync-status`)

Full-featured sync management screen with:
- Network status display
- Auto-sync toggle
- Manual sync button
- Sync statistics (total, pending, failed)
- Queue item list with actions
- Pull-to-refresh

Access via:
- Click sync indicator on home screen
- Search for "sync" in global search
- Navigate to `/sync-status`

## Integration with tRPC

To integrate with your tRPC mutations, update `useSyncQueue.ts`:

```tsx
// In syncQueue function
if (item.entity === 'customer') {
  if (item.type === 'create') {
    await api.customer.create.mutate(item.data);
  } else if (item.type === 'update') {
    await api.customer.update.mutate(item.data);
  } else if (item.type === 'delete') {
    await api.customer.delete.mutate({ id: item.data.id });
  }
}
```

## Testing Offline Mode

### iOS Simulator
- **Disable WiFi**: `Shift + Cmd + H` > Settings > WiFi > Off
- **Airplane Mode**: `Shift + Cmd + H` > Settings > Airplane Mode

### Android Emulator
- **Extended Controls**: `...` button > Cellular > Data status > Denied
- **Or**: Settings > Network & Internet > Wi-Fi > Off

### Physical Device
- Enable Airplane Mode
- Disable WiFi and Cellular Data

## Best Practices

1. **Always show network status** when performing operations
2. **Use appropriate messaging** for online/offline states
3. **Handle errors gracefully** - some operations may fail
4. **Monitor sync queue size** - clear old items periodically
5. **Test offline scenarios** during development
6. **Consider conflict resolution** for concurrent updates

## Architecture

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  addToQueue()   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AsyncStorage   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     YES    ┌──────────────┐
│   Is Online?    │────────────▶│  Sync Now    │
└────────┬────────┘             └──────────────┘
         │ NO
         ▼
┌─────────────────┐
│  Wait for       │
│  Network        │
└─────────────────┘
```

## Future Enhancements

- [ ] Conflict resolution for concurrent edits
- [ ] Batch sync for better performance
- [ ] Selective sync by entity type
- [ ] Sync progress indicators
- [ ] Webhook integration for real-time updates
- [ ] Background sync with WorkManager/BackgroundTasks
