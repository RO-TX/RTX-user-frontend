'use client';

import { useId, useState } from 'react';
import { Check, Eye, EyeOff } from './Icons';

/**
 * Password input with a reveal toggle, and — when it is a *new* password —
 * a live checklist of the rules it has to satisfy.
 *
 * The checklist is deliberately not shown on sign-in: the rules changed after
 * the first accounts were made, and telling someone their existing, working
 * password is "invalid" while they type it would be nonsense.
 */

export interface PasswordRule {
  id: string;
  label: string;
  test: (v: string) => boolean;
}

/**
 * `min(8)` / `max(72)` are the backend's own bounds (`auth.validation.ts`);
 * 72 is bcrypt's ceiling, past which extra characters are silently ignored.
 * The character-class rules are stricter than the API currently enforces —
 * see the note in AuthPanel.
 */
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'len', label: '8+ characters', test: (v) => v.length >= 8 && v.length <= 72 },
  { id: 'upper', label: 'Uppercase', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Lowercase', test: (v) => /[a-z]/.test(v) },
  { id: 'digit', label: 'A number', test: (v) => /\d/.test(v) },
];

export const passwordProblems = (v: string) =>
  PASSWORD_RULES.filter((r) => !r.test(v)).map((r) => r.label);

export const isStrongPassword = (v: string) => PASSWORD_RULES.every((r) => r.test(v));

export default function PasswordField({
  name,
  label,
  value,
  onChange,
  autoComplete,
  showRules = false,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: 'current-password' | 'new-password';
  showRules?: boolean;
  hint?: string;
}) {
  const id = useId();
  const [shown, setShown] = useState(false);
  // The list only appears once there is something to judge — an empty form
  // greeting you with four red crosses reads as failure before you start.
  const listId = `${id}-rules`;
  const open = showRules && value.length > 0;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input
          id={id}
          name={name}
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          aria-describedby={open ? listId : undefined}
          // Native validation would fire its own bubble on top of the list.
          maxLength={72}
        />
        <button
          className="pw__eye"
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          aria-pressed={shown}
          // Skipped in the tab order: it is a convenience, and stopping between
          // the password and the submit button on every form is worse.
          tabIndex={-1}
        >
          {shown ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {open && (
        <ul className="pwrules" id={listId} aria-live="polite">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(value);
            return (
              <li className={met ? 'is-met' : undefined} key={rule.id}>
                <span className="pwrules__mark" aria-hidden="true">
                  {met ? <Check /> : null}
                </span>
                {rule.label}
                <span className="sr-only">{met ? ' — met' : ' — not met yet'}</span>
              </li>
            );
          })}
        </ul>
      )}

      {hint && !open && <span className="field__hint">{hint}</span>}
    </div>
  );
}
