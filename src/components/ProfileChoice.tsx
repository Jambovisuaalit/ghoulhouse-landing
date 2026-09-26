import type { ChangeEvent } from 'react';

type ProfileChoiceProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

/** A single accessible opt-out shared by the proposal and photo forms. */
export default function ProfileChoice({ checked, onChange }: ProfileChoiceProps) {
  const handleChange = onChange
    ? (event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.checked)
    : undefined;

  return (
    <label className="profileChoice">
      <input
        type="checkbox"
        name="noProfile"
        value="true"
        {...(checked === undefined ? {} : { checked })}
        onChange={handleChange}
      />
      Ei vielä verkkosivua tai Instagramia
    </label>
  );
}
