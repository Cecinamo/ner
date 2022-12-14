FROM node:16.15.0 AS builder
CMD echo 'ciao'
ADD ./frontend/package.json /frontend/package.json
WORKDIR /frontend
RUN yarn install
ADD ./frontend /frontend
RUN yarn build --base="/routes/ner/web/"

FROM python:3.10-slim
EXPOSE 8080
ADD ./requirements.lock /
RUN pip install -r /requirements.lock
RUN python -m spacy download it_core_news_sm && \
    python -m spacy download en_core_web_sm && \
    python -m spacy download en_core_web_md && \
    python -m spacy download it_core_news_lg
COPY --from=builder /frontend/dist /frontend/dist
ARG GATEWAY
ENV GATEWAY=$GATEWAY
ADD . /plugin
ENV PYTHONPATH=$PYTHONPATH:/plugin
WORKDIR /plugin/services
CMD python services_ext.py