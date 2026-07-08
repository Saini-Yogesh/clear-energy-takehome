import React, { useCallback } from 'react';
import { View, FlatList, Alert, StyleSheet, Text, ListRenderItem } from 'react-native';
import {
  useOrders,
  useNetwork,
  useRefresh,
  OrderCard,
  EmptyState,
  ErrorState,
  useAppTheme,
  OrderCardSkeleton,
  CustomerOrder,
} from '@clear-energy/shared';

export const OrdersScreen: React.FC = () => {
  const { colors, spacing } = useAppTheme();
  const { isConnected } = useNetwork();

  // Fetch orders for customer ID 'cust-101'
  const { data, isLoading, isError, error, refetch } = useOrders('cust-101');
  const { isRefreshing, handleRefresh } = useRefresh(refetch);

  const handleOrderAction = useCallback(
    (action: string, orderId: string) => {
      if (action === 'CANCEL') {
        Alert.alert('Cancel Order', `Are you sure you want to cancel order ${orderId}?`, [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Success', `Order ${orderId} has been cancelled successfully.`);
              refetch();
            },
          },
        ]);
      }
    },
    [refetch],
  );

  // Memoized render item to prevent unnecessary re-renders
  const renderItem: ListRenderItem<CustomerOrder> = useCallback(
    ({ item }) => <OrderCard order={item} viewMode="customer" onActionPress={handleOrderAction} />,
    [handleOrderAction],
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
  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        {renderNetworkBanner()}
        <EmptyState
          title="No Orders Today"
          message="You don't have any active orders scheduled for delivery today."
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
        data={data}
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
export default OrdersScreen;
