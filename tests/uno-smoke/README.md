# Uno smoke fixture

This fixture exists only to compile generated XAML in isolation.

The regression suite copies this folder to a temporary directory, overwrites
`GeneratedPage.xaml` with the latest exported page, and runs `dotnet build`
against `UnoSmoke.csproj`.

It does not affect the app runtime or generation behavior.
