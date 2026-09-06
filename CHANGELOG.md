# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1] - 2026-09-06

### Fixed

- The preview browser-frame's URL bar was a read-only `<span>` that only ever changed when a preset was applied, even though the README advertises "a realistic browser chrome and editable URL hint." It is now a real text input (`#urlBar`, bound to `state.url`) that users can type into directly, with matching CSS so it keeps its compact pill styling instead of falling back to the default full-size text-field look.
