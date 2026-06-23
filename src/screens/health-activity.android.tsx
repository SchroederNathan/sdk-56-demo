import {
  Box,
  Card,
  CircularProgressIndicator,
  Column,
  Host,
  type MaterialColors,
  Row,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxSize,
  fillMaxWidth,
  height,
  padding,
  Shapes,
  size,
  verticalScroll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Same warm coral -> lavender wash as the Summary tab, painted on the RN view
// behind the (transparent) Compose tree so the opaque cards sit on the gradient.
const ACTIVITY_GRADIENT =
  'linear-gradient(180deg, #F6A98C 0%, #F2A0AE 12%, #E0AAC9 22%, #C8BAE6 32%, rgba(242,242,247,1) 44%)';

// Faint track behind each ring (25% alpha of the ring color).
const TRACK = '#33000000';

// Inactive bar fill. surfaceVariant is too close to the card color to read, so
// use a fixed mid gray (matches the iOS systemGray feel) for clear contrast.
const BAR_INACTIVE = '#C7C7CC';

// Android counterpart of the SwiftUI Activity screen. The concentric Move /
// Exercise / Stand rings are three Compose CircularProgressIndicators nested in
// a centered Box at decreasing sizes; the SwiftUI side uses circularCapacity
// Gauges.
export default function HealthActivityScreen() {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ experimental_backgroundImage: ACTIVITY_GRADIENT, backgroundColor: '#F2F2F7', flex: 1 }}>
      <Host style={{ flex: 1 }}>
        <Column
          modifiers={[fillMaxSize(), verticalScroll(), padding(20, 20 + insets.top, 20, 20)]}
          verticalArrangement={{ spacedBy: 16 }}>
          <Text style={{ fontWeight: '700', typography: 'titleLarge' }} color={colors.onSurface}>
            Activity
          </Text>

          <ActivityCard colors={colors}>
            <Row modifiers={[fillMaxWidth()]} verticalAlignment="center" horizontalArrangement={{ spacedBy: 20 }}>
              <Box modifiers={[size(132, 132)]} contentAlignment="center">
                <Ring color={MOVE_COLOR} value={MOVE_VALUE} goal={MOVE_GOAL} diameter={132} />
                <Ring color={EXERCISE_COLOR} value={EXERCISE_VALUE} goal={EXERCISE_GOAL} diameter={96} />
                <Ring color={STAND_COLOR} value={STAND_VALUE} goal={STAND_GOAL} diameter={60} />
              </Box>
              <Column verticalArrangement={{ spacedBy: 12 }}>
                <MetricRow colors={colors} color={MOVE_COLOR} label="Move" value={`${MOVE_VALUE}/${MOVE_GOAL}`} unit="KCAL" />
                <MetricRow
                  colors={colors}
                  color={EXERCISE_COLOR}
                  label="Exercise"
                  value={`${EXERCISE_VALUE}/${EXERCISE_GOAL}`}
                  unit="MIN"
                />
                <MetricRow colors={colors} color={STAND_COLOR} label="Stand" value={`${STAND_VALUE}/${STAND_GOAL}`} unit="HRS" />
              </Column>
            </Row>
          </ActivityCard>

          <ActivityCard colors={colors}>
            <Row modifiers={[fillMaxWidth()]} verticalAlignment="center">
              <Text style={{ fontWeight: '700', typography: 'titleMedium' }} color={MOVE_COLOR}>
                Move
              </Text>
              <Spacer modifiers={[weight(1)]} />
              <Text style={{ typography: 'bodyMedium' }} color={colors.onSurfaceVariant}>
                This Week
              </Text>
            </Row>
            <BarChart values={MOVE_WEEK} accent={MOVE_COLOR} />
          </ActivityCard>
        </Column>
      </Host>
    </View>
  );
}

function ActivityCard({ children, colors }: { children: React.ReactNode; colors: MaterialColors }) {
  return (
    <Card colors={{ containerColor: colors.surfaceContainer }} modifiers={[fillMaxWidth()]}>
      <Column modifiers={[fillMaxWidth(), padding(16, 18, 16, 18)]} verticalArrangement={{ spacedBy: 12 }}>
        {children}
      </Column>
    </Card>
  );
}

function Ring({ color, diameter, goal, value }: { color: string; diameter: number; goal: number; value: number }) {
  return (
    <CircularProgressIndicator
      progress={Math.min(1, value / goal)}
      color={color}
      trackColor={TRACK}
      strokeWidth={11}
      strokeCap="round"
      modifiers={[size(diameter, diameter)]}
    />
  );
}

function MetricRow({
  color,
  colors,
  label,
  unit,
  value,
}: {
  color: string;
  colors: MaterialColors;
  label: string;
  unit: string;
  value: string;
}) {
  return (
    <Column verticalArrangement={{ spacedBy: 0 }}>
      <Text style={{ fontSize: 14, fontWeight: '600' }} color={color}>
        {label}
      </Text>
      <Row verticalAlignment="bottom" horizontalArrangement={{ spacedBy: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }} color={colors.onSurface}>
          {value}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '600' }} color={colors.onSurfaceVariant}>
          {unit}
        </Text>
      </Row>
    </Column>
  );
}

function BarChart({ accent, values }: { accent: string; values: number[] }) {
  const max = Math.max(...values);
  const last = values.length - 1;

  return (
    <Row modifiers={[height(120), fillMaxWidth()]} verticalAlignment="bottom" horizontalArrangement={{ spacedBy: 8 }}>
      {values.map((value, index) => (
        <Box
          key={index}
          modifiers={[
            weight(1),
            height(Math.max(6, Math.round((value / max) * 120))),
            clip(Shapes.RoundedCorner(3)),
            background(index === last ? accent : BAR_INACTIVE),
          ]}
        />
      ))}
    </Row>
  );
}
