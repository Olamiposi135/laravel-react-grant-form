{{-- <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Community Impact Grant</title>

  @php
    $manifest = json_decode(file_get_contents(public_path('build/.vite/manifest.json')), true);
    $entry = $manifest['index.html'];
  @endphp

  @if (!empty($entry['css']))
    <link rel="stylesheet" href="/build/{{ $entry['css'][0] }}">
  @endif

  <script type="module" src="/build/{{ $entry['file'] }}"></script>
</head>

<body>
  <div id="root"></div>
</body>

</html> --}}

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Community Impact Grant</title>
</head>

<body>
  <h1>Community Impact Grant Application API</h1>
</body>

</html>
