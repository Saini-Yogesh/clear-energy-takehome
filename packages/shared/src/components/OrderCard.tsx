import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { OrderCardProps } from '../types';
import {
  formatCurrency,
  formatDate,
  formatETA,
  getStatusColors,
  getPriorityColors,
  truncateAddress,
} from '../utils/formatter';
import { OrderCardSkeleton } from './OrderCardSkeleton';

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewMode,
  onActionPress,
  isLoading = false,
}) => {
  const { colors, spacing, borderRadius, shadows } = useAppTheme();

  if (isLoading) {
    return <OrderCardSkeleton />;
  }

  const {
    id,
    customerName,
    address,
    amount,
    sku,
    status,
    priority,
    createdAt,
    eta,
    actionType,
    reason,
  } = order;

  // Dynamic status and priority colors
  const statusColor = getStatusColors(status, colors);
  const priorityColor = getPriorityColors(priority, colors);

  // Render sub-views based on viewMode
  const renderHeader = () => {
    switch (viewMode) {
      case 'driver':
        return (
          <View style={styles.headerRow}>
            <View style={[styles.badge, { backgroundColor: colors.infoBackground }]}>
              <Text style={[styles.badgeText, { color: colors.info }]}>
                STOP #{order.eta ? 'ACTIVE' : 'SEQ'}
              </Text>
            </View>
            <View style={styles.rightHeader}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ETA: </Text>
              <Text style={[styles.etaText, { color: colors.primary }]}>
                {eta ? formatETA(eta) : 'N/A'}
              </Text>
            </View>
          </View>
        );
      case 'admin':
        return (
          <View style={styles.headerRow}>
            <View style={[styles.badge, { backgroundColor: priorityColor.bg }]}>
              <Text style={[styles.badgeText, { color: priorityColor.text, fontWeight: 'bold' }]}>
                {priority}
              </Text>
            </View>
            {actionType && (
              <View style={[styles.badge, { backgroundColor: colors.errorBackground }]}>
                <Text style={[styles.badgeText, { color: colors.error }]}>
                  {actionType.replace('_', ' ')}
                </Text>
              </View>
            )}
          </View>
        );
      case 'customer':
      default:
        return (
          <View style={styles.headerRow}>
            <Text style={[styles.skuText, { color: colors.textSecondary }]}>{sku}</Text>
            <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.badgeText, { color: statusColor.text }]}>{status}</Text>
            </View>
          </View>
        );
    }
  };

  const renderActions = () => {
    if (!onActionPress) return null;

    switch (viewMode) {
      case 'driver':
        return (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
              onPress={() => onActionPress('NAVIGATE', id)}
              accessibilityRole="button"
              accessibilityLabel="Navigate to address"
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => onActionPress('COMPLETE', id)}
              accessibilityRole="button"
              accessibilityLabel="Mark stop as completed"
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>Complete</Text>
            </TouchableOpacity>
          </View>
        );
      case 'admin':
        return (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.dangerButton,
                { backgroundColor: colors.errorBackground },
              ]}
              onPress={() => onActionPress('REJECT', id)}
              accessibilityRole="button"
              accessibilityLabel="Reject request"
            >
              <Text style={[styles.buttonText, { color: colors.error }]}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => onActionPress('APPROVE', id)}
              accessibilityRole="button"
              accessibilityLabel="Approve request"
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>Approve</Text>
            </TouchableOpacity>
          </View>
        );
      case 'customer':
      default:
        // Customers can cancel pending orders
        if (status === 'PENDING') {
          return (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  { borderColor: colors.border, width: '100%' },
                ]}
                onPress={() => onActionPress('CANCEL', id)}
                accessibilityRole="button"
                accessibilityLabel="Cancel order"
              >
                <Text style={[styles.buttonText, { color: colors.error }]}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          );
        }
        return null;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
        shadows as ViewStyle,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Order ${sku}, Priority ${priority}, Status ${status}`}
    >
      {renderHeader()}

      <View style={styles.contentBody}>
        {viewMode !== 'driver' && (
          <Text style={[styles.customerName, { color: colors.textPrimary }]}>{customerName}</Text>
        )}

        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {viewMode === 'driver' ? truncateAddress(address, 55) : address}
        </Text>

        <View style={styles.metaRow}>
          <View>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.amountText, { color: colors.textPrimary }]}>
              {formatCurrency(amount)}
            </Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
              {viewMode === 'driver' ? 'Priority' : 'Created'}
            </Text>
            {viewMode === 'driver' ? (
              <View style={[styles.priorityTag, { backgroundColor: priorityColor.bg }]}>
                <Text style={[styles.priorityTagText, { color: priorityColor.text }]}>
                  {priority}
                </Text>
              </View>
            ) : (
              <Text style={[styles.dateText, { color: colors.textPrimary }]}>
                {formatDate(createdAt)}
              </Text>
            )}
          </View>
        </View>

        {viewMode === 'admin' && reason && (
          <View
            style={[
              styles.reasonBox,
              { backgroundColor: colors.warningBackground, borderRadius: borderRadius.md },
            ]}
          >
            <Text style={[styles.reasonTitle, { color: colors.warning }]}>Flag Reason:</Text>
            <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{reason}</Text>
          </View>
        )}
      </View>

      {renderActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skuText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contentBody: {
    marginVertical: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  metaRight: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  priorityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reasonBox: {
    marginTop: 12,
    padding: 8,
  },
  reasonTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    // Background color set dynamically
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  dangerButton: {
    // Background color set dynamically
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});
