# Design Decisions

## 1. Request cancellation

The application uses AbortController to cancel outdated requests.

When the user changes the search query, the previous request is aborted immediately, before the debounce timer starts a new request.

This prevents outdated responses from updating the interface.

A simple boolean flag would only ignore outdated results. AbortController actually cancels the network request.

## 2. Debounce

The debounce delay is 300 milliseconds.

This value provides a balance between responsiveness and reducing unnecessary network requests.

Without debounce, every keystroke would trigger a request.

An excessively large delay would make the search feel slow.

## 3. Big O complexity

The mapCountryResponse function processes the fields of one country.

Its complexity is O(L + C + B), where:

- L is the number of languages;
- C is the number of currencies;
- B is the number of bordering countries.

## 4. Clean Code principles

- Single Responsibility Principle: API requests, mapping, UI and debounce are separated.
- Meaningful naming: functions and variables have descriptive names.
- Type safety: TypeScript interfaces describe API and application data.
- Error handling: network errors, HTTP errors, timeouts and cancellations are handled separately.
- Separation of concerns: business logic does not depend on DOM rendering.
