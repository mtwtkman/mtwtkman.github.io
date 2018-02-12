FROM rust:latest

RUN rustup default nightly
RUN mkdir /source
WORKDIR /source
COPY src src
COPY blog.db blog.db
COPY Cargo.lock Cargo.lock
COPY Cargo.toml Cargo.toml
COPY Rocket.toml Rocket.toml
