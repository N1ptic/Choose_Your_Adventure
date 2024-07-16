FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1
ENV POSTGRES_DB choose_your_adventure
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres

# Install system dependencies
RUN apk update \
    && apk add --no-cache \
        postgresql-dev \
        gcc \
        musl-dev
# Set the working directory in the container
WORKDIR /app

# Install Python dependencies
RUN pip install django djangorestframework django-cors-headers djangorestframework-simplejwt openai psycopg2-binary django-extensions

# Copy the Django application code into the container
COPY . /app/

# Expose port 8000 to the outside world
EXPOSE 7000

# Run Django's development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:7000"]







