export const GAME_CONFIG = {
	INITIAL_TIME: 30, // Seconds
	POINTS_PER_CORRECT: 100,
	PENALTY_PER_WRONG: 0, // You can change this to -50 later if you want
	TOTAL_QUESTIONS_LIMIT: 100, // Stop game after this many cards
	GREEN_FLASH_DURATION: 300, // Milliseconds for UI feedback
	RATE_LIMIT_MS: 30000, // 30 seconds between score submissions
	MIN_SESSION_AGE_SECONDS: 2, // Minimum time before accepting score submissions
	MIN_USERNAME_LENGTH: 2, // Minimum characters for username
}
