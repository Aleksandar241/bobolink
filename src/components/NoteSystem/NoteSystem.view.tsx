import React from 'react';

import { View } from 'react-native';

import { Canvas, Group, Path } from '@shopify/react-native-skia';

import { useStyle } from '@/src/theme';
import { IconBassClefIcon } from '@/src/theme/icons/BassClefIcon';
import { IconTrebleClefIcon } from '@/src/theme/icons/TrebleClefIcon';

import { Measure } from '../Measure';
import { getClefConfig } from '../Measure/clefConfig';
import { CLEF_GAP_X } from '../Measure/clefMetrics';
import {
  clampAccidentalCount,
  KEY_SIGNATURE_GAP_X,
  KEY_SIGNATURE_ICON_HEIGHT,
  KEY_SIGNATURE_ICON_SIZE,
  KEY_SIGNATURE_SPACING_X,
  keySignatureWidth,
} from '../Measure/keySignatureMetrics';
import { MEASURE_PADDING_X } from '../Measure/layout';
import { timeSignatureSize } from '../Measure/timeSignatureMetrics';
import { Text } from '../Text';

import {
  FLAT_PATH,
  FLAT_VIEWBOX,
  SHARP_PATH,
  SHARP_VIEWBOX,
} from './keySignatureSkia';
import { styles } from './styles';
import { useViewModel } from './useViewModel';

import type { NoteSystemProps } from './types';

const CLEF_ICON_BY_CLEF = {
  treble: IconTrebleClefIcon,
  bass: IconBassClefIcon,
} as const;

export const NoteSystem: React.FC<NoteSystemProps> = ({
  events,
  timeSignature,
  clef,
  sharps,
  flats,
}) => {
  const sharpCount = clampAccidentalCount(sharps);
  const flatCount = clampAccidentalCount(flats);

  const { width, height, xOffsets } = useViewModel({
    events,
    timeSignature,
    sharps: sharpCount,
    flats: flatCount,
    clef,
  });
  const {
    theme: { colors },
  } = useStyle();

  const tsBox = React.useMemo(
    () => timeSignatureSize({ timeSignature }),
    [timeSignature]
  );

  const staffHeight = 32;
  const staffTop = Math.max(0, (height - staffHeight) / 2);
  const tsFontSize = 18;
  const tsLineHeight = 18;
  const tsTextHeight = tsLineHeight * 2;
  const tsTopBase = staffTop + (staffHeight - tsTextHeight) / 2;
  const tsDownShift = 1;
  const tsTop = Math.max(
    0,
    Math.min(height - tsTextHeight, tsTopBase + tsDownShift)
  );

  const clefConfig = getClefConfig(clef);
  const clefSize = clefConfig.iconSize;
  const clefTopBase = staffTop + (staffHeight - clefSize) / 2;
  const clefDownShift = clefConfig.clefDownShiftPx;
  const clefTop = Math.max(
    0,
    Math.min(height - clefSize, clefTopBase + clefDownShift)
  );

  const clefInsetX = clefSize + CLEF_GAP_X;
  const ClefIcon = CLEF_ICON_BY_CLEF[clef];

  const keySigWidth = keySignatureWidth({
    sharps: sharpCount,
    flats: flatCount,
  });
  const keySigIconSize = KEY_SIGNATURE_ICON_SIZE;
  const keySigIconHeight = KEY_SIGNATURE_ICON_HEIGHT;
  const keySigSpacingX = KEY_SIGNATURE_SPACING_X;
  const keySigInsetX = keySigWidth > 0 ? keySigWidth + KEY_SIGNATURE_GAP_X : 0;

  const staffStep = staffHeight / 8;
  const sharpSteps = clefConfig.keySignature.sharpStepsFromTop;
  const flatSteps = clefConfig.keySignature.flatStepsFromTop;
  const sharpYTweaksPx = clefConfig.keySignature.sharpYTweaksPx ?? [];
  const sharpAnchorY = clefConfig.keySignature.sharpAnchorY;
  const flatAnchorY = clefConfig.keySignature.flatAnchorY;

  const yForStepFromTop = (stepFromTop: number) =>
    staffTop + stepFromTop * staffStep;

  const keySigBaseX = MEASURE_PADDING_X + clefInsetX;

  const sharpScale = Math.min(
    keySigIconSize / SHARP_VIEWBOX.width,
    keySigIconHeight / SHARP_VIEWBOX.height
  );
  const flatScale = Math.min(
    keySigIconSize / FLAT_VIEWBOX.width,
    keySigIconHeight / FLAT_VIEWBOX.height
  );

  return (
    <View style={[styles.root, { width, height, position: 'relative' }]}>
      <Canvas style={{ width, height }}>
        {events.map((measureEvents, i) => (
          <Group
            key={`measure-${i}`}
            transform={[{ translateX: xOffsets[i]! }]}
          >
            <Measure
              events={measureEvents}
              isStart={i === 0}
              isEnd={i === events.length - 1}
              showLeftBarline={i === 0}
              showRightBarline={true}
              showTimeSignature={i === 0}
              showClef={i === 0}
              timeSignature={timeSignature}
              clef={clef}
              sharps={i === 0 ? sharpCount : 0}
              flats={i === 0 ? flatCount : 0}
            />
          </Group>
        ))}

        {Array.from({ length: sharpCount }).map((_, i) => {
          const baseCenterY = yForStepFromTop(sharpSteps[i]!);
          const tweakY = sharpYTweaksPx[i] ?? 0;
          const centerY = baseCenterY + tweakY;
          const top = centerY - keySigIconHeight * sharpAnchorY;
          const left = keySigBaseX + i * (keySigIconSize + keySigSpacingX);
          return (
            <Path
              key={`key-sig-sharp-${i}`}
              path={SHARP_PATH}
              color={colors.primary}
              transform={[
                { translateX: left },
                { translateY: top },
                { scale: sharpScale },
              ]}
            />
          );
        })}

        {Array.from({ length: flatCount }).map((_, j) => {
          const i = sharpCount + j;
          const centerY = yForStepFromTop(flatSteps[j]!);
          const top = centerY - keySigIconHeight * flatAnchorY;
          const left = keySigBaseX + i * (keySigIconSize + keySigSpacingX);
          return (
            <Path
              key={`key-sig-flat-${j}`}
              path={FLAT_PATH}
              color={colors.primary}
              transform={[
                { translateX: left },
                { translateY: top },
                { scale: flatScale },
              ]}
            />
          );
        })}
      </Canvas>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: MEASURE_PADDING_X,
          top: clefTop,
          width: clefSize,
          height: clefSize,
        }}
        testID="note-system-clef"
      >
        <ClefIcon width={clefSize} height={clefSize} color="primary" />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: MEASURE_PADDING_X + clefInsetX + keySigInsetX,
          top: tsTop,
          width: tsBox.width,
        }}
      >
        <Text
          style={{
            color: colors.primary,
            textAlign: 'center',
            fontSize: tsFontSize,
            lineHeight: tsLineHeight,
            fontWeight: '700',
          }}
        >
          {`${timeSignature.beats}\n${timeSignature.beatValue}`}
        </Text>
      </View>
    </View>
  );
};
