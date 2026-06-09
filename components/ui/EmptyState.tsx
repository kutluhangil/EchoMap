import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Centered empty/quiet state. The copy is meant to invite, not apologize —
 * "Your map is quiet. Record your first echo."
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const { space } = useTheme();
  return (
    <View style={[styles.container, { padding: space.xl, gap: space.md }]}>
      {icon}
      <Text variant="title" center>
        {title}
      </Text>
      {description ? (
        <Text variant="body" color="textMuted" center>
          {description}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: space.md }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
