import React from 'react';

// Turns an emoji into an icon component for Studio menus (cached so React keeps the same component).
const cache = {};
export function emojiIcon(char) {
  if (!cache[char]) {
    cache[char] = function EmojiIcon() {
      return (
        <span role="img" aria-hidden="true" style={{ fontSize: '1.25em', lineHeight: 1, display: 'inline-block' }}>
          {char}
        </span>
      );
    };
  }
  return cache[char];
}
