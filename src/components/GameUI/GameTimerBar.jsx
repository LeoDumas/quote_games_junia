function GameTimerBar({
  baseClassName,
  timeLeft,
  roundTime,
  isHidden,
}) {
  const safeRoundTime = roundTime > 0 ? roundTime : 1;
  const timerPct = Math.max(0, Math.min(100, (timeLeft / safeRoundTime) * 100));

  const className = `${baseClassName}${timeLeft <= 5 ? ` ${baseClassName}--urgent` : ""}${
    isHidden ? ` ${baseClassName}--hidden` : ""
  }`;

  return (
    <div
      className={className}
      style={{ "--pct": `${timerPct}%` }}
      role="progressbar"
      aria-valuenow={timeLeft}
      aria-valuemin={0}
      aria-valuemax={roundTime}
      aria-label={`${timeLeft} seconds remaining`}
    />
  );
}

export default GameTimerBar;
