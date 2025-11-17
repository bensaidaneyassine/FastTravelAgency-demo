FROM php:8.3-rc-fpm

ARG WWWGROUP

WORKDIR /var/www/html

ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y \
    gnupg gosu curl ca-certificates zip unzip supervisor sqlite3 libpq-dev libzip-dev zlib1g-dev libpng-dev \
    libonig-dev libicu-dev libssl-dev libxml2-dev libcap2-bin dh-python dnsutils librsvg2-bin fswatch

RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

RUN docker-php-ext-configure intl \
    && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pgsql pdo_pgsql exif  # Add exif extension here

RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

RUN echo "php_ini = /usr/local/etc/php/php.ini" > /usr/local/etc/php/conf.d/php.ini \
    && echo "extension=mongodb.so" >> /usr/local/etc/php/conf.d/php.ini

RUN groupadd --force --gid $WWWGROUP sail \
    && useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

COPY ./.ci/start-container /usr/local/bin/start-container
COPY ./.ci/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./.ci/php.ini /etc/php/8.3/cli/conf.d/99-sail.ini

RUN chmod +x /usr/local/bin/start-container
