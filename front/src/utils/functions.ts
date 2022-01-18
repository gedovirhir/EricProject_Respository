export function GetCurrentTimeInMoscow() {
  const moscowUTC = 3;
  let t = new Date(),
    tt = t.getUTCHours() + moscowUTC;
  const formattedToMoscowTime = ((tt > 24 ? "0" : "") + (tt > 24 ? tt - 24 : tt) + ":" + (t.getMinutes() < 10 ? '0' : '') + t.getMinutes() + ":" + (t.getSeconds() < 10 ? '0' : '') + t.getSeconds());
  const [hours, minutes, seconds] = formattedToMoscowTime.split(':').map(elem => Number(elem));
  return {
    hours,
    minutes,
    seconds,
  }
}