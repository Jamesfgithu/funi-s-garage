"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const heroBg = "/funis-garage/hero-bg.jpg"; // Use JPEG
const logo = "/funis-garage/logo.png"; // Use PNG
const beforeImg = "/funis-garage/before.webp"; // Use WebP
const afterImg = "/funis-garage/after.webp"; // Use WebP

const testimonials = [
	{
		name: "Sarah M.",
		rating: 5,
		review:
			"Absolutely incredible! My car looks brand new. Anthony's attention to detail is unmatched. Highly recommend Funi's Garage!",
	},
	{
		name: "James R.",
		rating: 5,
		review:
			"The best detailing experience I've ever had. The interior and exterior both look showroom ready. Worth every penny!",
	},
	{
		name: "Linda T.",
		rating: 5,
		review:
			"Prompt, professional, and the results are stunning. The engine bay shine blew me away!",
	},
];

export default function FunisGarageLanding() {
	const [notified, setNotified] = useState(false);
	const [loading, setLoading] = useState(false);
	const [heroVisible, setHeroVisible] = useState(false);
	const sectionRefs = useRef<(HTMLElement | null)[]>([]);

	// Track first interaction
	const handleFirstInteraction = async () => {
		if (notified || loading) return;
		setLoading(true);
		try {
			await fetch("/api/notify-anthony", { method: "POST" });
			setNotified(true);
		} catch (e) {
			console.log("Notify error", e);
		} finally {
			setLoading(false);
		}
	};

	// Animate hero headline on mount
	useEffect(() => {
		setHeroVisible(true);
	}, []);

	// Scroll-triggered fade-in for sections
	useEffect(() => {
		const handleScroll = () => {
			sectionRefs.current.forEach((ref) => {
				if (ref) {
					const rect = ref.getBoundingClientRect();
					if (rect.top < window.innerHeight * 0.85) {
						ref.classList.add("fade-in-section");
					}
				}
			});
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<main
			className="min-h-screen bg-black text-white flex flex-col items-center justify-start relative overflow-x-hidden"
			onPointerDown={handleFirstInteraction}
			onTouchStart={handleFirstInteraction}
			onKeyDown={handleFirstInteraction}
		>
			{/* Parallax Hero Section */}
			<section
				className="w-full flex flex-col items-center justify-center pt-4 pb-10 px-2 md:px-4 relative text-center min-h-[80vh] md:min-h-[70vh]"
				style={{
					backgroundImage: `url(${heroBg})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundAttachment: "fixed",
				}}
			>
				{/* Brighten overlay */}
				<div
					className="absolute inset-0 z-0"
					style={{ background: "rgba(255,255,255,0.3)" }}
				/>
				{/* Darken overlay for text contrast */}
				<div className="absolute inset-0 bg-black/70 z-10" />
				<div className="relative z-20 flex flex-col items-center gap-4 md:gap-6 w-full max-w-5xl mx-auto">
					<Image
						src={logo}
						alt="Funi's Garage Logo"
						width={220}
						height={80}
						className="mb-2 md:mb-4 animate-logo-fade"
						priority
						style={{ width: "220px", height: "auto" }}
					/>
					<h1
	className="text-2xl md:text-5xl font-extrabold text-gold tracking-tight leading-tight transition-all duration-700 opacity-100 text-center whitespace-normal md:whitespace-nowrap"
	style={{ textShadow: 'none', letterSpacing: '-0.01em' }}
>
	Experience Detailing That Turns Heads
</h1>
<h2
	className="text-lg md:text-2xl font-semibold text-white animate-fade-in-up delay-100 subheadline-responsive mt-2 text-center"
>
	Handcrafted Perfection for Your Car, Every Time
</h2>
<p className="text-base md:text-lg text-gold font-medium animate-fade-in-up delay-200 mt-1 mb-2 text-center whitespace-normal md:whitespace-nowrap">
	Book your appointment and see why drivers trust Funi’s Garage for a flawless finish.
</p>
					<button
						className={`mt-6 md:mt-8 px-8 py-3 md:px-12 md:py-4 rounded-xl bg-cobalt text-white font-bold text-lg md:text-2xl shadow-xl border-2 border-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold hover:bg-cobalt-dark hover:scale-105 hover:shadow-2xl active:scale-100 active:bg-cobalt-dark animate-fade-in-up delay-300 flex items-center justify-center gap-2 ${
							loading ? "cursor-wait" : ""
						}`}
						style={{ boxShadow: "0 4px 32px 0 #0033cc55" }}
						onClick={() => window.open("tel:17168015915")}
						disabled={loading}
						aria-label="Call James at Funi's Garage"
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<span className="inline-block w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
								Notifying...
							</span>
						) : notified ? (
							<span className="text-gold">James has been notified!</span>
						) : (
							"Transform Your Ride"
						)}
					</button>
					<div className="flex flex-col md:flex-row gap-0 md:gap-4 mt-4 items-center justify-center animate-fade-in-up delay-400">
						<span className="text-bright-gold font-semibold text-base md:text-lg whitespace-nowrap">
							(716) 801-5915
						</span>
						<span className="hidden md:inline-block text-bright-gold font-semibold text-base md:text-lg">&nbsp;|&nbsp;</span>
						<span className="text-bright-gold font-semibold text-base md:text-lg whitespace-nowrap">
							Serving the Eldred, PA Area
						</span>
					</div>
				</div>
			</section>

			{/* Before/After Section */}
			<section
				ref={el => {
					sectionRefs.current[0] = el;
				}}
				className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-10 md:py-16 opacity-0 transition-opacity duration-1000"
			>
				<div className="flex-1 flex flex-col items-center">
					<span className="text-gold font-semibold mb-2">Before</span>
					<div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 animate-card-fade">
						<Image
							src={beforeImg}
							alt="Before Detailing"
							width={800}
							height={600}
							className="object-cover"
						/>
					</div>
				</div>
				<div className="flex-1 flex flex-col items-center">
					<span className="text-gold font-semibold mb-2">After</span>
					<div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 animate-card-fade">
						<Image
							src={afterImg}
							alt="After Detailing"
							width={800}
							height={600}
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section
				ref={el => {
					sectionRefs.current[1] = el;
				}}
				className="w-full max-w-5xl mx-auto py-8 md:py-12 px-2 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 opacity-0 transition-opacity duration-1000"
			>
				{[
					{
						title: "Exterior Perfection",
						desc: "Hand wash, clay bar, polish, wax, and wheel detailing.",
					},
					{
						title: "Interior Revival",
						desc: "Deep cleaning, stain removal, leather & upholstery care.",
					},
					{
						title: "Engine Bay Shine",
						desc: "Degreasing and dressing for a spotless engine bay.",
					},
				].map((s, i) => (
					<div
						key={s.title}
						className="bg-black/80 border-2 border-gold rounded-2xl p-6 flex flex-col items-center shadow-xl transition-transform duration-300 hover:scale-105 hover:border-cobalt animate-card-fade group"
						style={{ transitionDelay: `${i * 100}ms` }}
					>
						<h3 className="text-xl md:text-2xl font-bold text-gold mb-2 drop-shadow-lg group-hover:text-cobalt transition-colors duration-300">
							{s.title}
						</h3>
						<p className="text-white/80 text-center text-base md:text-lg">
							{s.desc}
						</p>
					</div>
				))}
			</section>

			{/* Testimonials Section */}
			<section
				ref={el => {
					sectionRefs.current[2] = el;
				}}
				className="w-full max-w-4xl mx-auto py-8 md:py-14 px-2 md:px-4 flex flex-col items-center gap-8 opacity-0 transition-opacity duration-1000"
			>
				<h2 className="text-2xl md:text-3xl font-bold text-gold mb-2 text-center animate-fade-in-up">
					What Our Clients Say
				</h2>
				<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
					{testimonials.map((t, idx) => (
						<div
							key={t.name}
							className="bg-black/80 border-2 border-gold rounded-2xl p-6 flex flex-col items-center shadow-lg transition-transform duration-300 hover:scale-105 hover:border-cobalt animate-card-fade"
							style={{ transitionDelay: `${idx * 100}ms` }}
						>
							<div className="flex items-center mb-2">
								{[...Array(t.rating)].map((_, i) => (
									<svg
										key={i}
										className="w-5 h-5 text-gold"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
									</svg>
								))}
							</div>
							<p className="text-white/90 text-center mb-2">
								"{t.review}"
							</p>
							<span className="text-gold font-semibold">{t.name}</span>
						</div>
					))}
				</div>
			</section>

			<style jsx global>{`
				html {
					scroll-behavior: smooth;
				}
				.text-gold {
	color: #FFD700 !important;
	font-weight: 800;
}
				.bg-gradient-to-br {
					background-image: linear-gradient(135deg, #FFD700 0%, #ffe066 60%, #fff 100%);
				}
				.text-bright-gold {
					color: #ffe066 !important;
					text-shadow: 0 1px 8px #FFD70055;
				}
				.bg-cobalt {
					background: #0033cc;
				}
				.hover\:bg-cobalt-dark:hover {
					background: #002299;
				}
				.border-gold {
					border-color: #190f06;
				}
				.hover\:border-cobalt:hover {
					border-color: #0033cc;
				}
				.fade-in-section {
					opacity: 1 !important;
				}
				.animate-fade-in-up {
					animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) both;
				}
				@keyframes fadeInUp {
					0% {
						opacity: 0;
						transform: translateY(40px);
					}
					100% {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-card-fade {
					animation: cardFade 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
				}
				@keyframes cardFade {
					0% {
						opacity: 0;
						transform: scale(0.96);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-logo-fade {
					animation: logoFade 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
				}
				@keyframes logoFade {
					0% {
						opacity: 0;
						transform: scale(0.9);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}
				.hero-glow {
					text-shadow: 0 2px 16px #FFD700, 0 1px 2px #000, 0 0 2px #fff;
				}
				.subheadline-responsive {
					line-height: 1.5;
				}
				@media (max-width: 640px) {
					h1,
					.text-3xl,
					.text-4xl,
					.text-5xl {
						font-size: 1.5rem !important;
					}
					.px-8 {
						padding-left: 1.25rem !important;
						padding-right: 1.25rem !important;
					}
					.py-3 {
						padding-top: 0.75rem !important;
						padding-bottom: 0.75rem !important;
					}
					.subheadline-responsive {
						font-size: 1.1rem !important;
						line-height: 1.7 !important;
					}
					.hero-glow {
						text-shadow: 0 2px 10px #FFD700, 0 1px 2px #000, 0 0 2px #fff;
					}
				}
			`}</style>
		</main>
	);
}

// Tailwind custom colors (add to tailwind.config.ts):
// gold: '#FFD700', cobalt: '#0033CC', cobalt-dark: '#002299'
// Animations: fade-in, fade-in-up, logo-fade, card-fade, text-reveal
// Parallax: backgroundAttachment: 'fixed' (desktop only)
// Above-the-fold: minimal top padding, headline/CTA always visible
// Testimonials: star SVGs, gold accents, realistic reviews
// Button: cobalt, gold border, shadow, spinner on loading
// Section fade-in: .fade-in-section class via scroll
// Mobile: responsive text/button sizes, touch targets
