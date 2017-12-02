FROM frolvlad/alpine-rust

RUN mkdir /source
WORKDIR /source
COPY assets assets
COPY src src
COPY Cargo.lock Cargo.lock
COPY Cargo.toml Cargo.toml
