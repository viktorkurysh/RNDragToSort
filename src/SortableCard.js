import React from 'react';
import {Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import Card, {CARD_HEIGHT as INNER_CARD_HEIGHT} from './Card';

export const CARD_HEIGHT = INNER_CARD_HEIGHT + 32;
const {width} = Dimensions.get('window');

const SortableCard = ({card}) => {
  return (
    <PanGestureHandler>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: CARD_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Card {...{card}} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SortableCard;
