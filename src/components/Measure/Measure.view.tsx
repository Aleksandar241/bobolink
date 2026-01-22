import React from 'react';

import { Group, Path } from '@shopify/react-native-skia';

import { Note } from '../Note/Note.view';
import { Rest } from '../Rest/Rest.view';

import { MEASURE_PADDING_X } from './layout';
import { useViewModel } from './useViewModel';

import type { MeasureProps } from './types';

export const Measure: React.FC<MeasureProps> = ({
  events,
  timeSignature,
  clef = 'treble',
  sharps,
  flats,
  noteSpacing = 8,
  direction = 'auto',
  stemThresholdMidi = 71,
  isStart = false,
  isEnd = false,
  showLeftBarline = true,
  showRightBarline = true,
  showTimeSignature = false,
  showClef = false,
}) => {
  const {
    color,
    layout,
    beamPaths,
    stemPaths,
    tripletPaths,
    barlinePaths,
    staffPaths,
    ledgerLinePaths,
    beamedFlags,
    directionByIndex,
    yOffsets,
    leadingInset,
  } = useViewModel({
    events,
    timeSignature,
    clef,
    sharps,
    flats,
    noteSpacing,
    direction,
    stemThresholdMidi,
    isStart,
    isEnd,
    showTimeSignature,
    showClef,
  });

  return (
    <Group>
      {staffPaths.map(({ path, key }) => (
        <Path key={key} path={path} color={color} />
      ))}

      {showLeftBarline && <Path path={barlinePaths.left} color={color} />}
      {showRightBarline && <Path path={barlinePaths.right} color={color} />}

      <Group transform={[{ translateX: MEASURE_PADDING_X + leadingInset }]}>
        {stemPaths.map(({ path, key }) => (
          <Path key={key} path={path} color={color} />
        ))}
        {beamPaths.map(({ path, key }) => (
          <Path key={key} path={path} color={color} />
        ))}

        {events.map((e, i) => (
          <Group
            key={`${e.kind}-${i}`}
            transform={[
              { translateX: layout.xOffsets[i]! },
              { translateY: yOffsets[i]! },
            ]}
          >
            {e.kind === 'rest' ? (
              <Rest value={e.value} withDot={Boolean(e.withDot)} />
            ) : (
              <Note
                value={e.value}
                withDot={Boolean(e.withDot)}
                withTriplet={Boolean(e.withTriplet)}
                withBeam={false}
                hideFlag={beamedFlags[i]}
                hideStem={beamedFlags[i]}
                direction={directionByIndex[i]!}
              />
            )}
          </Group>
        ))}

        {tripletPaths.map(({ path, key }) => (
          <Path
            key={key}
            path={path}
            color={color}
            style={key.startsWith('tuplet-num-') ? 'stroke' : 'fill'}
            strokeWidth={key.startsWith('tuplet-num-') ? 1.7 : undefined}
            strokeCap={key.startsWith('tuplet-num-') ? 'round' : undefined}
            strokeJoin={key.startsWith('tuplet-num-') ? 'round' : undefined}
          />
        ))}

        {ledgerLinePaths.map(({ path, key }) => (
          <Path key={key} path={path} color={color} />
        ))}
      </Group>
    </Group>
  );
};
