FROM python:3.10

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
WORKDIR hr/
# RUN [ "/bin/bash", "../fill_db.sh"]
EXPOSE 8000

ENTRYPOINT [ "/bin/bash", "../entrypoint.sh"]