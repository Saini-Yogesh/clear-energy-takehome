import React, { useCallback } from 'react';
import { View, FlatList, Alert, StyleSheet, Text, ListRenderItem } from 'react-native';
import {
  useTrips,
  useNetwork,
  useRefresh,
  OrderCard,
  EmptyState,
  ErrorState,
  useAppTheme,
  OrderCardSkeleton,
  TripStop,
} from '@clear-energy/shared';

export const TripScreen: React.FC = () => {
  const { colors, spacing } = useAppTheme();
  const { isConnected } = useNetwork();

  // Fetch trips for driver ID 'driver-201'
  const { data, isLoading, isError, error, refetch } = useTrips('driver-201');
  const { isRefreshing, handleRefresh } = useRefresh(refetch);

  // Extract stops from active trip
  const activeTrip = data?.find((t) => t.status === 'ACTIVE') || data?.[0];
  const stops = activeTrip?.stops || [];

  const handleStopAction = useCallback(
    (action: string, orderId: string) => {
      if (action === 'NAVIGATE') {
        Alert.alert('Navigation', `Simulating GPS route to stop ${orderId}...`, [{ text: 'OK' }]);
      } else if (action === 'COMPLETE') {
        Alert.alert('Confirm Completion', 'Are you sure you want to mark this stop as delivered?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Delivered',
            style: 'default',
            onPress: () => {
              Alert.alert('Success', `Stop ${orderId} completed successfully.`);
              refetch();
            },
          },
        ]);
      }
    },
    [refetch],
  );

  // Memoized render item to prevent unnecessary re-renders
  const renderItem: ListRenderItem<TripStop> = useCallback(
    ({ item }) => <OrderCard order={item} viewMode="driver" onActionPress={handleStopAction} />,
    [handleStopAction],
  );

  // Render network banner if offline
  const renderNetworkBanner = () => {
    if (isConnected) return null;
    return (
      <View style={[styles.networkBanner, { backgroundColor: colors.errorBackground }]}>
        <Text style={[styles.networkBannerText, { color: colors.error }]}>
          ⚠️ Running in Offline Mode
        </Text>
      </View>
    );
  };

  // 1. Loading State
  if (isLoading && !isRefreshing) {
    return (
      <View
        style={[styles.centerContainer, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}
      >
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </View>
    );
  }

  // 2. Error State
  if (isError && error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorState error={error} onRetry={refetch} />
      </View>
    );
  }

  // 3. Empty State
  if (!activeTrip || stops.length === 0) {
    return (
      <View style={styles.centerContainer}>
        {renderNetworkBanner()}
        <EmptyState
          title="No Trips Today"
          message="You do not have any active trips scheduled for delivery today."
          onRetry={refetch}
        />
      </View>
    );
  }

  // 4. Success State
  return (
    <View style={styles.container}>
      {renderNetworkBanner()}
      <FlatList
        data={stops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxxl,
        }}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  networkBanner: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  networkBannerText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
export default TripScreen;
