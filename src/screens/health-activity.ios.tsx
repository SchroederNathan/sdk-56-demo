import { Chart, type ChartDataPoint, Gauge, Host, HStack, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  background,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  padding,
  scaleEffect,
  shapes,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { type ColorValue, PlatformColor, ScrollView, StyleSheet } from 'react-native';

import {
  EXERCISE_COLOR,
  EXERCISE_GOAL,
  EXERCISE_VALUE,
  MOVE_COLOR,
  MOVE_GOAL,
  MOVE_VALUE,
  MOVE_WEEK,
  STAND_COLOR,
  STAND_GOAL,
  STAND_VALUE,
} from '@/screens/health-activity.data';
import { secondaryText } from '@/styles';

// Same warm coral -> lavender wash as the Summary tab, for visual cohesion
// across the Health tabs.
const ACTIVITY_GRADIENT =
  'linear-gradient(180deg, #F6A98C 0%, #F2A0AE 12%, #E0AAC9 22%, #C8BAE6 32%, rgba(242,242,247,1) 44%)';

const cardFill = PlatformColor('secondarySystemGroupedBackground');
const barGray = PlatformColor('systemGray5');

const MOVE_DATA: ChartDataPoint[] = MOVE_WEEK.map((y, i) => ({
  color: i === MOVE_WEEK.length - 1 ? MOVE_COLOR : barGray,
  x: String(i + 1),
  y,
}));

function Card({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      alignment="leading"
      spacing={12}
      modifiers={[
        frame({ alignment: 'leading', maxWidth: Infinity }),
        padding({ horizontal: 16, vertical: 22 }),
        background(cardFill, shapes.roundedRectangle({ cornerRadius: 26 })),
      ]}>
      {children}
    </VStack>
  );
}

// A `circularCapacity` gauge has a fixed intrinsic diameter (~58pt) that `frame`
// does NOT resize — it only pads the layout box, so three framed gauges all draw
// at the same size and stack on top of each other. Use `scaleEffect` to actually
// grow each ring, nesting them at decreasing scales in a ZStack to reproduce the
// concentric Move/Exercise/Stand rings.
const BASE_RING = 58;

function Ring({ color, goal, size, value }: { color: ColorValue; goal: number; size: number; value: number }) {
  return (
    <Gauge
      value={value}
      min={0}
      max={goal}
      modifiers={[gaugeStyle('circularCapacity'), tint(color), scaleEffect(size / BASE_RING)]}
    />
  );
}

function MetricRow({ color, label, unit, value }: { color: ColorValue; label: string; unit: string; value: string }) {
  return (
    <VStack alignment="leading" spacing={0}>
      <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(color)]}>{label}</Text>
      <HStack alignment="firstTextBaseline" spacing={4}>
        <Text modifiers={[font({ design: 'rounded', size: 26, weight: 'bold' })]}>{value}</Text>
        <Text modifiers={[font({ size: 14, weight: 'semibold' }), secondaryText]}>{unit}</Text>
      </HStack>
    </VStack>
  );
}

export default function HealthActivityScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <Host matchContents={{ vertical: true }} style={styles.host}>
        <VStack alignment="leading" spacing={16} modifiers={[frame({ alignment: 'leading', maxWidth: Infinity })]}>
          <Text modifiers={[font({ size: 22, weight: 'bold' })]}>Activity</Text>

          <Card>
            <HStack spacing={20} alignment="center">
              <ZStack modifiers={[frame({ height: 132, width: 132 })]}>
                <Ring color={MOVE_COLOR} goal={MOVE_GOAL} value={MOVE_VALUE} size={132} />
                <Ring color={EXERCISE_COLOR} goal={EXERCISE_GOAL} value={EXERCISE_VALUE} size={96} />
                <Ring color={STAND_COLOR} goal={STAND_GOAL} value={STAND_VALUE} size={60} />
              </ZStack>
              <VStack alignment="leading" spacing={12}>
                <MetricRow color={MOVE_COLOR} label="Move" value={`${MOVE_VALUE}/${MOVE_GOAL}`} unit="KCAL" />
                <MetricRow
                  color={EXERCISE_COLOR}
                  label="Exercise"
                  value={`${EXERCISE_VALUE}/${EXERCISE_GOAL}`}
                  unit="MIN"
                />
                <MetricRow color={STAND_COLOR} label="Stand" value={`${STAND_VALUE}/${STAND_GOAL}`} unit="HRS" />
              </VStack>
              <Spacer />
            </HStack>
          </Card>

          <Card>
            <HStack alignment="firstTextBaseline">
              <Text modifiers={[font({ size: 18, weight: 'bold' }), foregroundStyle(MOVE_COLOR)]}>Move</Text>
              <Spacer />
              <Text modifiers={[font({ size: 17 }), secondaryText]}>This Week</Text>
            </HStack>
            <Chart
              data={MOVE_DATA}
              type="bar"
              showGrid={false}
              barStyle={{ cornerRadius: 3, width: 16 }}
              modifiers={[frame({ height: 120, maxWidth: Infinity })]}
            />
          </Card>
        </VStack>
      </Host>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 24, paddingHorizontal: 20 },
  host: { backgroundColor: 'transparent', width: '100%' },
  scroll: { backgroundColor: '#F2F2F7', experimental_backgroundImage: ACTIVITY_GRADIENT, flex: 1 },
});
