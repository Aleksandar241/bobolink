import { Button, ScrollView } from 'react-native';

import { NoteFactory } from '@/src/components/Note';
import { NoteSystem } from '@/src/components/NoteSystem';
import { Text } from '@/src/components/Text';
import { changeTheme } from '@/src/theme';
import { IconNaturalIcon } from '@/src/theme/icons/NaturalIcon';

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 100 }}>
      <Text>features.auth.button</Text>
      <IconNaturalIcon color="primary" />
      <Button title="Toggle Theme" onPress={() => changeTheme()} />

      <NoteSystem
        timeSignature={{ beats: 4, beatValue: 4 }}
        sharps={7}
        events={[
          [NoteFactory('c4', 8), NoteFactory('d4', 8)],
          [NoteFactory('e4', 8), NoteFactory('f4', 8)],
        ]}
        clef="treble"
      />

      <NoteSystem
        timeSignature={{ beats: 4, beatValue: 4 }}
        events={[
          [
            NoteFactory('c4', 8, 3),
            NoteFactory('d4', 8, 3),
            NoteFactory('e4', 8, 3),
          ],
        ]}
        clef="treble"
      />

      <NoteSystem
        timeSignature={{ beats: 4, beatValue: 4 }}
        events={[
          [
            NoteFactory('c4', 4, 3),
            NoteFactory('d4', 4, 3),
            NoteFactory('e4', 4, 3),
          ],
        ]}
        clef="treble"
      />

      <NoteSystem
        timeSignature={{ beats: 4, beatValue: 4 }}
        events={[
          [
            NoteFactory('c4', 16, 3),
            NoteFactory('d4', 16, 3),
            NoteFactory('e4', 16, 3),
            NoteFactory('f4', 16, 3),
            NoteFactory('g4', 16, 3),
            NoteFactory('a4', 16, 3),
          ],
        ]}
        clef="treble"
      />

      <NoteSystem
        timeSignature={{ beats: 4, beatValue: 4 }}
        events={[
          [
            NoteFactory('c4', 2, 3),
            NoteFactory('d4', 2, 3),
            NoteFactory('e4', 2, 3),
          ],
        ]}
        clef="treble"
      />
    </ScrollView>
  );
}
