"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import developer from "@/assets/icons/engineer.svg";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export function WIP() {
	const [score, setScore] = useState(0);
	const [position, setPosition] = useState({ x: 50, y: 50 });
	const [message, setMessage] = useState("The developer is lazy but working");
	const [gameStarted, setGameStarted] = useState(false);
	const [timeLeft, setTimeLeft] = useState(30);
	const [speed, setSpeed] = useState(2000);
	const [combo, setCombo] = useState(0);
	const [lastClickTime, setLastClickTime] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const moveRandomly = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current.getBoundingClientRect();
		const maxX = container.width - 50;
		const maxY = container.height - 50;

		setPosition({
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		});
	}, []);

	const startGame = () => {
		setGameStarted(true);
		setScore(0);
		setTimeLeft(30);
		setSpeed(2000);
		setCombo(0);
		moveRandomly();
	};

	const catchDeveloper = () => {
		const currentTime = Date.now();
		const timeDiff = currentTime - lastClickTime;

		// Combo system
		if (timeDiff < 1000) {
			setCombo((prev) => prev + 1);
		} else {
			setCombo(0);
		}

		setLastClickTime(currentTime);

		// Score calculation with combo bonus
		const points = 1 + Math.floor(combo / 3);
		setScore((prev) => prev + points);

		// Increase difficulty
		if (score % 5 === 0 && speed > 800) {
			setSpeed((prev) => prev * 0.8);
		}

		moveRandomly();

		// Dynamic messages
		if (score >= 15) {
			setMessage("The site will be ready soon thanks to you!");
		} else if (score >= 10) {
			setMessage("Wow! You're motivating the developer!");
		} else if (score >= 5) {
			setMessage("Nice catching! The developer is working faster now!");
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			catchDeveloper();
		}
	};

	useEffect(() => {
		if (!gameStarted) return;

		const moveInterval = setInterval(moveRandomly, speed);
		const timerInterval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setGameStarted(false);
					clearInterval(moveInterval);
					clearInterval(timerInterval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			clearInterval(moveInterval);
			clearInterval(timerInterval);
		};
	}, [gameStarted, moveRandomly, speed]);

	return (
		<section className="flex flex-col items-center justify-center gap-4 p-8 min-h-[70vh]">
			<h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-600 text-transparent bg-clip-text">
				Work in Progress
			</h2>
			<p className="text-lg text-center mb-4">{message}</p>

			{!gameStarted ? (
				<div className="text-center">
					<p className="mb-4">
						While you wait, help catch the developer to speed things up!
					</p>
					<Button
						onClick={startGame}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Start Game
					</Button>
				</div>
			) : (
				<>
					<div className="flex gap-4 items-center justify-center mb-4">
						<div className="text-xl">Score: {score}</div>
						<div className="text-xl">Time: {timeLeft}s</div>
						{combo > 0 && (
							<div className="text-xl text-purple-500">Combo: x{combo}</div>
						)}
					</div>
					<Progress value={(timeLeft / 30) * 100} className="w-64 mb-4" />
					<div
						ref={containerRef}
						className="relative border-2 border-dashed border-gray-300 rounded-lg w-full max-w-lg h-64 mb-8"
						style={{ cursor: "crosshair" }}
					>
						<button
							className="absolute cursor-pointer transform hover:scale-110 transition-transform"
							style={{
								left: `${position.x}px`,
								top: `${position.y}px`,
								transition: `left ${speed * 0.001}s ease-out, top ${speed * 0.001}s ease-out`,
							}}
							onClick={catchDeveloper}
							type="button"
							tabIndex={0}
						>
							<Image
								src={developer}
								alt="Developer"
								width={40}
								height={40}
								className="animate-bounce"
							/>
						</button>
					</div>
				</>
			)}

			<p className="text-sm text-gray-500 italic mt-4">
				{score > 20
					? "Thanks for your help! The site will be ready very soon!"
					: "The more you catch the developer, the faster the site will be completed!"}
			</p>
		</section>
	);
}
