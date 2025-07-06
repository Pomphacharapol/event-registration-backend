#!/bin/bash

CURENT_PATH=$(pwd)
PASSPHRASE_PATH="$CURENT_PATH/secret-rsa-key-passphrase"
PASSPHRASE_PASS=$(cat $PASSPHRASE_PATH)

# Generate the RSA private key, encrypted with AES-256
openssl genpkey -algorithm RSA -out private.pem -aes256 -pass pass:$PASSPHRASE_PASS

# Generate the corresponding RSA public key from the private key
openssl rsa -pubout -in private.pem -out public.pem -passin pass:$PASSPHRASE_PASS

echo "Keys generated and saved as private.pem and public.pem"
