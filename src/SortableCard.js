import React from 'react';
import {Dimensions} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  Value,
  add,
  eq,
  cond,
  set,
  lessThan,
  divide,
  useCode,
  block,
  multiply,
  diff,
  debug,
  round,
  and,
  neq,
  Clock,
  spring,
  startClock,
  not,
} from 'react-native-reanimated';
import {panGestureHandler} from 'react-native-redash/lib/module/v1';

import Card, {CARD_HEIGHT as INNER_CARD_HEIGHT} from './Card';

export const CARD_HEIGHT = INNER_CARD_HEIGHT + 16;
const {width} = Dimensions.get('window');

const withSafeOffset = (value, state, offset) => {
  const safeOffset = new Value(0);

  return cond(eq(state, State.ACTIVE), add(safeOffset, value), [
    set(safeOffset, offset),
    safeOffset,
  ]);
};

const withTransition = (value, velocity, gestureState) => {
  const clock = new Clock();
  const config = {
    toValue: new Value(0),
    damping: 40,
    mass: 1,
    stiffness: 400,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
  };
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  return block([
    startClock(clock),
    set(config.toValue, value),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.position, value), set(state.velocity, velocity)],
      spring(clock, state, config),
    ),
    state.position,
  ]);
};

function moving(value) {
  const frames = new Value(0);
  const delta = diff(value);
  return cond(
    lessThan(delta, 0.01),
    [set(frames, add(frames, 1)), not(lessThan(frames, 5))],
    [set(frames, 0), 1],
  );
}

const SortableCard = ({card, index, offSets}) => {
  const {gestureHandler, state, translation, velocity} = panGestureHandler();
  const x = withSafeOffset(translation.x, state, 0);
  const y = withSafeOffset(translation.y, state, offSets[index]);

  const translateX = withTransition(x, velocity.x, state);
  const translateY = withTransition(y, velocity.y, state);

  const currentIndex = round(divide(y, CARD_HEIGHT));
  const currentOffset = multiply(currentIndex, CARD_HEIGHT);
  const zIndex = cond(
    eq(state, State.ACTIVE),
    200,
    cond(moving(translation.y), 100, 1),
  );

  useCode(
    () =>
      block([
        ...offSets.map((offset) =>
          cond(
            and(
              eq(currentOffset, offset),
              neq(currentOffset, offSets[index]),
              eq(state, State.ACTIVE),
            ),
            [set(offset, offSets[index]), set(offSets[index], currentOffset)],
          ),
        ),
      ]),
    [currentOffset, index, offSets, state],
  );

  useCode(
    () =>
      block([
        debug('currentOffset', currentOffset),
        debug('offset', offSets[index]),
      ]),
    [currentOffset],
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 8,
          left: 0,
          width,
          height: CARD_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{translateX}, {translateY}],
          zIndex,
        }}>
        <Card {...{card}} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SortableCard;
