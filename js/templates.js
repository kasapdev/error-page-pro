/* =====================================================================
   Error Page Builder Pro — templates.js
   Preset definitions and example states. Classic script (no modules).
   Exposes window.EPB_TEMPLATES.
   ===================================================================== */
(function () {
  'use strict';

  /* Each preset fills sensible defaults for a given error type. Fields that
     are visual (illustration, background, colors) are kept stable so users
     can switch error types without losing their chosen look — only the
     content-related fields and the URL bar hint change. */
  var PRESETS = {
    '404': {
      code: '404',
      title: 'Page not found',
      message: 'The page you’re looking for doesn’t exist, was moved, or never existed at all.',
      btnLabel: 'Back to home',
      btnUrl: '/',
      emoji: '🛰️',
      url: 'example.com/missing-page'
    },
    '403': {
      code: '403',
      title: 'Access denied',
      message: 'You don’t have permission to view this page. If you think this is a mistake, contact your administrator.',
      btnLabel: 'Back to home',
      btnUrl: '/',
      emoji: '🔒',
      url: 'example.com/admin'
    },
    '500': {
      code: '500',
      title: 'Something went wrong',
      message: 'Our server hit an unexpected error. We’ve been notified and are working on a fix. Please try again shortly.',
      btnLabel: 'Reload page',
      btnUrl: '/',
      emoji: '💥',
      url: 'example.com/app'
    },
    '503': {
      code: '503',
      title: 'Service unavailable',
      message: 'We’re temporarily overloaded or down for a moment. Hang tight — this usually resolves within a few minutes.',
      btnLabel: 'Try again',
      btnUrl: '/',
      emoji: '⏳',
      url: 'example.com/checkout'
    },
    'maintenance': {
      code: '🛠',
      title: 'Down for maintenance',
      message: 'We’re making things better behind the scenes. We’ll be back online shortly — thanks for your patience.',
      btnLabel: 'Check status',
      btnUrl: '/status',
      emoji: '🛠️',
      url: 'example.com',
      illustration: 'emoji'
    },
    'custom': {
      code: 'Oops',
      title: 'This isn’t the page you wanted',
      message: 'Write your own headline and message to craft a fully custom error experience.',
      btnLabel: 'Go back',
      btnUrl: '/',
      emoji: '✨',
      url: 'example.com/custom'
    }
  };

  /* A fully fleshed-out, opinionated example to showcase the tool. */
  var EXAMPLE = {
    preset: '404',
    code: '404',
    title: 'Lost in space',
    message: 'The page you’re hunting for drifted off into the void. Let’s get you back to solid ground.',
    footer: '© 2026 Nebula Labs — All rights reserved.',
    btnLabel: 'Back to mission control',
    btnUrl: '/',
    secEnabled: true,
    secLabel: 'Report a broken link',
    secUrl: '/support',
    emoji: '🛰️',
    illustration: 'svg',
    background: 'starfield',
    accent: '#22d3ee',
    bg1: '#070b1a',
    bg2: '#10193a',
    dark: true,
    search: true,
    url: 'nebula-labs.io/explore/sector-9'
  };

  /* The default state the app boots with on first run / after reset. */
  var DEFAULT = {
    preset: '404',
    code: '404',
    title: 'Page not found',
    message: 'The page you’re looking for doesn’t exist, was moved, or never existed at all.',
    footer: '© Acme, Inc. — All rights reserved.',
    btnLabel: 'Back to home',
    btnUrl: '/',
    secEnabled: false,
    secLabel: 'Contact support',
    secUrl: '/support',
    emoji: '🛰️',
    illustration: 'svg',
    background: 'gradient',
    accent: '#6366f1',
    bg1: '#0b1020',
    bg2: '#1e1b4b',
    dark: true,
    search: false,
    url: 'example.com/missing-page'
  };

  window.EPB_TEMPLATES = { PRESETS: PRESETS, EXAMPLE: EXAMPLE, DEFAULT: DEFAULT };
})();
