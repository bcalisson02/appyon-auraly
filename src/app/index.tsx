import { Redirect } from 'expo-router';

/**
 * App launcher. The Appyon test has two products; Risely (Desafio 1) will be added
 * as a sibling of /auraly. Until then, the launcher opens Auraly directly.
 */
export default function Launcher() {
  return <Redirect href="/auraly" />;
}
