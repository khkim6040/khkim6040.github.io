# GitHub Pages와 동일한 Ruby 3.3. (Ruby 4.0은 github-pages가 의존하는 commonmarker가 지원하지 않는다)
FROM ruby:3.3

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*


# Create a non-root user with UID 1000
RUN groupadd -g 1000 vscode && \
    useradd -m -u 1000 -g vscode vscode

# Gemfile은 저장소 마운트 경로(/usr/src/app) 밖에 둔다.
# 호스트에서 다른 Ruby로 생성된 Gemfile.lock이 마운트로 덮어써져 컨테이너 gem 해석을 깨는 것을 막는다.
WORKDIR /usr/src/gems
COPY --chown=vscode:vscode Gemfile ./
ENV BUNDLE_GEMFILE=/usr/src/gems/Gemfile

# Set the working directory
WORKDIR /usr/src/app

# Set permissions for the working directory
RUN chown -R vscode:vscode /usr/src/app /usr/src/gems

# Switch to the non-root user
USER vscode

# Install dependencies (lockfile is generated inside the image)
RUN bundle install

# Command to serve the Jekyll site
CMD ["bundle", "exec", "jekyll", "serve", "-H", "0.0.0.0", "-w"]
