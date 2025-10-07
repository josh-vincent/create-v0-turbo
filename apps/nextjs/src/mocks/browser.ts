export async function getWorker() {
  if (typeof window === "undefined") {
    throw new Error("MSW worker can only be used in the browser");
  }
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("@tocld/mocks");
  return setupWorker(...handlers);
}
