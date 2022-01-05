export const sumDurations = (data) => {
  const reducer = (accumulator, next) => {
    if (/^\d?\d:\d{2}:\d{2}$/.test(next?.duracion)) {
      const times = next?.duracion?.split(":");
      const hours = Number(times[0]);
      const minutes = Number(times[1]);
      const seconds = Number(times[2]);
      const secondsHours = hours * 60 * 60;
      const secondsMinutes = minutes * 60;
      return accumulator + (seconds + secondsHours + secondsMinutes);
    }
    return accumulator;
  };
  let totalSecondsReducer = data?.reduce(reducer, 0);
  const totalSeconds = totalSecondsReducer;
  const hours = Math.floor(totalSecondsReducer / 3600);
  totalSecondsReducer %= 3600;
  const minutes = Math.floor(totalSecondsReducer / 60);
  const seconds = totalSecondsReducer % 60;

  let minutesString = String(minutes).padStart(2, "0");
  let hoursString = String(hours).padStart(2, "0");
  let secondsString = String(seconds).padStart(2, "0");
  hoursString = hoursString === "00" ? `` : `${hoursString}hr(s):`;
  minutesString =
    hoursString === "00" && minutesString === "00"
      ? ``
      : `${minutesString}min:`;
  secondsString =
    hoursString === "00" && minutesString === "00" && secondsString === "00"
      ? `--`
      : `${secondsString}seg`;
  return {
    formatted: `${hoursString}${minutesString}${secondsString}`,
    totalSeconds,
  };
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
