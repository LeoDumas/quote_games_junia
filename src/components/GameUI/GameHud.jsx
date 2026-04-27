function GameHud({
  className,
  score,
  streak,
  thirdLabel,
  ariaLabel = "Current score and streak",
}) {
  return (
    <section className={className} aria-label={ariaLabel}>
      <p>Score: {score}</p>
      <p>Streak: {streak}</p>
      <p>{thirdLabel}</p>
    </section>
  );
}

export default GameHud;
