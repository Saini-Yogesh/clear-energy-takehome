import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import {
  usePendingActions,
  useNetwork,
  useRefresh,
  OrderCard,
  EmptyState,
  ErrorState,
  useAppTheme,
  OrderCardSkeleton,
  PendingAction,
} from '@clear-energy/shared';

export const PendingActionsScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const { isConnected } = useNetwork();

  // Fetch pending queue actions for Admin 'admin-301'
  const { data, isLoading, isError, error, refetch, resolveAction, isResolving } =
    usePendingActions('admin-301');
  const { isRefreshing, handleRefresh } = useRefresh(refetch);

  const handleAdminAction = useCallback(
    async (action: string, orderId: string) => {
      // Find the specific item to determine its action type
      const actionItem = data?.find((item) => item.id === orderId);
      if (!actionItem) return;

      const confirmTitle = action === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection';
      const confirmMessage =
        action === 'APPROVE'
          ? `Are you sure you want to approve action ${actionItem.actionType}?`
          : 'Please enter a rejection reason (simulated).';

      Alert.alert(confirmTitle, confirmMessage, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'APPROVE' ? 'Approve' : 'Reject',
          style: action === 'APPROVE' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              // Execute mutation which calls PATCH /pending-actions/{id}
              await resolveAction({
                actionId: orderId,
                actionType: actionItem.actionType,
                reason: action === 'APPROVE' ? 'Approved by Admin' : 'Rejected by Admin',
              });
              Alert.alert('Success', `Action ${orderId} resolved successfully.`);
            } catch (err) {
              Alert.alert('Error', 'Failed to resolve action. Please try again.');
            }
          },
        },
      ]);
    },
    [data, resolveAction],
  );

  // Memoized render item to prevent unnecessary re-renders
  const renderItem: ListRenderItem<PendingAction> = useCallback(
    ({ item }) => <OrderCard order={item} viewMode="admin" onActionPress={handleAdminAction} />,
    [handleAdminAction],
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
  const activeActions = data?.filter((item) => item.status === 'PENDING') || [];
  if (activeActions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        {renderNetworkBanner()}
        <EmptyState
          title="Inbox Clear"
          message="No pending queue actions require admin attention today."
          onRetry={refetch}
          retryText="Check Inbox"
        />
      </View>
    );
  }

  // 4. Success State
  return (
    <View style={styles.container}>
      {renderNetworkBanner()}

      <FlatList
        data={activeActions}
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

      {/* Mutation Loading Overlay */}
      {isResolving && (
        <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          <View
            style={[
              styles.overlayBox,
              { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.xl },
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[styles.overlayText, { color: colors.textPrimary, marginTop: spacing.md }]}
            >
              Resolving Action...
            </Text>
          </View>
        </View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayBox: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
export default PendingActionsScreen;
