/**
 * Sleeps for a specified number of milliseconds.
 * @param ms The number of milliseconds to sleep.
 */
export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
