#!/bin/sh
set -eu

# Read the owner-only Compose secret before switching to the service account.
MINIO_ROOT_PASSWORD="$(cat "${MINIO_ROOT_PASSWORD_FILE:?}")"
export MINIO_ROOT_PASSWORD
unset MINIO_ROOT_PASSWORD_FILE
exec su-exec minio:minio minio "$@"
