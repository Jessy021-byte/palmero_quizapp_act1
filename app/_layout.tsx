import { Stack } from "expo-router";
import { QuizProvider } from "./context/_layout";

export default function Layout() {
  return (
    <QuizProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="results" />
      </Stack>
    </QuizProvider>
  );
}
