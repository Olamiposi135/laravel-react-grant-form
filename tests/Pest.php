<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
| This file configures Pest test defaults for the project.
| - Binds the Pest closures to Tests\TestCase so tests use Laravel testing helpers.
| - You can add custom expectations and global helper functions below to DRY tests.
|
*/
pest()->extend(Tests\TestCase::class)
  // ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
  ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
  return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
| Global helpers for tests:
| - Keep these minimal and well-documented; they run in the test environment.
| - Use these helpers to reduce repeated test setup/teardown code.
*/
function something()
{
  // Intentionally minimal placeholder helper.
  // Extend this with a real helper only when needed by multiple tests.
}
