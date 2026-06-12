import React from 'react';
import { Composition } from 'remotion';
import { EyeTwitchViral } from './EyeTwitch_VIRAL';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="EyeTwitchViral"
      component={EyeTwitchViral}
      durationInFrames={2700}
      fps={60}
      width={1080}
      height={1920}
    />
  </>
);
