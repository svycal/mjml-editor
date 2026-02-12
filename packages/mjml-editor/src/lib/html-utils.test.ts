import { describe, expect, it } from 'vitest';
import { highlightLiquidTags } from './html-utils';

describe('highlightLiquidTags', () => {
  it('highlights liquid variables in plain text', () => {
    const result = highlightLiquidTags('Hello {{ first_name }}');

    expect(result).toBe(
      'Hello <span class="liquid-highlight">{{ first_name }}</span>'
    );
  });

  it('highlights liquid tags in plain text', () => {
    const result = highlightLiquidTags('{% if user %}Hi{% endif %}');

    expect(result).toBe(
      '<span class="liquid-highlight">{% if user %}</span>Hi<span class="liquid-highlight">{% endif %}</span>'
    );
  });

  it('does not alter href attributes with liquid variables', () => {
    const input = '<a href="{{ reschedule_url }}">Reschedule</a>';
    const result = highlightLiquidTags(input);

    expect(result).toBe(input);
  });

  it('highlights visible text while preserving liquid href attributes', () => {
    const result = highlightLiquidTags(
      '<a href="{{ url }}">Hi {{ name }}</a>'
    );

    expect(result).toBe(
      '<a href="{{ url }}">Hi <span class="liquid-highlight">{{ name }}</span></a>'
    );
  });

  it('handles multiple links and inline elements without mutating attributes', () => {
    const result = highlightLiquidTags(
      '<a href="{{ one }}">One {{ name }}</a> <strong><a href="{{ two }}">Two {% if ok %}OK{% endif %}</a></strong>'
    );

    expect(result).toBe(
      '<a href="{{ one }}">One <span class="liquid-highlight">{{ name }}</span></a> <strong><a href="{{ two }}">Two <span class="liquid-highlight">{% if ok %}</span>OK<span class="liquid-highlight">{% endif %}</span></a></strong>'
    );
  });

  it('returns empty content as-is', () => {
    expect(highlightLiquidTags('')).toBe('');
  });
});
