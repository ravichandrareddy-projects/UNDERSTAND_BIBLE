FROM golang:1.26-alpine@sha256:ecb67f987aa1a57794c91d19ade7ae0209f2f0f5496aaef9e6ae85ddf92d02ab AS build
# The upstream community release is source-only. The Go version below
# identifies release RELEASE.2025-10-15T17-29-55Z by commit.
RUN CGO_ENABLED=0 GOTOOLCHAIN=local GOBIN=/out GOPROXY=https://proxy.golang.org \
    go install -p 2 -trimpath -ldflags="-s -w" github.com/minio/minio@v0.0.0-20251015172955-9e49d5e7a648

FROM alpine:3.23@sha256:469c9ea410b9215eaee7976ba6c0639039b444be8e5d638f7abbada189971eb2
RUN apk add --no-cache ca-certificates su-exec \
    && addgroup -S minio && adduser -S -D -G minio -h /home/minio minio \
    && mkdir /data && chown minio:minio /data
ENV HOME=/home/minio
COPY --from=build /out/minio /usr/local/bin/minio
COPY --chmod=755 start-minio.sh /usr/local/bin/start-minio
ENTRYPOINT ["/usr/local/bin/start-minio"]
