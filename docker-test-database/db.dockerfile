FROM postgres:13.7

RUN apt update
RUN apt install jq -y
