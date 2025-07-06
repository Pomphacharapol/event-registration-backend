@echo off
setlocal

set current_path=%cd%
set CERT_PATH="%current_path%\certificates\cert.crt"
set KEY_PATH="%current_path%\certificates\cert.key"
set PASSPHRASE_PATH="%current_path%\assets\config\secret-ssl-passphrase"

for /f "delims=" %%a in ('type "%PASSPHRASE_PATH%"') do set PASSPHRASE=%%a
echo %PASSPHRASE%

openssl req -new -x509 -days 365 -keyout %KEY_PATH% -out %CERT_PATH% -passout pass:%PASSPHRASE% -subj "/CN=localhost"

echo Certificate renewed successfully.

endlocal
