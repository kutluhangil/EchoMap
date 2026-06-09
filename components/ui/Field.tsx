import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface FieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

/**
 * Labeled text input for titles and memory notes. Surfaces an inline error and
 * flips its border to the error color when one is present.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, style, ...rest },
  ref,
) {
  const { colors, radius, space, type } = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      {label ? (
        <Text variant="label" color="textMuted">
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textFaint}
        style={[
          type.body,
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  input: { borderWidth: 1, minHeight: 48 },
});
