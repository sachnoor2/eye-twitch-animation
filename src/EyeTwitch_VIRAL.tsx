import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from 'remotion';

// Mandatory Colors from CHANNEL_CODEX
const BG_COLOR = '#0E1117';
const GOLD = '#FDCB6E';
const TEAL = '#00CEC9';
const ACCENT = '#FF7675';

const Eye = ({twitchIntensity}: {twitchIntensity: number}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	// Twitch effect: fast, irregular movement
	const twitchY = Math.sin(frame * 1.5) * twitchIntensity * 10;
	const twitchX = Math.cos(frame * 2.1) * twitchIntensity * 5;

	return (
		<div style={{
			position: 'relative',
			transform: `translate(${twitchX}px, ${twitchY}px)`,
		}}>
			<svg width="600" height="400" viewBox="0 0 600 400">
				{/* Eye Sclera */}
				<ellipse cx="300" cy="200" rx="250" ry="150" fill="white" />
				{/* Iris */}
				<circle cx="300" cy="200" r="80" fill={TEAL} />
				{/* Pupil */}
				<circle cx="300" cy="200" r="40" fill="black" />
				{/* Highlight */}
				<circle cx="280" cy="180" r="15" fill="white" opacity="0.6" />
				
				{/* Eyelid (Upper) */}
				<path 
					d={`M 50 200 Q 300 ${50 + twitchIntensity * 100} 550 200`} 
					fill="none" 
					stroke="#E0AC69" 
					strokeWidth="40" 
				/>
				{/* Eyelid (Lower) */}
				<path 
					d={`M 50 200 Q 300 350 550 200`} 
					fill="none" 
					stroke="#E0AC69" 
					strokeWidth="20" 
				/>
			</svg>
		</div>
	);
};

const NerveSparks = ({active}: {active: boolean}) => {
	const frame = useCurrentFrame();
	if (!active) return null;

	const particles = Array.from({length: 15});
	return (
		<AbsoluteFill>
			{particles.map((_, i) => {
				const randomX = (Math.sin(i * 1234) * 0.5 + 0.5) * 1000;
				const randomY = (Math.cos(i * 5678) * 0.5 + 0.5) * 1000;
				const scale = interpolate(Math.sin(frame * 0.5 + i), [-1, 1], [0.5, 1.5]);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: randomX,
							top: randomY,
							width: 10,
							height: 10,
							backgroundColor: GOLD,
							borderRadius: '50%',
							filter: 'blur(2px)',
							opacity: active ? 1 : 0,
							transform: `scale(${scale})`,
							boxShadow: `0 0 15px ${GOLD}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const EyeTwitchViral = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Timeline phases
	// 0-180: Hook & Setup
	// 180-600: Mechanism (Excited Nerves)
	// 600-900: Stress/Caffeine impact
	// 900-1100: Conclusion

	const twitchTrigger = spring({
		frame: frame - 60,
		fps,
		config: {stiffness: 200},
	});

	const mechanismPhase = frame > 180 && frame < 900;
	const stressPhase = frame > 600 && frame < 900;

	const twitchIntensity = interpolate(
		frame,
		[60, 180, 600, 900, 1000],
		[0, 1, 0.5, 2, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	) * (0.5 + Math.random() * 0.5);

	const scale = interpolate(frame, [0, 1000], [1, 1.5], {easing: Easing.out(Easing.quad)});

	return (
		<AbsoluteFill style={{backgroundColor: BG_COLOR, overflow: 'hidden'}}>
			{/* Master Camera Transform */}
			<div style={{
				width: '100%',
				height: '100%',
				transform: `scale(${scale})`,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<Eye twitchIntensity={twitchIntensity} />
				<NerveSparks active={mechanismPhase} />

				{/* Floating Labels with Spring Physics */}
				<Sequence from={120}>
					<div style={{
						position: 'absolute',
						top: 200,
						fontFamily: 'Bebas Neue',
						fontSize: 100,
						color: GOLD,
						opacity: spring({frame: frame - 120, fps}),
						transform: `translateY(${interpolate(spring({frame: frame - 120, fps}), [0, 1], [50, 0])}px)`,
					}}>
						MYOKYMIA
					</div>
				</Sequence>

				{stressPhase && (
					<div style={{
						position: 'absolute',
						bottom: 300,
						fontFamily: 'Bebas Neue',
						fontSize: 80,
						color: ACCENT,
						textShadow: '0 0 20px rgba(255,118,117,0.5)',
					}}>
						STRESS & CAFFEINE
					</div>
				)}
			</div>

			{/* Subtitles Area */}
			<div style={{
				position: 'absolute',
				bottom: 100,
				width: '100%',
				textAlign: 'center',
				padding: '0 50px',
			}}>
				<p style={{
					fontFamily: 'JetBrains Mono',
					fontSize: 40,
					color: 'white',
					backgroundColor: 'rgba(0,0,0,0.7)',
					display: 'inline-block',
					padding: '10px 20px',
					borderRadius: '10px',
				}}>
					{frame < 180 && "Kya aapki aankh phadakti hai?"}
					{frame >= 180 && frame < 600 && "Ye muscle contractions hain."}
					{frame >= 600 && frame < 900 && "Stress nerves ko over-excite karta hai!"}
					{frame >= 900 && "Harmless hai, bas rest karein."}
				</p>
			</div>
		</AbsoluteFill>
	);
};
