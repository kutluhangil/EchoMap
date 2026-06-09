import { forwardRef, useCallback, type ReactNode } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import { useTheme } from '@/theme/ThemeProvider';

export type SheetRef = BottomSheetModal;

interface SheetProps {
  children: ReactNode;
  /** Fixed snap points; omit to size to content. */
  snapPoints?: (string | number)[];
}

/**
 * Themed bottom sheet built on @gorhom/bottom-sheet. Present/dismiss it via the
 * forwarded ref (`ref.current?.present()`). Sizes to its content unless explicit
 * snap points are given. Mounted under the BottomSheetModalProvider in
 * AppProviders.
 */
export const Sheet = forwardRef<BottomSheetModal, SheetProps>(function Sheet(
  { children, snapPoints },
  ref,
) {
  const { colors, radius, space } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={{ padding: space.xl, paddingBottom: space.xxl }}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
