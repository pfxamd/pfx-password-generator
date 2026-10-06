import { Section } from "../../components/Section";
import { DEFAULT_PASSWORD_OPTIONS } from "../../config/password";
import { usePasswordGenerator } from "../../hooks/usePasswordGenerator";

export function PasswordGenerator() {
  const { snapshot, regenerate } = usePasswordGenerator(
    DEFAULT_PASSWORD_OPTIONS,
  );

  return (
    <Section title="Password">
      <output data-testid="password-output">{snapshot.value}</output>
      <p>{snapshot.entropy.floorBits} bits minimum generation entropy</p>
      <button type="button" onClick={regenerate}>
        Generate
      </button>
    </Section>
  );
}
