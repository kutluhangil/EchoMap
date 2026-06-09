import { useEffect, type ReactNode } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { db } from '@/lib/db/client';
import migrations from '@/lib/db/migrations/migrations';
import { useEchoStore } from '@/store/useEchoStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Runs SQLite migrations before rendering the app and hydrates the echo store
 * once they succeed. Gating here guarantees every screen sees an up-to-date
 * schema and the initial set of echoes.
 */
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const hydrate = useEchoStore((s) => s.hydrate);
  const { colors } = useTheme();

  useEffect(() => {
    if (success) {
      hydrate();
    }
  }, [success, hydrate]);

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text variant="body" color="error" center>
          {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
